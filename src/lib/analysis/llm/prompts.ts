import type { TradeSummary, DetectedPattern, RiskMetrics } from '@/types/analysis';

export const ANALYSIS_SYSTEM_PROMPT = `You are an expert trading coach analyzing trade data.
Analyze the provided trade history and behavioral patterns to generate actionable insights.
Focus on specific, measurable patterns that the trader can address.
Output valid JSON only with an "insights" array.`;

export function buildInsightPrompt(
  trades: TradeSummary[],
  patterns: DetectedPattern[],
  metrics: RiskMetrics
): string {
  const tradesText = trades
    .map(
      (t) =>
        `- ${t.symbol} ${t.result} $${t.pnl.toFixed(2)} RR${t.rr.toFixed(2)}`
    )
    .join('\n');

  const patternsText = patterns
    .map((p) => `- ${p.type}: ${p.evidence.join(', ')}`)
    .join('\n') || 'None detected';

  const overallWinRate =
    trades.length > 0
      ? (trades.filter((t) => t.result === 'win').length / trades.length) * 100
      : 0;

  return `
Analyze the following trading data and generate 3-5 actionable insights.

Recent Trades (last 20):
${tradesText}

Detected Patterns:
${patternsText}

Risk Metrics:
- Max Drawdown: ${metrics.drawdownBehavior.maxDrawdown.toFixed(1)}%
- Lot Size Variance: ${metrics.lotSizeVariance.toFixed(1)}%
- Win Rate: ${overallWinRate.toFixed(1)}%

Generate insights in JSON format:
{
  "insights": [
    {
      "type": "behavioral|risk|pattern|action",
      "title": "Brief insight title",
      "description": "Detailed explanation with specific evidence",
      "confidence": 0.0-1.0,
      "actionability": "quick_fix|requires_attention|strategic",
      "suggestedAction": "Specific action to take"
    }
  ]
}
`;
}

export function buildExecutiveSummaryPrompt(
  trades: TradeSummary[],
  metrics: RiskMetrics,
  patterns: BehavioralPatternSummary[]
): string {
  const winRate =
    trades.length > 0
      ? (trades.filter((t) => t.result === 'win').length / trades.length) * 100
      : 0;
  const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);

  return `
Generate an executive summary for a trading performance report.

Key Metrics:
- Total Trades: ${trades.length}
- Win Rate: ${winRate.toFixed(1)}%
- Total P&L: $${totalPnL.toFixed(2)}
- Max Drawdown: ${metrics.drawdownBehavior.maxDrawdown.toFixed(1)}%

Behavioral Patterns Detected:
${patterns.map((p) => `- ${p.name}: ${p.severity}`).join('\n')}

Provide a brief executive summary (3-4 sentences) highlighting key strengths and areas for improvement.
`;
}

interface BehavioralPatternSummary {
  name: string;
  severity: string;
}
