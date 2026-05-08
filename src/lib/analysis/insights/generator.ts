import type {
  AIInsight,
  Trade,
  BehavioralPatterns,
  RiskMetrics,
  DetectedPattern,
  TradeSummary,
} from '@/types/analysis';
import { createLLMClient } from '../llm/client';
import { buildInsightPrompt, ANALYSIS_SYSTEM_PROMPT } from '../llm/prompts';
import { scoreInsight, rankInsights } from './scorer';

const MIN_TRADES_FOR_LLM = 10;

/**
 * Generates AI insights combining rule-based and LLM approaches.
 * Uses rule-based insights as fallback if LLM is unavailable.
 */
export async function generateInsights(
  trades: Trade[],
  behavioralPatterns: BehavioralPatterns,
  metrics: RiskMetrics
): Promise<AIInsight[]> {
  // Generate rule-based insights first
  const ruleInsights = generateRuleBasedInsights(trades, behavioralPatterns, metrics);

  // Enhance with LLM if enough data and API key available
  if (trades.length >= MIN_TRADES_FOR_LLM) {
    try {
      const llmInsights = await generateLLMInsights(trades, behavioralPatterns, metrics);
      const combined = [...ruleInsights, ...llmInsights];
      return deduplicateInsights(combined);
    } catch (error) {
      console.error('LLM insight generation failed, using rule-based only:', error);
      return ruleInsights;
    }
  }

  return ruleInsights;
}

/**
 * Generates insights using LLM for context-aware analysis.
 */
async function generateLLMInsights(
  trades: Trade[],
  patterns: BehavioralPatterns,
  metrics: RiskMetrics
): Promise<AIInsight[]> {
  const llmClient = createLLMClient();

  const tradeSummaries: TradeSummary[] = trades.slice(-20).map((t) => ({
    symbol: t.symbol,
    result: t.result || 'loss',
    pnl: Number(t.pnl),
    rr: Number(t.pnl) / (Number(t.stopLoss || 1) * Number(t.lotSize || 1)) || 0,
  }));

  const detectedPatterns: DetectedPattern[] = Object.entries(patterns)
    .filter(([, value]) => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'object' && value !== null) {
        return 'detected' in value && value.detected;
      }
      return false;
    })
    .map(([type, value]) => ({
      type,
      severity: 'medium' as const,
      evidence: 'evidence' in (value as any) ? (value as any).evidence || [] : [],
      tradeIds: 'tradeIds' in (value as any) ? (value as any).tradeIds || [] : [],
    }));

  const prompt = buildInsightPrompt(tradeSummaries, detectedPatterns, metrics);

  try {
    const response = await llmClient.completeJSON<{ insights: AIInsight[] }>(
      prompt,
      ANALYSIS_SYSTEM_PROMPT
    );

    return (response.insights || []).map((insight) => ({
      ...insight,
      id: crypto.randomUUID(),
      relatedTrades: insight.relatedTrades || [],
    }));
  } catch (error) {
    console.error('LLM call failed:', error);
    throw error;
  }
}

/**
 * Generates rule-based insights from trade data and patterns.
 */
function generateRuleBasedInsights(
  trades: Trade[],
  patterns: BehavioralPatterns,
  metrics: RiskMetrics
): AIInsight[] {
  const insights: AIInsight[] = [];

  // Revenge trading insight
  if (patterns.revengeTrading.detected) {
    insights.push({
      id: crypto.randomUUID(),
      type: 'behavioral',
      title: 'Revenge Trading Detected',
      description:
        'Multiple trades executed shortly after losses with increased position size',
      confidence: 0.8,
      actionability: 'requires_attention',
      suggestedAction: 'Implement a 15-minute cooling-off rule after losses',
      relatedTrades: patterns.revengeTrading.tradeIds,
    });
  }

  // Impulsive trades insight
  if (patterns.impulsiveTrades.detected) {
    insights.push({
      id: crypto.randomUUID(),
      type: 'behavioral',
      title: 'Impulsive Trading Pattern',
      description: `Detected ${patterns.impulsiveTrades.count} impulsive trades with short hold times`,
      confidence: 0.7,
      actionability: 'quick_fix',
      suggestedAction: 'Wait for confirmation before entering trades',
      relatedTrades: [],
    });
  }

  // Overconfidence insight
  if (patterns.overconfidence.detected) {
    insights.push({
      id: crypto.randomUUID(),
      type: 'behavioral',
      title: 'Overconfidence After Win Streak',
      description: 'Increased position sizing after consecutive winning trades',
      confidence: 0.75,
      actionability: 'requires_attention',
      suggestedAction: 'Stick to your predefined position sizing rules',
      relatedTrades: patterns.overconfidence.evidence.length > 0 ? [] : [],
    });
  }

  // High drawdown insight
  if (metrics.drawdownBehavior.maxDrawdown > 20) {
    insights.push({
      id: crypto.randomUUID(),
      type: 'risk',
      title: 'High Drawdown Alert',
      description: `Maximum drawdown of ${metrics.drawdownBehavior.maxDrawdown.toFixed(1)}% exceeds recommended threshold`,
      confidence: 0.9,
      actionability: 'quick_fix',
      suggestedAction: 'Reduce position size by 25% for next trading session',
      relatedTrades: [],
    });
  }

  // Lot size variance insight
  if (metrics.lotSizeVariance > 30) {
    insights.push({
      id: crypto.randomUUID(),
      type: 'risk',
      title: 'High Position Sizing Variance',
      description: `Lot size variance of ${metrics.lotSizeVariance.toFixed(1)}% indicates inconsistent risk management`,
      confidence: 0.85,
      actionability: 'quick_fix',
      suggestedAction: 'Use fixed position sizing based on account percentage',
      relatedTrades: [],
    });
  }

  // Overtrading insight
  if (patterns.overtrading.detected) {
    insights.push({
      id: crypto.randomUUID(),
      type: 'behavioral',
      title: 'Overtrading Detected',
      description: `Excessive trading in ${patterns.overtrading.sessionCount} session(s)`,
      confidence: 0.8,
      actionability: 'requires_attention',
      suggestedAction: 'Set a daily trade limit of 5 trades',
      relatedTrades: [],
    });
  }

  // FOMO insight
  if (patterns.fomo.detected) {
    insights.push({
      id: crypto.randomUUID(),
      type: 'behavioral',
      title: 'FOMO Trading Pattern',
      description: 'Trades entered without proper plan due to fear of missing out',
      confidence: 0.7,
      actionability: 'strategic',
      suggestedAction: 'Create a pre-trade checklist and stick to it',
      relatedTrades: patterns.fomo.evidence.length > 0 ? [] : [],
    });
  }

  return insights;
}

/**
 * Removes near-duplicate insights based on title similarity.
 */
function deduplicateInsights(insights: AIInsight[]): AIInsight[] {
  const seen = new Set<string>();
  return insights.filter((insight) => {
    const key = insight.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
