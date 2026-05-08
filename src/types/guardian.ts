export type AlertType =
  | 'revenge_trading'
  | 'fatigue'
  | 'risk_escalation'
  | 'emotional_instability'
  | 'exposure_warning'
  | 'overtrading'
  | 'session_duration';

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

export interface RiskGuardianSettings {
  userId: string;
  maxSessionDuration: number;
  maxTradesPerSession: number;
  maxTradesPerWindow: number;
  exposureMultiplier: number;
  fatigueWarningEnabled: boolean;
  revengeTradingAlertEnabled: boolean;
  emotionalInstabilityThreshold: number;
}

export interface PauseMode {
  active: boolean;
  startedAt?: Date;
  durationMinutes?: number;
  reason?: 'user_initiated' | 'system_suggested';
}

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
}

export interface DetectionInput {
  userId: string;
  recentTrades: TradeInput[];
  currentExposure: number;
  historicalAverage: number;
  sessionStart: Date;
  emotionalStates: string[];
  settings: RiskGuardianSettings;
}

export type ProfileType = 'Sniper' | 'Analyst' | 'Warrior' | 'default';

export const PROFILE_DEFAULTS: Record<ProfileType, Omit<RiskGuardianSettings, 'userId'>> = {
  Sniper: {
    maxSessionDuration: 180,
    maxTradesPerSession: 60,
    maxTradesPerWindow: 10,
    exposureMultiplier: 1.50,
    fatigueWarningEnabled: true,
    revengeTradingAlertEnabled: true,
    emotionalInstabilityThreshold: 7
  },
  Analyst: {
    maxSessionDuration: 90,
    maxTradesPerSession: 30,
    maxTradesPerWindow: 5,
    exposureMultiplier: 1.15,
    fatigueWarningEnabled: true,
    revengeTradingAlertEnabled: true,
    emotionalInstabilityThreshold: 3
  },
  Warrior: {
    maxSessionDuration: 120,
    maxTradesPerSession: 50,
    maxTradesPerWindow: 8,
    exposureMultiplier: 1.30,
    fatigueWarningEnabled: true,
    revengeTradingAlertEnabled: true,
    emotionalInstabilityThreshold: 5
  },
  default: {
    maxSessionDuration: 120,
    maxTradesPerSession: 50,
    maxTradesPerWindow: 8,
    exposureMultiplier: 1.30,
    fatigueWarningEnabled: true,
    revengeTradingAlertEnabled: true,
    emotionalInstabilityThreshold: 5
  }
};