// Trade Quality Analysis (INTL-04)
export interface TradeQualityAnalysis {
  entryTimingScore: number;     // 0-100
  exitQualityScore: number;     // 0-100
  rrEfficiency: number;         // Actual RR vs available RR (0-100%)
  qualityGrade: 'A' | 'B' | 'C' | 'D';
}

// Behavioral Patterns (INTL-05)
export interface BehavioralPatterns {
  revengeTrading: {
    detected: boolean;
    severity: 'low' | 'medium' | 'high';
    evidence: string[];
    tradeIds: string[];
  };
  impulsiveTrades: {
    detected: boolean;
    count: number;
    triggers: string[];
  };
  overconfidence: {
    detected: boolean;
    evidence: string[];
  };
  fearExits: {
    detected: boolean;
    instances: string[];
  };
  overtrading: {
    detected: boolean;
    sessionCount: number;
  };
  fomo: {
    detected: boolean;
    evidence: string[];
  };
}

// Risk Metrics (INTL-06)
export interface RiskMetrics {
  lotSizeVariance: number;
  drawdownBehavior: DrawdownProfile;
  exposureProfile: ExposureSnapshot;
  marginPressureEvents: number;
}

export interface DrawdownProfile {
  maxDrawdown: number;
  maxDrawdownDuration: number;
  avgRecoveryDays: number;
  recoveryPattern: 'slow' | 'normal' | 'fast';
}

export interface ExposureSnapshot {
  maxConcurrentPositions: number;
  avgHoldingPeriod: number;
  sessionExposure: Record<string, number>;
}

// Performance Analytics (INTL-07)
export interface PerformanceAnalytics {
  bestSessions: SessionSummary[];
  worstConditions: ConditionSummary[];
  pairPerformance: Record<string, PairStats>;
  timeAnalysis: TimeHeatmap;
}

export interface SessionSummary {
  session: 'asian' | 'london' | 'newyork' | 'sydney';
  winRate: number;
  avgRR: number;
  totalTrades: number;
  totalPnl: number;
  rank: number;
}

export interface ConditionSummary {
  condition: string;
  winRate: number;
  avgRR: number;
  totalTrades: number;
  totalPnl: number;
}

export interface PairStats {
  symbol: string;
  winRate: number;
  avgRR: number;
  totalTrades: number;
  totalPnl: number;
  bestSession: string;
}

export interface HeatmapCell {
  dayOfWeek: number; // 0 = Sunday
  session: 'asian' | 'london' | 'newyork' | 'sydney';
  totalTrades: number;
  totalPnl: number;
  winRate: number;
  avgRR: number;
}

export type TimeHeatmap = HeatmapCell[];

// AI Insights (INTL-08)
export interface AIInsight {
  id: string;
  type: 'behavioral' | 'risk' | 'pattern' | 'action';
  title: string;
  description: string;
  confidence: number;
  actionability: 'quick_fix' | 'requires_attention' | 'strategic';
  suggestedAction: string;
  relatedTrades: string[];
}

// Analysis Orchestrator Types
export interface AnalysisRequest {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  tradeIds?: string[];
}

export interface AnalysisResult {
  tradeId: string;
  quality: TradeQualityAnalysis;
  patterns: BehavioralPatterns;
}

export interface FullAnalysisResult {
  tradeAnalyses: AnalysisResult[];
  aggregatedRisk: RiskMetrics;
  performance: PerformanceAnalytics;
  behavioralPatterns: BehavioralPatterns;
  insights: AIInsight[];
}

// Detected Pattern (internal use)
export interface DetectedPattern {
  type: string;
  severity: 'low' | 'medium' | 'high';
  evidence: string[];
  tradeIds: string[];
}

// Trade Summary (for LLM prompts)
export interface TradeSummary {
  symbol: string;
  result: 'win' | 'loss' | 'breakeven';
  pnl: number;
  rr: number;
}

// Trade type (matches Phase 3 schema)
export interface Trade {
  id: string;
  userId?: string;
  symbol: string;
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  lotSize: number;
  entryTime: string | Date;
  exitTime?: string | Date;
  session: 'asian' | 'london' | 'newyork' | 'sydney';
  result?: 'win' | 'loss' | 'breakeven';
  pnl: number;
  confidenceScore?: number;
  stressScore?: number;
  emotionalState?: string;
  triggers?: string[];
  preTradePlanAdherence?: number;
  notes?: string;
}
