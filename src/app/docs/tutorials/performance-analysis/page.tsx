'use client'

import { BarChart3 } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Win Rate Analysis',
    explanation:
      'Your win rate is the percentage of profitable trades out of total trades. While a high win rate is desirable, it should never be pursued at the expense of risk management. A trader with a 40% win rate can be highly profitable if their average winner is significantly larger than their average loser.',
    howTo:
      'Open the Analytics page and navigate to the Win Rate chart. Use the date range filter to analyze win rate by day, week, or month. Toggle the instrument filter to compare performance across different assets.',
    tip: 'Focus on win rate consistency rather than absolute value. A stable 55% is better than a volatile 70%.',
  },
  {
    title: 'Risk-Reward Analysis',
    explanation:
      'Risk-reward (R:R) measures the ratio of your average winning trade to your average losing trade. A ratio above 1.5:1 is considered healthy. This metric reveals whether your winners are large enough to offset your losses.',
    howTo:
      'Use the R:R Distribution chart in Analytics to see the spread of your risk-reward ratios. The scatter plot helps identify if you are cutting winners too early or letting losers run too long.',
    tip: 'Set a minimum R:R of 1.5:1 before entering any trade. Exit at your target — do not move the goalpost.',
  },
  {
    title: 'Drawdown Analysis',
    explanation:
      'Drawdown measures the decline from your peak account value. Maximum drawdown is the largest peak-to-trough drop recorded. Keeping drawdown below 15% protects your capital and your confidence.',
    howTo:
      'View the Equity Curve and Drawdown chart in Analytics. Look for patterns — do drawdowns happen after winning streaks? Are they concentrated in specific instruments or strategies?',
    tip: 'If your drawdown exceeds 10%, reduce position sizes by 50% until you recover. Protect your capital first.',
  },
  {
    title: 'Behavioral Patterns',
    explanation:
      'Your trading psychology leaves fingerprints on your data. Common patterns include revenge trading after a loss, over-trading after a win, and hesitating on high-probability setups. Identifying these patterns is the first step to fixing them.',
    howTo:
      'Use the Trader DNA module to review your emotional ratings and discipline scores alongside your trade data. Cross-reference your journal entries with performance dips to spot behavioral triggers.',
    tip: 'Tag journal entries with your emotional state. Review the correlation between emotions and P&L monthly.',
  },
  {
    title: 'Weekly Review Process',
    explanation:
      'A structured weekly review ensures you learn from every trade and stay aligned with your goals. Consistency in review is more important than the length of each session.',
    howTo:
      'Every Sunday, open the Analytics page and run a weekly report. Compare your actual performance against your weekly targets. Review your Edge Score trend and note any significant changes in behavior or strategy.',
    tip: 'Block 30 minutes every Sunday for your review. Use the same checklist each week to build a reliable habit.',
  },
]

export default function PerformanceAnalysis() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-2">
        <BarChart3 className="h-6 w-6 text-[#fcd535]" />
        <h1 className="text-3xl font-bold text-white">Performance Analysis Guide</h1>
      </div>
      <p className="text-white/60 mb-10 max-w-2xl">
        Learn how to analyse your trading performance using ProStep2Market&apos;s analytics tools.
        Each section explains a key metric and shows you how to use the platform to improve.
      </p>

      <div className="space-y-8">
        {SECTIONS.map((section, index) => (
          <div key={section.title}>
            <h2 className="text-xl font-semibold text-white mb-3">
              {index + 1}. {section.title}
            </h2>
            <p className="text-white/60 mb-3 leading-relaxed">{section.explanation}</p>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-3">
              <h3 className="text-sm font-semibold text-white mb-1">How to use the analytics tools</h3>
              <p className="text-sm text-white/60">{section.howTo}</p>
            </div>
            <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-3 rounded">
              <p className="text-sm text-white/80">
                <span className="font-semibold text-[#fcd535]">Tip for improving:</span> {section.tip}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
