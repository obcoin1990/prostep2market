'use client'

const ENDPOINTS = [
  {
    path: '/analytics/summary',
    method: 'GET',
    desc: 'Aggregated performance summary for a given date range.',
    response: 'Returns total trades, win rate, net P&L, average risk, largest drawdown, and Sharpe ratio.',
  },
  {
    path: '/analytics/performance',
    method: 'GET',
    desc: 'Time-series performance data broken down by day, week, or month.',
    response: 'Returns an array of data points with date, P&L, cumulative P&L, trade count, and win rate.',
  },
  {
    path: '/analytics/behavioral',
    method: 'GET',
    desc: 'Behavioral metrics based on journal entries and trade patterns.',
    response: 'Returns discipline score, emotional state breakdown, and deviation from plan metrics.',
  },
  {
    path: '/analytics/risk',
    method: 'GET',
    desc: 'Risk assessment metrics for the selected period.',
    response: 'Returns risk score, VaR, largest losing streak, concentration risk, and position sizing analysis.',
  },
]

export default function AnalyticsApi() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Analytics API</h1>
      <p className="text-white/60 mb-8">
        The Analytics API provides programmatic access to your trading performance, behavioral insights, and risk metrics. All endpoints require authentication.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Endpoints</h2>
      <div className="space-y-4 mb-8">
        {ENDPOINTS.map((ep) => (
          <div key={ep.path} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-400">{ep.method}</span>
              <span className="text-white font-mono text-sm">{ep.path}</span>
            </div>
            <p className="text-white/60 text-sm mb-2">{ep.desc}</p>
            <p className="text-white/60 text-xs"><strong className="text-white/60">Response:</strong> {ep.response}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">GET /analytics/summary</h2>
      <p className="text-white/60 mb-4">Returns key performance indicators for the authenticated user within the specified date range.</p>

      <p className="text-white font-medium mb-2">Request</p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-4">
        <p className="text-white/80">curl -H &quot;Authorization: Bearer YOUR_TOKEN&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;https://api.prostep2market.com/v1/analytics/summary?start=2026-01-01&amp;end=2026-06-30</p>
      </div>

      <p className="text-white font-medium mb-2">Response</p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8">
        <p className="text-white/80">{'{'}</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;total_trades&quot;: 342,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;win_rate&quot;: 0.64,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;net_pnl&quot;: 12850.00,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;avg_risk&quot;: 185.00,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;max_drawdown&quot;: 1240.00,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;sharpe_ratio&quot;: 1.82</p>
        <p className="text-white/80">{'}'}</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">GET /analytics/performance</h2>
      <p className="text-white/60 mb-4">Returns time-series performance data grouped by day, week, or month. Use the <code className="text-[#fcd535] bg-white/5 px-1.5 py-0.5 rounded text-sm">granularity</code> query parameter.</p>

      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8">
        <p className="text-white/80">curl -H &quot;Authorization: Bearer YOUR_TOKEN&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;"https://api.prostep2market.com/v1/analytics/performance?granularity=week"</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">GET /analytics/behavioral</h2>
      <p className="text-white/60 mb-4">Behavioral analytics are derived from your journal entries and trade journaling patterns. This endpoint requires journal entries to exist for the selected period.</p>

      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8">
        <p className="text-white/80">curl -H &quot;Authorization: Bearer YOUR_TOKEN&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;https://api.prostep2market.com/v1/analytics/behavioral</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">GET /analytics/risk</h2>
      <p className="text-white/60 mb-4">Risk analytics evaluate your exposure, position sizing, and portfolio concentration. Use this data to adjust your risk management strategy.</p>

      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-4">
        <p className="text-white/80">curl -H &quot;Authorization: Bearer YOUR_TOKEN&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;https://api.prostep2market.com/v1/analytics/risk</p>
      </div>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 rounded">
        <p className="text-white/80 text-sm">
          <strong className="text-[#fcd535]">Note:</strong> Analytics endpoints require a minimum of 10 trades in the selected date range to produce meaningful results.
        </p>
      </div>
    </div>
  )
}
