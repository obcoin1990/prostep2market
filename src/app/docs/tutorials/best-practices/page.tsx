'use client'

import { Star } from 'lucide-react'

const PRACTICES = [
  {
    title: 'Consistent Journaling',
    description:
      'Log every trade immediately after closing. Include entry/exit rationale, emotions felt, and a grade for your execution. Consistent journaling transforms raw experience into actionable insight.',
    tip: 'Set a recurring reminder on your phone to journal within 5 minutes of closing a trade.',
  },
  {
    title: 'Risk Management',
    description:
      'Never risk more than 1–2% of your account on a single trade. Use stop-losses on every position and adjust position size based on volatility. Consistent risk management is the bedrock of longevity.',
    tip: 'Use the Risk Guardian tool to simulate your max drawdown before entering a trade.',
  },
  {
    title: 'Emotional Discipline',
    description:
      'Recognize emotional states — fear, greed, revenge — before they influence your decisions. Step away from the screen when you feel overwhelmed. A clear mind makes better trades.',
    tip: 'If you take three consecutive losses, stop trading for the day. Revisit your journal tomorrow.',
  },
  {
    title: 'Strategy Adherence',
    description:
      'Pick one or two strategies and master them. Avoid jumping between methods after a loss. Backtest your strategy and only take trades that meet your predefined criteria.',
    tip: 'Document your strategy rules in the Strategy Lab and score every trade against them.',
  },
  {
    title: 'Regular Reviews',
    description:
      'Schedule a weekly review every Sunday. Analyze your win rate, average R:R, largest drawdown, and Edge Score trend. Identify patterns in winning and losing weeks.',
    tip: 'Create a weekly review template with your top 3 metrics so you never skip the review.',
  },
  {
    title: 'Continuous Education',
    description:
      'Markets evolve — your knowledge should too. Dedicate time each week to read trade analysis, study new setups, and review your own historical trades for learning opportunities.',
    tip: 'Use the Education tab to track courses and articles you have completed this month.',
  },
  {
    title: 'Community Engagement',
    description:
      'Share trade reviews with fellow traders. Explaining your decisions to others exposes blind spots and reinforces good habits. A fresh pair of eyes catches what you miss.',
    tip: 'Join the weekly group analysis session in the Community section every Thursday.',
  },
  {
    title: 'Goal Setting',
    description:
      'Set specific, measurable process goals — not profit targets. Examples: journal 100% of trades, maintain a 60% win rate, or risk no more than 1.5% per trade for a month.',
    tip: 'Break your annual goals into monthly and weekly milestones. Track progress in your journal.',
  },
]

export default function BestPractices() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-2">
        <Star className="h-6 w-6 text-[#fcd535]" />
        <h1 className="text-3xl font-bold text-white">Trading Best Practices</h1>
      </div>
      <p className="text-white/60 mb-10 max-w-2xl">
        Proven habits and disciplines adopted by consistently profitable traders. Incorporate these
        practices into your daily routine to improve your Edge Score and long-term performance.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {PRACTICES.map((practice) => (
          <div
            key={practice.title}
            className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3 hover:border-white/20 transition-colors"
          >
            <h2 className="text-lg font-semibold text-white">{practice.title}</h2>
            <p className="text-sm text-white/60 leading-relaxed">{practice.description}</p>
            <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-3 rounded">
              <p className="text-sm text-white/80">
                <span className="font-semibold text-[#fcd535]">Tip:</span> {practice.tip}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
