/**
 * Quick Tips Generation for Edge Score Improvement
 * Generates contextual tips based on score breakdown
 * EDGE-09
 */

import type { EdgeScoreBreakdown } from './types';
import { getRank } from './ranking';

/**
 * Tip types by score range
 */
type TipLevel = 'critical' | 'improvement' | 'good' | 'strong' | 'elite';

interface Tip {
  level: TipLevel;
  message: string;
  category: 'discipline' | 'risk' | 'emotionalStability' | 'consistency' | 'strategyAdherence';
}

interface TipCategory {
  icon: string;
  tips: Record<TipLevel, string>;
}

const TIPS_BY_CATEGORY: Record<keyof EdgeScoreBreakdown, TipCategory> = {
  disciplineScore: {
    icon: 'book-open',
    tips: {
      critical: "Complete your pre-trade plans before entering positions. Trades without plans have a 40% lower success rate.",
      improvement: "Try to log your trades within 24 hours to maintain journaling consistency and identify patterns.",
      good: "Your discipline is improving. Keep following your rules consistently.",
      strong: "Excellent discipline! You're well on your way to becoming a consistent trader.",
      elite: "Your discipline is exemplary. Consider mentoring others on trading consistency.",
    },
  },
  riskScore: {
    icon: 'shield-alert',
    tips: {
      critical: "Review your position sizing - your variance is above normal. Stick to your predetermined lot sizes.",
      improvement: "Your risk management could be tighter. Focus on consistent position sizing across all trades.",
      good: "Your risk management is solid. Continue monitoring your drawdown carefully.",
      strong: "Strong risk management! Your position sizing and drawdown control are excellent.",
      elite: "Your risk management is top-tier. Share your approach with the community.",
    },
  },
  emotionalStabilityScore: {
    icon: 'brain',
    tips: {
      critical: "Take more breaks between trades. Your alert frequency suggests emotional fatigue.",
      improvement: "Focus on recovering emotionally between trades. A few minutes of pause can significantly improve decisions.",
      good: "Your emotional control is improving. Continue practicing mindfulness during trading.",
      strong: "Strong emotional stability! You maintain composure even after losses.",
      elite: "Your emotional resilience is exceptional. Consider documenting your mental techniques.",
    },
  },
  consistencyScore: {
    icon: 'activity',
    tips: {
      critical: "Focus on maintaining consistent session lengths. Inconsistent trading often leads to poor decisions.",
      improvement: "Work on building winning streaks by keeping your session structure consistent.",
      good: "Your trading consistency is good. Focus on reducing return variance.",
      strong: "Excellent consistency! Your trading patterns are very stable.",
      elite: "Your consistency is elite-level. Help others by sharing your routine.",
    },
  },
  strategyAdherenceScore: {
    icon: 'target',
    tips: {
      critical: "Complete your pre-trade plan before entering trades. Plans improve execution quality by 35%.",
      improvement: "Write post-trade reviews to learn from each trade. Review completion correlates with improvement.",
      good: "Your strategy adherence is solid. Keep following your rules without exception.",
      strong: "Excellent strategy adherence! You consistently follow your trading plan.",
      elite: "Your strategy execution is elite. Consider backtesting your approach for others.",
    },
  },
  compositeScore: {
    icon: 'award',
    tips: {
      critical: "Focus on fundamentals: plan your trades, manage risk, and review your journal regularly.",
      improvement: "Build good habits one at a time. Start with pre-trade planning, then move to position sizing.",
      good: "You're building a solid foundation. Keep refining your approach.",
      strong: "Strong overall performance! You're close to advanced trader status.",
      elite: "Outstanding! You're among the elite traders. Continue optimizing your edge.",
    },
  },
};

/**
 * Get the tip level based on score
 */
function getTipLevel(score: number): TipLevel {
  if (score <= 20) return 'critical';
  if (score <= 40) return 'improvement';
  if (score <= 60) return 'good';
  if (score <= 80) return 'strong';
  return 'elite';
}

/**
 * Generate quick tips for the lowest 2 scoring components
 */
export function generateQuickTips(scores: EdgeScoreBreakdown): Tip[] {
  // Create array of component scores (excluding compositeScore)
  const componentScores: Array<{ key: keyof EdgeScoreBreakdown; score: number }> = [
    { key: 'disciplineScore', score: scores.disciplineScore },
    { key: 'riskScore', score: scores.riskScore },
    { key: 'emotionalStabilityScore', score: scores.emotionalStabilityScore },
    { key: 'consistencyScore', score: scores.consistencyScore },
    { key: 'strategyAdherenceScore', score: scores.strategyAdherenceScore },
  ];

  // Sort by score ascending (lowest first)
  componentScores.sort((a, b) => a.score - b.score);

  // Take the 2 lowest scoring components
  const lowestComponents = componentScores.slice(0, 2);

  // Generate tips for each
  return lowestComponents.map(({ key, score }) => {
    const level = getTipLevel(score);
    const categoryTips = TIPS_BY_CATEGORY[key];
    
    return {
      level,
      message: categoryTips.tips[level],
      category: key as Tip['category'],
    };
  });
}

/**
 * Generate all tips (for display or debugging)
 */
export function generateAllTips(scores: EdgeScoreBreakdown): Tip[] {
  const componentKeys: Array<keyof Omit<EdgeScoreBreakdown, 'compositeScore'>> = [
    'disciplineScore',
    'riskScore',
    'emotionalStabilityScore',
    'consistencyScore',
    'strategyAdherenceScore',
  ];

  return componentKeys.map(key => {
    const score = scores[key];
    const level = getTipLevel(score);
    const categoryTips = TIPS_BY_CATEGORY[key];

    return {
      level,
      message: categoryTips.tips[level],
      category: key as Tip['category'],
    };
  });
}

/**
 * Get a rank-based tip for overall improvement
 */
export function getRankImprovementTip(scores: EdgeScoreBreakdown): string {
  const rank = getRank(scores.compositeScore);
  const compositeTips = TIPS_BY_CATEGORY.compositeScore;

  const level = getTipLevel(scores.compositeScore);
  return compositeTips.tips[level];
}