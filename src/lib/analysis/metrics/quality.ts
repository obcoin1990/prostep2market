import type { TradeQualityAnalysis, Trade } from '@/types/analysis';

/**
 * Calculates entry timing score (0-100).
 * Based on: pre-trade plan adherence, confidence score, and session fit.
 */
export function calculateEntryTiming(trade: Trade): number {
  let score = 50; // Base score

  // Pre-trade plan adherence (0-5 scale -> 0-30 points)
  const adherenceScore = ((trade.preTradePlanAdherence || 3) / 5) * 30;
  score += adherenceScore;

  // Confidence score (1-5 scale -> 0-20 points)
  const confidenceScore = ((trade.confidenceScore || 3) / 5) * 20;
  score += confidenceScore;

  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Calculates exit quality score (0-100).
 * Based on: exit proximity to optimal zone, emotional state during exit.
 */
export function calculateExitQuality(trade: Trade): number {
  if (!trade.exitPrice || !trade.takeProfit || !trade.entryPrice) {
    // No exit data - return neutral
    return 50;
  }

  let score = 50; // Base score

  // Calculate how close to TP the exit was
  const tpDistance = Math.abs(trade.takeProfit - trade.entryPrice);
  const actualDistance = Math.abs(trade.exitPrice - trade.entryPrice);

  if (tpDistance > 0) {
    const tpProximity = actualDistance / tpDistance;

    // Full TP hit = 30 points, proportional otherwise
    if (tpProximity >= 0.95) {
      score += 30;
    } else if (tpProximity >= 0.8) {
      score += 20;
    } else if (tpProximity >= 0.5) {
      score += 10;
    }
  }

  // Emotional state penalty
  if (trade.emotionalState) {
    const isNegative =
      ['fear', 'panic', 'frustration'].includes(
        trade.emotionalState.toLowerCase()
      );
    if (isNegative) {
      score -= 10;
    }
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Calculates risk-reward efficiency (0-100%).
 * Realized RR / available RR * 100
 */
export function calculateRREfficiency(trade: Trade): number {
  if (!trade.exitPrice || !trade.stopLoss || !trade.entryPrice) {
    return 50; // Neutral if missing data
  }

  const stopDistance = Math.abs(trade.stopLoss - trade.entryPrice);
  if (stopDistance === 0) return 50;

  const actualDistance = Math.abs(trade.exitPrice - trade.entryPrice);
  const direction = trade.exitPrice > trade.entryPrice ? 1 : -1;
  const realizedPnL = trade.pnl * direction;
  const realizedRR = realizedPnL / (stopDistance * trade.lotSize);
  const availableRR = actualDistance / stopDistance;

  if (availableRR === 0) return 50;

  const efficiency = (Math.abs(realizedRR) / availableRR) * 100;
  return Math.min(100, Math.round(efficiency * 100) / 100);
}

/**
 * Calculates composite trade quality analysis.
 */
export function calculateTradeQuality(trade: Trade): TradeQualityAnalysis {
  const entryTimingScore = calculateEntryTiming(trade);
  const exitQualityScore = calculateExitQuality(trade);
  const rrEfficiency = calculateRREfficiency(trade);

  // Calculate composite grade
  const avgScore = (entryTimingScore + exitQualityScore + rrEfficiency) / 3;
  let qualityGrade: TradeQualityAnalysis['qualityGrade'];

  if (avgScore >= 80) qualityGrade = 'A';
  else if (avgScore >= 60) qualityGrade = 'B';
  else if (avgScore >= 40) qualityGrade = 'C';
  else qualityGrade = 'D';

  return {
    entryTimingScore,
    exitQualityScore,
    rrEfficiency,
    qualityGrade,
  };
}
