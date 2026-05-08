/**
 * Composite Score Calculation
 * Weighted average of all component scores
 * EDGE-06
 */

import type { EdgeScoreBreakdown } from '../types';
import { SCORE_WEIGHTS } from '../types';

/**
 * Calculates composite Edge Score from component scores
 * Uses weighted average based on SCORE_WEIGHTS
 * 
 * Weights: discipline 0.25, risk 0.25, emotionalStability 0.20, consistency 0.15, strategyAdherence 0.15
 */
export function calculateCompositeScore(scores: Omit<EdgeScoreBreakdown, 'compositeScore'>): number {
  const compositeScore = 
    scores.disciplineScore * SCORE_WEIGHTS.discipline +
    scores.riskScore * SCORE_WEIGHTS.risk +
    scores.emotionalStabilityScore * SCORE_WEIGHTS.emotionalStability +
    scores.consistencyScore * SCORE_WEIGHTS.consistency +
    scores.strategyAdherenceScore * SCORE_WEIGHTS.strategyAdherence;

  // Round to nearest integer
  return Math.round(compositeScore);
}

/**
 * Calculate all component scores and composite score from trade data
 */
export function calculateAllScores(data: {
  disciplineScore: number;
  riskScore: number;
  emotionalStabilityScore: number;
  consistencyScore: number;
  strategyAdherenceScore: number;
}): EdgeScoreBreakdown {
  const compositeScore = calculateCompositeScore(data);
  
  return {
    ...data,
    compositeScore,
  };
}