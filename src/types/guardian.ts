// ─── Alert Types ─────────────────────────────────────────────────────────────

export type AlertType =
  | 'revenge_trading'
  | 'fatigue'
  | 'risk_escalation'
  | 'emotional_instability'
  | 'exposure_warning'
  | 'overtrading'
  | 'session_duration'
  // Abuse-detection alerts
  | 'abusive_scalping'
  | 'arbitrage_behavior'
  | 'hedging_behavior';

export type Severity = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  userId: string;
  type: AlertType;
  severity: Severity;
  title: string;
  message: string;
  suggestedAction: string;
  triggeredAt: Date;
  tradeIds?: string[];
  acknowledged: boolean;
  acknowledgedAt?: Date;
}

// ─── Risk Guardian Settings ───────────────────────────────────────────────────

export interface RiskGuardianSettings {
  userId: string;

  // Existing thresholds
  maxSessionDuration: number;
  maxTradesPerSession: number;
  maxTradesPerWindow: number;
  exposureMultiplier: number;
  fatigueWarningEnabled: boolean;
  revengeTradingAlertEnabled: boolean;
  emotionalInstabilityThreshold: number;

  // ── Abusive-Scalping Detection ────────────────────────────────────────────
  /** Enable high-frequency scalping detection */
  scalpingEnabled: boolean;
  /** Trades shorter than this (seconds) count as scalps */
  scalpingMinDurationSeconds: number;
  /** Max scalp trades per day before alert fires */
  scalpingMaxTradesPerDay: number;

  // ── Arbitrage-Like Behavior Detection ────────────────────────────────────
  /** Enable arbitrage-pattern detection */
  arbitrageEnabled: boolean;
  /** Average trade duration ceiling (seconds) for the pattern */
  arbitrageMaxAvgDurationSeconds: number;
  /** Minimum win rate (0–100) required for pattern */
  arbitrageMinWinRate: number;
  /** Maximum risk-reward ratio for the pattern */
  arbitrageMaxRR: number;

  // ── Hedging Behavior Detection ────────────────────────────────────────────
  /** Enable external-hedging detection */
  hedgingEnabled: boolean;
  /** Time window (seconds) within which opposing positions are considered a hedge */
  hedgingTimeWindowSeconds: number;
  /** Lot-size similarity tolerance (0–1, e.g. 0.1 = within 10%) */
  hedgingLotSizeTolerance: number;
}

// ─── Pause Mode ───────────────────────────────────────────────────────────────

export interface PauseMode {
  active: boolean;
  startedAt?: Date;
  durationMinutes?: number;
  reason?: 'user_initiated' | 'system_suggested';
}

// ─── Trade Input ──────────────────────────────────────────────────────────────

export interface TradeInput {
  id: string;
  userId: string;
  entryTime: string | Date;
  exitTime?: string | Date;
  symbol: string;
  result?: 'win' | 'loss' | 'breakeven';
  lotSize: number;
  emotionalState?: 'confident' | 'frustrated' | 'fearful' | 'neutral';
  pnl?: number;
  // Additional fields used by abuse-detection rules
  entryPrice?: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
}

// ─── Detection Input ──────────────────────────────────────────────────────────

export interface DetectionInput {
  userId: string;
  recentTrades: TradeInput[];
  currentExposure: number;
  historicalAverage: number;
  sessionStart: Date;
  emotionalStates: string[];
  settings: RiskGuardianSettings;
}

// ─── Behavioral Flags (Abuse Detection) ──────────────────────────────────────

export type FlagType = 'abusive_scalping' | 'arbitrage_behavior' | 'hedging_behavior';

export interface BehavioralFlag {
  id: string;
  userId: string;
  flagType: FlagType;
  detectedAt: string;         // ISO timestamp
  details: {
    // Scalping
    scalpTradeCount?: number;
    scalpMinDurationSeconds?: number;
    // Arbitrage
    avgDurationSeconds?: number;
    winRate?: number;
    avgRR?: number;
    // Hedging
    hedgePairs?: Array<{
      symbol: string;
      lotSizeDiff: number;
      windowSeconds: number;
    }>;
  };
  tradeIds: string[];
  isActive: boolean;
  clearedAt?: string;
  clearedBy?: string;
}

// ─── Profile Types & Defaults ─────────────────────────────────────────────────

// Matches the lowercase values stored in the DB (trader_profiles.profile_type)
export type ProfileType = 'sniper' | 'analyst' | 'warrior' | 'disciplinarian' | 'opportunist' | 'default';

/** Default abuse-detection thresholds (same for all profiles). */
export const ABUSE_DETECTION_DEFAULTS: Omit<
  RiskGuardianSettings,
  'userId' | 'maxSessionDuration' | 'maxTradesPerSession' | 'maxTradesPerWindow' |
  'exposureMultiplier' | 'fatigueWarningEnabled' | 'revengeTradingAlertEnabled' |
  'emotionalInstabilityThreshold'
> = {
  scalpingEnabled: true,
  scalpingMinDurationSeconds: 60,
  scalpingMaxTradesPerDay: 10,

  arbitrageEnabled: true,
  arbitrageMaxAvgDurationSeconds: 60,
  arbitrageMinWinRate: 80,
  arbitrageMaxRR: 0.5,

  hedgingEnabled: true,
  hedgingTimeWindowSeconds: 300,
  hedgingLotSizeTolerance: 0.1,
};

export const PROFILE_DEFAULTS: Record<ProfileType, Omit<RiskGuardianSettings, 'userId'>> = {
  sniper: {
    maxSessionDuration: 180,
    maxTradesPerSession: 60,
    maxTradesPerWindow: 10,
    exposureMultiplier: 1.50,
    fatigueWarningEnabled: true,
    revengeTradingAlertEnabled: true,
    emotionalInstabilityThreshold: 7,
    ...ABUSE_DETECTION_DEFAULTS,
  },
  analyst: {
    maxSessionDuration: 90,
    maxTradesPerSession: 30,
    maxTradesPerWindow: 5,
    exposureMultiplier: 1.15,
    fatigueWarningEnabled: true,
    revengeTradingAlertEnabled: true,
    emotionalInstabilityThreshold: 3,
    ...ABUSE_DETECTION_DEFAULTS,
  },
  warrior: {
    maxSessionDuration: 120,
    maxTradesPerSession: 50,
    maxTradesPerWindow: 8,
    exposureMultiplier: 1.30,
    fatigueWarningEnabled: true,
    revengeTradingAlertEnabled: true,
    emotionalInstabilityThreshold: 5,
    ...ABUSE_DETECTION_DEFAULTS,
  },
  disciplinarian: {
    maxSessionDuration: 150,
    maxTradesPerSession: 40,
    maxTradesPerWindow: 6,
    exposureMultiplier: 1.10,
    fatigueWarningEnabled: true,
    revengeTradingAlertEnabled: true,
    emotionalInstabilityThreshold: 2,
    ...ABUSE_DETECTION_DEFAULTS,
  },
  opportunist: {
    maxSessionDuration: 120,
    maxTradesPerSession: 60,
    maxTradesPerWindow: 12,
    exposureMultiplier: 1.40,
    fatigueWarningEnabled: true,
    revengeTradingAlertEnabled: true,
    emotionalInstabilityThreshold: 6,
    ...ABUSE_DETECTION_DEFAULTS,
  },
  default: {
    maxSessionDuration: 120,
    maxTradesPerSession: 50,
    maxTradesPerWindow: 8,
    exposureMultiplier: 1.30,
    fatigueWarningEnabled: true,
    revengeTradingAlertEnabled: true,
    emotionalInstabilityThreshold: 5,
    ...ABUSE_DETECTION_DEFAULTS,
  },
};
