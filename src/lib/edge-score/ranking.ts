/**
 * Ranking System for Edge Score
 * Maps composite scores to ranks (Beginner → Elite)
 * EDGE-08
 */

import type { Rank, RankConfig } from './types';
import { RANK_CONFIG } from './types';

/**
 * Maps a composite score (0-100) to a rank
 * 
 * Thresholds:
 * - 0-20: beginner
 * - 21-40: developing
 * - 41-60: consistent
 * - 61-80: advanced
 * - 81-100: elite
 */
export function getRank(compositeScore: number): Rank {
  if (compositeScore <= 20) return 'beginner';
  if (compositeScore <= 40) return 'developing';
  if (compositeScore <= 60) return 'consistent';
  if (compositeScore <= 80) return 'advanced';
  return 'elite';
}

/**
 * Get the rank configuration for display
 */
export function getRankConfig(rank: Rank): RankConfig {
  return RANK_CONFIG[rank];
}

/**
 * Get points needed to reach the next rank
 * Returns null if already at max rank
 */
export function pointsToNextRank(compositeScore: number): number | null {
  const rank = getRank(compositeScore);
  
  if (rank === 'elite') return null;
  
  const nextRankThresholds: Record<Rank, number> = {
    beginner: 21,
    developing: 41,
    consistent: 61,
    advanced: 81,
    elite: 101,
  };
  
  return nextRankThresholds[rank] - compositeScore;
}

/**
 * Get progress percentage to next rank (0-100)
 */
export function progressToNextRank(compositeScore: number): number {
  const rank = getRank(compositeScore);
  
  if (rank === 'elite') return 100;
  
  const currentThreshold = RANK_CONFIG[rank].minScore;
  const nextThreshold = RANK_CONFIG[rank].maxScore + 1;
  
  const progress = ((compositeScore - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
}