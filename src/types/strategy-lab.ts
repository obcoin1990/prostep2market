// Strategy Lab TypeScript Type Definitions

export interface Strategy {
  id: string;
  userId: string;
  name: string;
  entryRules: EntryRule[];
  exitRules: ExitRule[];
  riskRules: RiskRule[];
  createdAt: Date;
  lastTestedAt?: Date;
}

export type EntryCondition = 
  | 'price_above' 
  | 'price_below' 
  | 'ma_cross' 
  | 'rsi_above' 
  | 'rsi_below' 
  | 'custom';

export type Timeframe = 'M5' | 'M15' | 'H1' | 'H4' | 'D1';

export interface EntryRule {
  condition: EntryCondition;
  value: string;
  timeframes: Timeframe[];
}

export type ExitRuleType = 'tp' | 'sl' | 'trailing' | 'time';
export type ExitRuleUnit = 'pips' | 'percent' | 'atr';

export interface ExitRule {
  type: ExitRuleType;
  value: number;
  unit: ExitRuleUnit;
}

export type RiskRuleType = 'fixed_lot' | 'percent_balance' | 'kelly' | 'atr_based';

export interface RiskRule {
  type: RiskRuleType;
  value: number;
  maxDrawdownPercent: number;
}

// Simulation
export interface SimulationResult {
  id: string;
  userId: string;
  strategyId: string;
  startDate: Date;
  endDate: Date;
  parameters: SimulationParameters;
  results: SimulationMetrics;
  createdAt: Date;
}

export interface SimulationParameters {
  pair: string;
  sessionFilter?: string[];
  includeNewsEvents: boolean;
  behaviorRules: BehaviorRule[];
  initialBalance?: number;
}

export interface SimulationMetrics {
  totalTrades: number;
  winRate: number;
  avgRR: number;
  totalPnl: number;
  maxDrawdown: number;
  consistencyScore: number;
  behavioralImpact: BehavioralImpact[];
}

export type BehaviorRuleType = 
  | 'stop_after_losses' 
  | 'stop_after_wins' 
  | 'cooldown_after_trades' 
  | 'max_daily_trades';

export interface BehaviorRule {
  type: BehaviorRuleType;
  value: number;
}

export interface BehavioralImpact {
  ruleType: BehaviorRuleType;
  originalPnl: number;
  withRulesPnl: number;
  impact: number;
}

// Candle data
export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Trade
export interface Trade {
  entryTime: number;
  entryPrice: number;
  exitTime: number;
  exitPrice: number;
  pnl: number;
  rr: number;
  reason: string;
}

// Database row types
export interface StrategyRow {
  id: string;
  user_id: string;
  name: string;
  entry_rules: EntryRule[];
  exit_rules: ExitRule[];
  risk_rules: RiskRule[];
  created_at: string;
  last_tested_at: string | null;
}

export interface SimulationResultRow {
  id: string;
  user_id: string;
  strategy_id: string;
  parameters: SimulationParameters;
  results: SimulationMetrics;
  created_at: string;
}

// Form validation types
export const entryRuleSchema = {
  condition: ['price_above', 'price_below', 'ma_cross', 'rsi_above', 'rsi_below', 'custom'] as const,
  value: '',
  timeframes: ['M5', 'M15', 'H1', 'H4', 'D1'] as const,
};

export const exitRuleSchema = {
  type: ['tp', 'sl', 'trailing', 'time'] as const,
  value: 0,
  unit: ['pips', 'percent', 'atr'] as const,
};

export const riskRuleSchema = {
  type: ['fixed_lot', 'percent_balance', 'kelly', 'atr_based'] as const,
  value: 0,
  maxDrawdownPercent: 0,
};

export const strategySchema = {
  name: '',
  entryRules: [] as EntryRule[],
  exitRules: [] as ExitRule[],
  riskRules: [] as RiskRule[],
};