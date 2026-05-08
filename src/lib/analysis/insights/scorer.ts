import type { AIInsight } from '@/types/analysis';

export interface ScoredInsight extends AIInsight {
  actionabilityScore: number;
  impactEstimate: number;
}

/**
 * Scores an insight based on confidence and actionability.
 */
export function scoreInsight(insight: AIInsight): ScoredInsight {
  // Confidence: based on evidence count and data quality
  const evidenceWeight = Math.min((insight.relatedTrades?.length || 0) / 5, 1);
  const confidenceBoost = insight.confidence * evidenceWeight;

  // Actionability scoring
  let actionabilityScore = 0;
  switch (insight.actionability) {
    case 'quick_fix':
      actionabilityScore = 100;
      break;
    case 'requires_attention':
      actionabilityScore = 60;
      break;
    case 'strategic':
      actionabilityScore = 30;
      break;
  }

  // Impact estimate (heuristic based on pattern type)
  const impactEstimate = calculateImpact(insight);

  return {
    ...insight,
    actionabilityScore,
    impactEstimate,
  };
}

function calculateImpact(insight: AIInsight): number {
  // Rough estimate of potential improvement
  if (insight.type === 'risk') return 70;
  if (insight.type === 'behavioral') return 60;
  if (insight.type === 'pattern') return 50;
  return 40;
}

/**
 * Ranks insights by actionability score and impact estimate.
 */
export function rankInsights(insights: ScoredInsight[]): ScoredInsight[] {
  return insights.sort((a, b) => {
    if (b.actionabilityScore !== a.actionabilityScore) {
      return b.actionabilityScore - a.actionabilityScore;
    }
    return b.impactEstimate - a.impactEstimate;
  });
}
