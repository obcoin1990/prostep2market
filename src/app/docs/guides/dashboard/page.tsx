'use client'

export default function DashboardGuide() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Dashboard Guide</h1>
      <p className="text-white/60 mb-8">
        Your dashboard is the command center of Prostep2Market. It gives you a real-time snapshot of your trading performance, risk metrics, and daily activity all in one place.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. Dashboard Sections Overview</h2>
      <p className="text-white/60 mb-4">
        The dashboard is divided into four main sections, each designed to surface specific insights at a glance.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. Edge Score Widget</h2>
      <p className="text-white/60 mb-4">
        Your Edge Score (0–100) is prominently displayed at the top of the dashboard. It aggregates your performance across five dimensions and updates after every trade. A higher score indicates healthier, more consistent trading. Tap the widget to dive into the detailed breakdown.
      </p>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 rounded mb-6">
        <p className="text-white/80 text-sm">
          <strong className="text-[#fcd535]">Tip:</strong> Check your Edge Score first thing each day. A declining trend is an early warning to slow down and review your recent trades.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Quick Stats</h2>
      <p className="text-white/60 mb-4">
        This row of cards shows your key performance indicators for the current period: win rate, total P&amp;L, average risk per trade, number of trades, and largest drawdown. Numbers in green reflect positive metrics; red signals caution.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Activity Feed</h2>
      <p className="text-white/60 mb-4">
        A chronological stream of your recent trades, journal entries, and system alerts. Each entry shows the instrument, action, outcome, and a timestamp. Use the feed to quickly recall what happened in your last session without opening detailed reports.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Quick Actions</h2>
      <p className="text-white/60 mb-4">
        The quick actions bar gives you one-click access to common tasks: log a new trade, open your journal, run a report, or start a strategy lab session. Customize these shortcuts from your settings.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">6. Tips for Daily Use</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Morning Routine</h3>
          <p className="text-white/60 text-sm">Review yesterday&apos;s Edge Score trend and activity feed before placing your first trade.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Evening Review</h3>
          <p className="text-white/60 text-sm">Use Quick Stats to compare today&apos;s numbers against your weekly targets.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Set Goals</h3>
          <p className="text-white/60 text-sm">Keep an eye on your win rate and average risk — these are the levers that move your Edge Score.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Stay Consistent</h3>
          <p className="text-white/60 text-sm">Visit the dashboard at the same times every day to build a consistent review habit.</p>
        </div>
      </div>
    </div>
  )
}
