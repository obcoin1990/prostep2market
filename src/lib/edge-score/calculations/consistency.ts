/**
 * Consistency Score Calculation
 * Based on: win streaks, return variance, session consistency
 * EDGE-04
 */

import type { TradeDataForScoring } from '../types';

/**
 * Calculates consistency score (0-100)
 * Formula: (streakBonus * 40) + (lowVarianceBonus * 30) + (sessionConsistency * 30)
 * 
 * streakBonus: based on consecutive winning days
 * lowVarianceBonus: 30pts if return_std < 0.1
 * sessionConsistency: coefficient of variation for session lengths
 */
export function calculateConsistencyScore(data: TradeDataForScoring): number {
  const { winningStreak, returnStdDev, sessionLengths } = data;

  // Calculate streak bonus (0-100 scale, max at 10+ consecutive wins)
  let streakBonus = 0;
  if (winningStreak >= 10) {
    streakBonus = 100;
  } else if (winningStreak > 0) {
    streakBonus = (winningStreak / 10) * 100;
  }

  // Calculate low variance bonus (30pts max if stdDev < 0.1)
  let lowVarianceBonus = 0;
  if (returnStdDev < 0.1) {
    lowVarianceBonus = 30;
  } else if (returnStdDev < 0.2) {
    lowVarianceBonus = 20;
  } else if (returnStdDev < 0.3) {
    lowVarianceBonus = 10;
  }

  // Calculate session consistency (0-100 based on coefficient of variation)
  let sessionConsistency = 0;
  if (sessionLengths.length > 1) {
    const mean = sessionLengths.reduce((a, b) => a + b, 0) / sessionLengths.length;
    if (mean > 0) {
      const squaredDiffs = sessionLengths.map(l => Math.pow(l - mean, 2));
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / sessionLengths.length;
      const stdDev = Math.sqrt(variance);
      const cv = stdDev / mean; // Coefficient of variation
      
      // Lower CV = more consistent. 0 CV = perfect consistency = 100 score
      sessionConsistency = Math.max(0, 100 - (cv * 100));
    } else {
      sessionConsistency = 100; // All sessions same length
    }
  } else if (sessionLengths.length === 1) {
    sessionConsistency = 100; // Single session is "consistent"
  }

  // Apply formula with weights
  const score = (streakBonus * 0.4) + lowVarianceBonus + (sessionConsistency * 0.3);

  // Clamp to 0-100 range
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Calculate winning streak from trade results
 */
export function calculateWinningStreak(
  trades: { pnl?: number | null; exitTime?: string }[]
): number {
  if (trades.length === 0) return 0;

  // Sort by exit time
  const sortedTrades = [...trades].sort((a, b) => {
    const timeA = new Date(a.exitTime || 0).getTime();
    const timeB = new Date(b.exitTime || 0).getTime();
    return timeA - timeB;
  });

  let maxStreak = 0;
  let currentStreak = 0;

  for (const trade of sortedTrades) {
    if (trade.pnl !== null && (trade.pnl as number) > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
}

/**
 * Calculate return standard deviation from daily returns
 */
export function calculateReturnStdDev(dailyReturns: number[]): number {
  if (dailyReturns.length < 2) return 0;

  const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const squaredDiffs = dailyReturns.map(r => Math.pow(r - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / dailyReturns.length;
  
  return Math.sqrt(variance);
}