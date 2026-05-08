/**
 * Risk Score Calculation
 * Based on: position sizing consistency and drawdown control
 * EDGE-02
 */

import type { TradeDataForScoring } from '../types';

/**
 * Calculates risk score (0-100)
 * Formula: baseScore - (lotSizeVariance * 10) - (drawdownRatio * 20)
 * 
 * lotSizeVariance = std dev of lot size / average lot size
 * drawdownRatio = maxDrawdown / accountSize
 */
export function calculateRiskScore(data: TradeDataForScoring): number {
  const { avgLotSize, lotSizeStdDev, maxDrawdown, accountSize } = data;

  const baseScore = 100;

  // Avoid division by zero
  if (avgLotSize === 0 || accountSize === 0) {
    return baseScore;
  }

  // Calculate lot size variance coefficient
  const lotSizeVariance = lotSizeStdDev / avgLotSize;

  // Calculate drawdown ratio
  const drawdownRatio = maxDrawdown / accountSize;

  // Apply formula with penalties
  const score = baseScore - (lotSizeVariance * 10) - (drawdownRatio * 20);

  // Clamp to 0-100 range
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Calculate lot size variance coefficient
 */
export function calculateLotSizeVariance(lotSizes: number[]): { avg: number; stdDev: number } {
  if (lotSizes.length === 0) return { avg: 0, stdDev: 0 };

  const sum = lotSizes.reduce((a, b) => a + b, 0);
  const avg = sum / lotSizes.length;

  if (lotSizes.length === 1) return { avg, stdDev: 0 };

  const squaredDiffs = lotSizes.map(l => Math.pow(l - avg, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / lotSizes.length;
  const stdDev = Math.sqrt(variance);

  return { avg, stdDev };
}