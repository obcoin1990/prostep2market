/**
 * Edge Score System Type Definitions
 * Phase 6: Gamified performance scoring system
 */

export type Rank = 'beginner' | 'developing' | 'consistent' | 'advanced' | 'elite';

export interface EdgeScoreBreakdown {
  disciplineScore: number;        // 0-100: rule adherence, journaling consistency
  riskScore: number;              // 0-100: position sizing, drawdown control
  emotionalStabilityScore: number; // 0-100: measured responses, recovery time
  consistencyScore: number;       // 0-100: streaks, return variance
  strategyAdherenceScore: number; // 0-100: following predefined rules
  compositeScore: number;         // 0-100: weighted average
}

export interface ScoreHistory {
  date: string;
  disciplineScore: number;
  riskScore: number;
  emotionalStabilityScore: number;
  consistencyScore: number;
  strategyAdherenceScore: number;
  compositeScore: number;
  rank: Rank;
}

export interface SparklineData {
  date: string;
  score: number;
}

export const SCORE_WEIGHTS = {
  discipline: 0.25,
  risk: 0.25,
  emotionalStability: 0.20,
  consistency: 0.15,
  strategyAdherence: 0.15,
} as const;

/**
 * Trade data required for score calculations
 */
export interface TradeDataForScoring {
  totalTrades: number;
  tradesWithPlanAdherence: number;
  journalingDays: number;
  totalDays: number;
  avgLotSize: number;
  lotSizeStdDev: number;
  maxDrawdown: number;
  accountSize: number;
  calmTrades: number;
  tradesAfterAlerts: number;
  avgRecoveryMinutes: number;
  alertCount: number;
  winningStreak: number;
  returnStdDev: number;
  sessionLengths: number[];
  tradesWithReview: number;
  tradesFollowingRules: number;
}

/**
 * Rank configuration with display properties
 */
export interface RankConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  minScore: number;
  maxScore: number;
}

export const RANK_CONFIG: Record<Rank, RankConfig> = {
  beginner: {
    label: 'Beginner',
    color: 'text-gray-700',
    bgColor: 'bg-gray-500',
    icon: 'sprout',
    minScore: 0,
    maxScore: 20,
  },
  developing: {
    label: 'Developing Trader',
    color: 'text-blue-700',
    bgColor: 'bg-blue-500',
    icon: 'trending-up',
    minScore: 21,
    maxScore: 40,
  },
  consistent: {
    label: 'Consistent Trader',
    color: 'text-green-700',
    bgColor: 'bg-green-500',
    icon: 'check-circle',
    minScore: 41,
    maxScore: 60,
  },
  advanced: {
    label: 'Advanced Trader',
    color: 'text-purple-700',
    bgColor: 'bg-purple-500',
    icon: 'award',
    minScore: 61,
    maxScore: 80,
  },
  elite: {
    label: 'Elite Trader',
    color: 'text-amber-700',
    bgColor: 'bg-gradient-to-r from-yellow-400 to-amber-500',
    icon: 'crown',
    minScore: 81,
    maxScore: 100,
  },
};