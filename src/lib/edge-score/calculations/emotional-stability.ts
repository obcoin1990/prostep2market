/**
 * Emotional Stability Score Calculation
 * Based on: calm trade ratio, recovery time, alert frequency
 * EDGE-03
 */

import type { TradeDataForScoring } from '../types';

/**
 * Calculates emotional stability score (0-100)
 * Formula: (calmTradeRatio * 50) + (recoveryBonus * 30) + (alertPenalty * 20)
 * 
 * calmTradeRatio = trades after alerts that followed guidelines / total trades after alerts
 * recoveryBonus: 10pts per 5min under 30min avg recovery
 * alertPenalty: penalize when > 3 alerts in session
 */
export function calculateEmotionalStabilityScore(data: TradeDataForScoring): number {
  const { calmTrades, tradesAfterAlerts, avgRecoveryMinutes, alertCount, totalTrades } = data;

  // Calculate calm trade ratio
  let calmTradeRatio = 0;
  if (tradesAfterAlerts > 0) {
    calmTradeRatio = calmTrades / tradesAfterAlerts;
  } else if (totalTrades > 0) {
    // If no trades after alerts, assume good behavior based on total trades
    calmTradeRatio = 1;
  }

  // Calculate recovery bonus (10pts per 5min under 30min, max 30pts)
  let recoveryBonus = 0;
  if (avgRecoveryMinutes > 0 && avgRecoveryMinutes < 30) {
    const minutesUnder = 30 - avgRecoveryMinutes;
    recoveryBonus = Math.min(30, Math.floor(minutesUnder / 5) * 10);
  } else if (avgRecoveryMinutes === 0) {
    // No recovery time data - assume optimal
    recoveryBonus = 30;
  }

  // Calculate alert penalty (lose points when > 3 alerts in session)
  let alertPenalty = 0;
  if (alertCount > 3) {
    // Lose 20 points when > 3 alerts, scale down if 1-3
    alertPenalty = Math.min(20, alertCount * 5);
  }

  // Apply formula
  const score = (calmTradeRatio * 50) + recoveryBonus + (20 - alertPenalty);

  // Clamp to 0-100 range
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Calculate recovery time from trade timestamps
 * Returns average recovery minutes between consecutive losing trades
 */
export function calculateAvgRecoveryTime(
  trades: { exitTime?: string; pnl?: number | null; entryTime?: string }[]
): number {
  const losingTrades = trades
    .filter(t => t.pnl !== null && (t.pnl as number) < 0)
    .sort((a, b) => {
      const timeA = new Date(a.exitTime || a.entryTime || 0).getTime();
      const timeB = new Date(b.exitTime || b.entryTime || 0).getTime();
      return timeA - timeB;
    });

  if (losingTrades.length < 2) {
    return 0; // No recovery time needed if < 2 losing trades
  }

  let totalRecoveryTime = 0;
  let recoveryCount = 0;

  for (let i = 1; i < losingTrades.length; i++) {
    const prevExit = new Date(losingTrades[i - 1].exitTime || losingTrades[i - 1].entryTime || 0).getTime();
    const currEntry = new Date(losingTrades[i].entryTime || 0).getTime();
    
    if (prevExit > 0 && currEntry > 0) {
      const recoveryMs = currEntry - prevExit;
      const recoveryMinutes = recoveryMs / (1000 * 60);
      totalRecoveryTime += recoveryMinutes;
      recoveryCount++;
    }
  }

  return recoveryCount > 0 ? totalRecoveryTime / recoveryCount : 0;
}