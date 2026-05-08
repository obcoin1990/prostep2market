/**
 * Discipline Score Calculation
 * Based on: rule adherence and journaling consistency
 * EDGE-01, JRNL-07
 */

import type { TradeDataForScoring } from '../types';

/**
 * Calculates discipline score (0-100)
 * Formula: (ruleAdherence * 0.6 + journalingConsistency * 0.4) * 100
 * 
 * ruleAdherence = trades with pre_trade_plan_adherence >= 4 / total trades
 * journalingConsistency = days with at least 1 trade logged / total days
 */
export function calculateDisciplineScore(data: TradeDataForScoring): number {
  const { totalTrades, tradesWithPlanAdherence, journalingDays, totalDays } = data;

  // Avoid division by zero
  if (totalTrades === 0 || totalDays === 0) {
    return 0;
  }

  // Calculate component ratios
  const ruleAdherence = tradesWithPlanAdherence / totalTrades;
  const journalingConsistency = journalingDays / totalDays;

  // Apply formula with weights
  const score = (ruleAdherence * 0.6 + journalingConsistency * 0.4) * 100;

  // Clamp to 0-100 range
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Calculate trades with plan adherence >= 4
 * Requires trade data with pre_trade_plan_adherence field
 */
export function getRuleAdherenceRatio(trades: { preTradePlanAdherence?: number }[]): number {
  if (trades.length === 0) return 0;
  const adherentTrades = trades.filter(t => (t.preTradePlanAdherence || 0) >= 4);
  return adherentTrades.length / trades.length;
}