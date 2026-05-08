/**
 * Edge Score System - Public API
 * Phase 6: Gamified performance scoring system
 * 
 * Provides score calculation, ranking, and tips generation
 */

// Types
export type { 
  EdgeScoreBreakdown, 
  ScoreHistory, 
  SparklineData, 
  TradeDataForScoring,
  Rank,
  RankConfig 
} from './types';

export { SCORE_WEIGHTS, RANK_CONFIG } from './types';

// Calculation functions
export { calculateDisciplineScore, getRuleAdherenceRatio } from './calculations/discipline';
export { calculateRiskScore, calculateLotSizeVariance } from './calculations/risk';
export { calculateEmotionalStabilityScore, calculateAvgRecoveryTime } from './calculations/emotional-stability';
export { calculateConsistencyScore, calculateWinningStreak, calculateReturnStdDev } from './calculations/consistency';
export { calculateStrategyAdherenceScore, getReviewCompletionRatio } from './calculations/strategy-adherence';
export { calculateCompositeScore, calculateAllScores } from './calculations/composite';

// Ranking functions
export { getRank, getRankConfig, pointsToNextRank, progressToNextRank } from './ranking';

// Tips generation
export { generateQuickTips, generateAllTips, getRankImprovementTip } from './tips';

/**
 * Main entry point: Calculate all scores from trade data
 */
export async function calculateEdgeScoresFromTrades(
  trades: {
    pnl?: number | null;
    exitTime?: string;
    entryTime?: string;
    lotSize?: number;
    preTradePlanAdherence?: number;
    notes?: string | null;
  }[],
  config: {
    accountSize: number;
    maxDrawdown: number;
    alertCount: number;
    calmTrades: number;
    tradesAfterAlerts: number;
    journalingDays: number;
  }
) {
  // Import helpers inline to avoid circular deps
  const { calculateReturnStdDev, calculateWinningStreak } = await import('./calculations/consistency');
  const { calculateAvgRecoveryTime } = await import('./calculations/emotional-stability');
  const { calculateDisciplineScore } = await import('./calculations/discipline');
  const { calculateRiskScore } = await import('./calculations/risk');
  const { calculateEmotionalStabilityScore } = await import('./calculations/emotional-stability');
  const { calculateConsistencyScore } = await import('./calculations/consistency');
  const { calculateStrategyAdherenceScore } = await import('./calculations/strategy-adherence');
  const { calculateAllScores } = await import('./calculations/composite');

  const totalTrades = trades.length;
  const totalDays = Math.max(1, Math.ceil(
    (new Date().getTime() - (trades[0]?.entryTime ? new Date(trades[0].entryTime).getTime() : Date.now())) / (1000 * 60 * 60 * 24)
  ));

  // Calculate lot size stats
  const lotSizes = trades.map(t => t.lotSize || 0).filter(l => l > 0);
  const avgLotSize = lotSizes.length > 0 ? lotSizes.reduce((a, b) => a + b, 0) / lotSizes.length : 0;
  const lotSizeStdDev = lotSizes.length > 1 
    ? Math.sqrt(lotSizes.map(l => Math.pow(l - avgLotSize, 2)).reduce((a, b) => a + b, 0) / lotSizes.length)
    : 0;

  // Calculate return standard deviation
  const dailyReturns = calculateReturnStdDev(trades.filter(t => t.pnl !== null).map(t => t.pnl as number));
  
  // Calculate winning streak
  const winningStreak = calculateWinningStreak(trades);
  
  // Calculate average recovery time
  const avgRecoveryMinutes = calculateAvgRecoveryTime(trades);

  // Calculate component scores
  const disciplineScore = calculateDisciplineScore({
    totalTrades,
    tradesWithPlanAdherence: trades.filter(t => (t.preTradePlanAdherence || 0) >= 4).length,
    journalingDays: config.journalingDays,
    totalDays,
    avgLotSize,
    lotSizeStdDev,
    maxDrawdown: config.maxDrawdown,
    accountSize: config.accountSize,
    calmTrades: config.calmTrades,
    tradesAfterAlerts: config.tradesAfterAlerts,
    avgRecoveryMinutes,
    alertCount: config.alertCount,
    winningStreak,
    returnStdDev: dailyReturns,
    sessionLengths: [],
    tradesWithReview: trades.filter(t => t.notes && t.notes.trim().length > 0).length,
    tradesFollowingRules: trades.filter(t => (t.preTradePlanAdherence || 0) >= 4).length,
  });

  const riskScore = calculateRiskScore({
    totalTrades,
    tradesWithPlanAdherence: 0,
    journalingDays: config.journalingDays,
    totalDays,
    avgLotSize,
    lotSizeStdDev,
    maxDrawdown: config.maxDrawdown,
    accountSize: config.accountSize,
    calmTrades: config.calmTrades,
    tradesAfterAlerts: config.tradesAfterAlerts,
    avgRecoveryMinutes,
    alertCount: config.alertCount,
    winningStreak,
    returnStdDev: dailyReturns,
    sessionLengths: [],
    tradesWithReview: 0,
    tradesFollowingRules: 0,
  });

  const emotionalStabilityScore = calculateEmotionalStabilityScore({
    totalTrades,
    tradesWithPlanAdherence: 0,
    journalingDays: config.journalingDays,
    totalDays,
    avgLotSize,
    lotSizeStdDev,
    maxDrawdown: config.maxDrawdown,
    accountSize: config.accountSize,
    calmTrades: config.calmTrades,
    tradesAfterAlerts: config.tradesAfterAlerts,
    avgRecoveryMinutes,
    alertCount: config.alertCount,
    winningStreak,
    returnStdDev: dailyReturns,
    sessionLengths: [],
    tradesWithReview: 0,
    tradesFollowingRules: 0,
  });

  const consistencyScore = calculateConsistencyScore({
    totalTrades,
    tradesWithPlanAdherence: 0,
    journalingDays: config.journalingDays,
    totalDays,
    avgLotSize,
    lotSizeStdDev,
    maxDrawdown: config.maxDrawdown,
    accountSize: config.accountSize,
    calmTrades: config.calmTrades,
    tradesAfterAlerts: config.tradesAfterAlerts,
    avgRecoveryMinutes,
    alertCount: config.alertCount,
    winningStreak,
    returnStdDev: dailyReturns,
    sessionLengths: [],
    tradesWithReview: 0,
    tradesFollowingRules: 0,
  });

  const strategyAdherenceScore = calculateStrategyAdherenceScore({
    totalTrades,
    tradesWithPlanAdherence: trades.filter(t => (t.preTradePlanAdherence || 0) >= 4).length,
    journalingDays: config.journalingDays,
    totalDays,
    avgLotSize,
    lotSizeStdDev,
    maxDrawdown: config.maxDrawdown,
    accountSize: config.accountSize,
    calmTrades: config.calmTrades,
    tradesAfterAlerts: config.tradesAfterAlerts,
    avgRecoveryMinutes,
    alertCount: config.alertCount,
    winningStreak,
    returnStdDev: dailyReturns,
    sessionLengths: [],
    tradesWithReview: trades.filter(t => t.notes && t.notes.trim().length > 0).length,
    tradesFollowingRules: trades.filter(t => (t.preTradePlanAdherence || 0) >= 4).length,
  });

  return calculateAllScores({
    disciplineScore,
    riskScore,
    emotionalStabilityScore,
    consistencyScore,
    strategyAdherenceScore,
  });
}