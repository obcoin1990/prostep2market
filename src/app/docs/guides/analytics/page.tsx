'use client'

export default function AnalyticsGuide() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Analytics Guide</h1>
      <p className="text-white/60 mb-8">
        The analytics module transforms your raw trade data into actionable insights. Use it to measure performance, understand your behavior, manage risk, and generate detailed reports.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. Overview of Analytics Available</h2>
      <p className="text-white/60 mb-4">
        Analytics are organized into four categories: trade performance, behavioral analytics, risk analytics, and reports. Each category contains multiple visualizations and data tables that you can filter, export, and save as custom views.
      </p>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 rounded mb-6">
        <p className="text-white/80 text-sm">
          <strong className="text-[#fcd535]">Tip:</strong> Start with the predefined dashboards before building custom views. Each dashboard answers a specific question about your trading.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. Trade Performance Metrics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">P&amp;L Analysis</h3>
          <p className="text-white/60 text-sm">Cumulative and per-trade profit/loss with breakdowns by instrument, strategy, and time period.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Win Rate &amp; Ratios</h3>
          <p className="text-white/60 text-sm">Overall win rate, average win vs average loss, profit factor, and expectancy calculations.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Equity Curve</h3>
          <p className="text-white/60 text-sm">Visualize your account growth over time with drawdown markers and rolling performance bands.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Concentration</h3>
          <p className="text-white/60 text-sm">See how your trading is distributed across instruments, strategies, and session times.</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Behavioral Analytics</h2>
      <p className="text-white/60 mb-4">
        Behavioral analytics correlate your emotional tags, trade timing, and decision patterns with outcomes. Discover whether you trade better in the morning or afternoon, which emotions precede your best trades, and how your performance changes after consecutive wins or losses.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Risk Analytics</h2>
      <p className="text-white/60 mb-4">
        Risk analytics focus on drawdown analysis, value at risk (VaR), position sizing consistency, and risk-to-reward distribution. Use these views to ensure your risk parameters stay within your predefined limits and to identify when risk-taking is drifting outside your plan.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Generating Reports</h2>
      <p className="text-white/60 mb-4">
        Create customizable reports that combine data from all analytics categories. Choose from weekly, monthly, or custom date ranges. Reports can be exported as PDF or CSV and include your Edge Score trend, trade log summaries, behavioral insights, and risk metrics. Schedule automatic report generation and delivery to your email.
      </p>
    </div>
  )
}
