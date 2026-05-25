import { createClient } from '@/lib/supabase/server';
import { 
  Alert, 
  AlertType, 
  Severity, 
  DetectionInput, 
  RiskGuardianSettings,
  PROFILE_DEFAULTS,
  ProfileType,
  ABUSE_DETECTION_DEFAULTS,
} from '../../types/guardian';
import { detectRevengeTrading } from './rules/revenge';
import { detectFatigue } from './rules/fatigue';
import { detectEmotionalInstability } from './rules/emotional';
import { detectRiskEscalation, detectExposureWarning } from './rules/exposure';
import { detectOvertrading } from './rules/overtrading';
import { detectAbusiveScalping } from './rules/scalping';
import { detectArbitrageBehavior } from './rules/arbitrage';
import { detectHedgingBehavior } from './rules/hedging';
import { getActiveSession } from './session-tracker';

// Cooldown map to prevent alert spam (keyed per user + type)
const alertCooldowns: Map<string, number> = new Map();
const COOLDOWN_MS = 5 * 60 * 1_000; // 5 minutes

// Abuse-detection alerts use a longer cooldown (1 hour) to avoid repeated flags
// on the same behavioural pattern within a single session.
const ABUSE_COOLDOWN_MS = 60 * 60 * 1_000; // 1 hour
const ABUSE_ALERT_TYPES = new Set<AlertType>([
  'abusive_scalping',
  'arbitrage_behavior',
  'hedging_behavior',
]);

/**
 * Central detection engine — evaluates all pattern rules.
 */
export function detectAlerts(input: DetectionInput): Alert[] {
  const alerts: Alert[] = [];
  const now = Date.now();

  const ruleResults: { type: AlertType; alert: Alert | null }[] = [
    { type: 'revenge_trading',       alert: detectRevengeTrading(input) },
    { type: 'fatigue',               alert: detectFatigue(input) },
    { type: 'emotional_instability', alert: detectEmotionalInstability(input) },
    { type: 'risk_escalation',       alert: detectRiskEscalation(input) },
    { type: 'exposure_warning',      alert: detectExposureWarning(input) },
    { type: 'overtrading',           alert: detectOvertrading(input) },
    // ── Abuse-detection rules ─────────────────────────────────────────────
    { type: 'abusive_scalping',      alert: detectAbusiveScalping(input) },
    { type: 'arbitrage_behavior',    alert: detectArbitrageBehavior(input) },
    { type: 'hedging_behavior',      alert: detectHedgingBehavior(input) },
  ];

  for (const result of ruleResults) {
    if (!result.alert) continue;

    const cooldownMs = ABUSE_ALERT_TYPES.has(result.type) ? ABUSE_COOLDOWN_MS : COOLDOWN_MS;
    const cooldownKey = `${input.userId}:${result.type}`;
    const lastTriggered = alertCooldowns.get(cooldownKey);
    if (lastTriggered && now - lastTriggered < cooldownMs) continue;

    alerts.push(result.alert);
    alertCooldowns.set(cooldownKey, now);
  }

  return alerts;
}

/**
 * Run a full check for a user.
 * Fetches data from Supabase and runs all detection rules.
 */
export async function runFullCheck(
  userId: string,
  settings: RiskGuardianSettings
): Promise<Alert[]> {
  try {
    const supabase = await createClient();

    // Fetch recent trades (last 100, last 24 hours) — extended field set
    const since = new Date(Date.now() - 24 * 60 * 60 * 1_000).toISOString();
    const { data: trades, error } = await supabase
      .from('trades')
      .select('id, user_id, entry_time, exit_time, symbol, result, lot_size, emotional_state, pnl, entry_price, exit_price, stop_loss, take_profit')
      .eq('user_id', userId)
      .gte('entry_time', since)
      .order('entry_time', { ascending: false })
      .limit(100);

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

    // Current exposure — sum of open positions
    const { data: openTrades } = await supabase
      .from('trades')
      .select('lot_size')
      .eq('user_id', userId)
      .is('exit_time', null);

    const currentExposure = openTrades?.reduce((sum, t) => sum + (t.lot_size || 0), 0) || 0;

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
        pnl: t.pnl,
        entryPrice: t.entry_price ?? undefined,
        exitPrice: t.exit_price ?? undefined,
        stopLoss: t.stop_loss ?? undefined,
        takeProfit: t.take_profit ?? undefined,
      })),
      currentExposure,
      historicalAverage,
      sessionStart,
      emotionalStates,
      settings,
    };

    return detectAlerts(detectionInput);
  } catch (error) {
    console.error('Error running full check:', error);
    return [];
  }
}

/**
 * Create a new alert object.
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
    acknowledged: false,
  };
}

/**
 * Get user settings from database or return defaults.
 * Falls back gracefully when new columns don't exist yet (pre-migration).
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
      return { userId, ...PROFILE_DEFAULTS.default };
    }

    return {
      userId,
      maxSessionDuration: data.max_session_duration,
      maxTradesPerSession: data.max_trades_per_session,
      maxTradesPerWindow: data.max_trades_per_window,
      exposureMultiplier: Number(data.exposure_multiplier),
      fatigueWarningEnabled: data.fatigue_warning_enabled,
      revengeTradingAlertEnabled: data.revenge_trading_alert_enabled,
      emotionalInstabilityThreshold: data.emotional_instability_threshold,

      // Abuse-detection settings — fall back to defaults when column is NULL
      scalpingEnabled:              data.scalping_enabled               ?? ABUSE_DETECTION_DEFAULTS.scalpingEnabled,
      scalpingMinDurationSeconds:   data.scalping_min_duration_seconds  ?? ABUSE_DETECTION_DEFAULTS.scalpingMinDurationSeconds,
      scalpingMaxTradesPerDay:      data.scalping_max_trades_per_day    ?? ABUSE_DETECTION_DEFAULTS.scalpingMaxTradesPerDay,

      arbitrageEnabled:                 data.arbitrage_enabled                   ?? ABUSE_DETECTION_DEFAULTS.arbitrageEnabled,
      arbitrageMaxAvgDurationSeconds:   data.arbitrage_max_avg_duration_seconds  ?? ABUSE_DETECTION_DEFAULTS.arbitrageMaxAvgDurationSeconds,
      arbitrageMinWinRate:              Number(data.arbitrage_min_win_rate       ?? ABUSE_DETECTION_DEFAULTS.arbitrageMinWinRate),
      arbitrageMaxRR:                   Number(data.arbitrage_max_rr             ?? ABUSE_DETECTION_DEFAULTS.arbitrageMaxRR),

      hedgingEnabled:              data.hedging_enabled               ?? ABUSE_DETECTION_DEFAULTS.hedgingEnabled,
      hedgingTimeWindowSeconds:    data.hedging_time_window_seconds    ?? ABUSE_DETECTION_DEFAULTS.hedgingTimeWindowSeconds,
      hedgingLotSizeTolerance:     Number(data.hedging_lot_size_tolerance ?? ABUSE_DETECTION_DEFAULTS.hedgingLotSizeTolerance),
    };
  } catch (error) {
    console.error('Error getting user settings:', error);
    return { userId, ...PROFILE_DEFAULTS.default };
  }
}
