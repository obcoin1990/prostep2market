'use client'

export default function RiskGuardianGuide() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Risk Guardian Guide</h1>
      <p className="text-white/60 mb-8">
        Risk Guardian is your automated risk management assistant. It monitors your trading behavior in real time and alerts you when patterns of overtrading, revenge trading, or fatigue are detected.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. What Is Risk Guardian?</h2>
      <p className="text-white/60 mb-4">
        Risk Guardian runs in the background while you trade, analyzing every entry, exit, and modification against your historical patterns and predefined thresholds. It uses behavioral algorithms to detect when you deviate from your normal trading profile and sends proactive alerts before small mistakes turn into big losses.
      </p>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 rounded mb-6">
        <p className="text-white/80 text-sm">
          <strong className="text-[#fcd535]">Tip:</strong> Treat Risk Guardian alerts like a co-pilot tapping you on the shoulder. Even if you disagree, pause for 60 seconds to re-evaluate before taking the next trade.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. Real-Time Alerts</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Overtrading Alert</h3>
          <p className="text-white/60 text-sm">Triggers when your trade count exceeds your daily average by a factor you set. Helps prevent volume-based burnout.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Revenge Trading Alert</h3>
          <p className="text-white/60 text-sm">Detected when you open a trade immediately after a loss, especially if the position size is larger than your typical risk unit.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Fatigue Alert</h3>
          <p className="text-white/60 text-sm">Fires after a long trading session or when your accuracy drops significantly over the last several trades.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Deviation Alert</h3>
          <p className="text-white/60 text-sm">Warns you when a trade doesn&apos;t match any of your defined strategies, flagging impulsive entries.</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Setting Thresholds</h2>
      <p className="text-white/60 mb-4">
        Navigate to Settings &gt; Risk Guardian to customize every alert threshold. You can set maximum daily trades, maximum consecutive losses, minimum time between trades, and position size limits relative to your account. Thresholds can be adjusted per asset class or kept as global defaults.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Auto-Pause Feature</h2>
      <p className="text-white/60 mb-4">
        For traders who want stronger enforcement, enable Auto-Pause. When a critical threshold is breached, Risk Guardian can temporarily disable your ability to open new trades in connected platforms. The pause duration is configurable from 15 minutes to 24 hours. You can manually override a pause, but the override is logged for your review.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Reviewing Alert History</h2>
      <p className="text-white/60 mb-4">
        All alerts are recorded in the Risk Guardian log. Review this history in your weekly debrief to identify recurring patterns — do you always get fatigue alerts on Thursday afternoons? Use the data to adjust your trading schedule and threshold settings proactively.
      </p>
    </div>
  )
}
