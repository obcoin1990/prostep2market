/**
 * Strategy Adherence Score Calculation
 * Based on: pre-trade plan adherence, post-trade review completion, strategy rules
 * EDGE-05
 */

import type { TradeDataForScoring } from '../types';

/**
 * Calculates strategy adherence score (0-100)
 * Formula: (planAdherence * 0.5 + reviewCompletion * 0.3 + strategyRules * 0.2) * 100
 * 
 * planAdherence = trades with pre-trade plan >= 4
 * reviewCompletion = trades with post-trade review / total trades
 * strategyRules = trades following all rules / total trades
 */
export function calculateStrategyAdherenceScore(data: TradeDataForScoring): number {
  const { totalTrades, tradesWithPlanAdherence, tradesWithReview, tradesFollowingRules } = data;

  // Avoid division by zero
  if (totalTrades === 0) {
    return 0;
  }

  // Calculate component ratios
  const planAdherence = tradesWithPlanAdherence / totalTrades;
  const reviewCompletion = tradesWithReview / totalTrades;
  const strategyRules = tradesFollowingRules / totalTrades;

  // Apply formula with weights
  const score = (planAdherence * 0.5 + reviewCompletion * 0.3 + strategyRules * 0.2) * 100;

  // Clamp to 0-100 range
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Calculate trades with post-trade review (notes field is not empty)
 */
export function getReviewCompletionRatio(
  trades: { notes?: string | null }[]
): number {
  if (trades.length === 0) return 0;
  const reviewedTrades = trades.filter(t => t.notes && t.notes.trim().length > 0);
  return reviewedTrades.length / trades.length;
}