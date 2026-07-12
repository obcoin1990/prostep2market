'use client'

export default function EdgeScoreGuide() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Edge Score Guide</h1>
      <p className="text-white/60 mb-8">
        Edge Score is a proprietary metric that distills your trading health into a single number from 0 to 100. It is calculated from five behavioral dimensions and updated after every closed trade.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. What Is Edge Score?</h2>
      <p className="text-white/60 mb-4">
        Think of Edge Score as a fitness tracker for your trading. Instead of steps and heart rate, it measures how consistently you follow your plan, manage risk, and control emotions. A score above 70 indicates strong, disciplined trading. Below 40 signals that you may need to pause and re-evaluate.
      </p>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 rounded mb-6">
        <p className="text-white/80 text-sm">
          <strong className="text-[#fcd535]">Note:</strong> Edge Score is not a predictor of future profits. It is a diagnostic tool to help you identify strengths and weaknesses in your process.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. The Five Dimensions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Consistency</h3>
          <p className="text-white/60 text-sm">How evenly you trade day-to-day. Erratic bursts and long gaps lower this score.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Risk Management</h3>
          <p className="text-white/60 text-sm">Position sizing, stop-loss usage, and risk-to-reward ratios across all trades.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Emotional Control</h3>
          <p className="text-white/60 text-sm">Correlation between your tagged emotions and trade outcomes. Lower volatility in emotional states scores higher.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Strategy Adherence</h3>
          <p className="text-white/60 text-sm">How closely your trades match your logged strategies and predefined rules.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Adaptability</h3>
          <p className="text-white/60 text-sm">How well you adjust when market conditions change. Switching strategies without a plan lowers this score.</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. How to Improve Your Score</h2>
      <p className="text-white/60 mb-4">
        Improving your Edge Score is about small, consistent changes. Focus on one dimension at a time. For example, if Risk Management is low, commit to using a stop-loss on every trade for two weeks. As that dimension improves, move on to the next weakest area. The dashboard will show your progress over time.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Score History Tracking</h2>
      <p className="text-white/60 mb-4">
        Your Edge Score history is displayed as an interactive chart on the analytics page. You can view daily, weekly, or monthly roll-ups. Overlay your score against your P&amp;L curve to see how process improvements translate to performance. Use the date range picker to zoom into specific periods of interest.
      </p>
    </div>
  )
}
