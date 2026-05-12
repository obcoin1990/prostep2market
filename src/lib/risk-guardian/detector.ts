import { createClient } from '@/lib/supabase/server';
import { 
  Alert, 
  AlertType, 
  Severity, 
  DetectionInput, 
  RiskGuardianSettings,
  PROFILE_DEFAULTS,
  ProfileType
} from '../../types/guardian';
import { detectRevengeTrading } from './rules/revenge';
import { detectFatigue } from './rules/fatigue';
import { detectEmotionalInstability } from './rules/emotional';
import { detectRiskEscalation, detectExposureWarning } from './rules/exposure';
import { detectOvertrading } from './rules/overtrading';
import { getActiveSession } from './session-tracker';

// Cooldown map to prevent alert spam
const alertCooldowns: Map<string, number> = new Map();
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Central detection engine that evaluates all pattern rules
 */

export function detectAlerts(input: DetectionInput): Alert[] {
  const alerts: Alert[] = [];
  const now = Date.now();

  // Run all detection rules
  const ruleResults = [
    { type: 'revenge_trading', alert: detectRevengeTrading(input) },
    { type: 'fatigue', alert: detectFatigue(input) },
    { type: 'emotional_instability', alert: detectEmotionalInstability(input) },
    { type: 'risk_escalation', alert: detectRiskEscalation(input) },
    { type: 'exposure_warning', alert: detectExposureWarning(input) },
    { type: 'overtrading', alert: detectOvertrading(input) }
  ];

  for (const result of ruleResults) {
    if (!result.alert) continue;

    // Check cooldown for this alert type
    const lastTriggered = alertCooldowns.get(result.type);
    if (lastTriggered && (now - lastTriggered) < COOLDOWN_MS) {
      continue; // Skip - too soon since last alert
    }

    alerts.push(result.alert);
    alertCooldowns.set(result.type, now);
  }

  return alerts;
}

/**
 * Run a full check for a user
 * Fetches data from Supabase and runs all detection rules
 */
export async function runFullCheck(
  userId: string, 
  settings: RiskGuardianSettings
): Promise<Alert[]> {
  try {
    const supabase = await createClient();

    // Fetch recent trades (last 50, last 24 hours)
    const { data: trades, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('entry_time', { ascending: false })
      .limit(50);

    if (error || !trades) {
      console.error('Error fetching trades:', error);
      return [];
    }

    // Calculate historical average lot size
    const lotSizes = trades.map(t => t.lot_size || 0).filter(l => l > 0);
    const historicalAverage = lotSizes.length > 0 
      ? lotSizes.reduce((sum, l) => sum + l, 0) / lotSizes.length 
      : 0;

    // Get session info
    const sessionInfo = await getActiveSession(userId);
    const sessionStart = sessionInfo?.sessionStart || new Date();

    // Extract emotional states
    const emotionalStates = trades
      .filter(t => t.emotional_state)
      .map(t => t.emotional_state);

    // Current exposure - sum of open positions
    const { data: openTrades } = await supabase
      .from('trades')
      .select('lot_size')
      .eq('user_id', userId)
      .is('exit_time', null);

    const currentExposure = openTrades?.reduce((sum, t) => sum + (t.lot_size || 0), 0) || 0;

    // Build detection input
    const detectionInput: DetectionInput = {
      userId,
      recentTrades: trades.map(t => ({
        id: t.id,
        userId: t.user_id,
        entryTime: t.entry_time,
        exitTime: t.exit_time,
        symbol: t.symbol,
        result: t.result as 'win' | 'loss' | 'breakeven' | undefined,
        lotSize: t.lot_size || 0,
        emotionalState: t.emotional_state as 'confident' | 'frustrated' | 'fearful' | 'neutral' | undefined,
        pnl: t.pnl
      })),
      currentExposure,
      historicalAverage,
      sessionStart,
      emotionalStates,
      settings
    };

    return detectAlerts(detectionInput);
  } catch (error) {
    console.error('Error running full check:', error);
    return [];
  }
}

/**
 * Create a new alert object
 */
export function createAlert(params: {
  type: AlertType;
  severity: Severity;
  title: string;
  message: string;
  suggestedAction: string;
  userId: string;
  tradeIds?: string[];
}): Alert {
  return {
    id: crypto.randomUUID(),
    userId: params.userId,
    type: params.type,
    severity: params.severity,
    title: params.title,
    message: params.message,
    suggestedAction: params.suggestedAction,
    triggeredAt: new Date(),
    tradeIds: params.tradeIds,
    acknowledged: false
  };
}

/**
 * Get user settings from database or return defaults
 */
export async function getUserSettings(userId: string): Promise<RiskGuardianSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('risk_guardian_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      // Return default settings
      return {
        userId,
        ...PROFILE_DEFAULTS.default
      };
    }

    return {
      userId,
      maxSessionDuration: data.max_session_duration,
      maxTradesPerSession: data.max_trades_per_session,
      maxTradesPerWindow: data.max_trades_per_window,
      exposureMultiplier: Number(data.exposure_multiplier),
      fatigueWarningEnabled: data.fatigue_warning_enabled,
      revengeTradingAlertEnabled: data.revenge_trading_alert_enabled,
      emotionalInstabilityThreshold: data.emotional_instability_threshold
    };
  } catch (error) {
    console.error('Error getting user settings:', error);
    return {
      userId,
      ...PROFILE_DEFAULTS.default
    };
  }
}