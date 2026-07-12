'use client'

export default function TraderDnaGuide() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Trader DNA Guide</h1>
      <p className="text-white/60 mb-8">
        Trader DNA is a personality profiling system built specifically for traders. It identifies your natural trading tendencies and helps you leverage your strengths while managing your blind spots.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. What Is Trader DNA?</h2>
      <p className="text-white/60 mb-4">
        Based on decades of trading psychology research, Trader DNA classifies traders into five profile types. No profile is better than another — each has unique advantages and pitfalls. The goal is to understand your default mode so you can build systems that work with your nature, not against it.
      </p>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 rounded mb-6">
        <p className="text-white/80 text-sm">
          <strong className="text-[#fcd535]">Note:</strong> Your Trader DNA profile can shift over time as you gain experience and develop new habits. Retake the assessment quarterly to track your evolution.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. The Five Profile Types</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Sniper</h3>
          <p className="text-white/60 text-sm">Patient, precise, waits for high-conviction setups. Takes few trades but with high accuracy. Risk: missing moves while waiting for perfection.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Analyst</h3>
          <p className="text-white/60 text-sm">Data-driven, loves charts and indicators. Excels at planning but may suffer from analysis paralysis.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Warrior</h3>
          <p className="text-white/60 text-sm">Decisive, confident, thrives in fast markets. Takes calculated risks. Risk: stubbornness and difficulty cutting losses.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Disciplinarian</h3>
          <p className="text-white/60 text-sm">Rule-bound, consistent, follows systems rigidly. Excellent risk manager. Risk: struggling to adapt when markets change.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Opportunist</h3>
          <p className="text-white/60 text-sm">Flexible, creative, spots niche setups others miss. Thrives in ranging markets. Risk: lack of consistency and over-trading.</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Taking the Assessment</h2>
      <p className="text-white/60 mb-4">
        The assessment takes about 10 minutes and consists of 30 scenario-based questions. There are no right or wrong answers — choose the response that feels most natural to you. Your results are immediate and include a detailed breakdown of your primary and secondary profile types.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Understanding Your Profile</h2>
      <p className="text-white/60 mb-4">
        Your profile report includes: your primary type, secondary type, key strengths, common pitfalls, recommended journaling focus areas, and suggested strategies that historically work well for your profile. Use this as a starting point for self-improvement, not a fixed label.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Applying Insights to Trading</h2>
      <p className="text-white/60 mb-4">
        Integrate your Trader DNA insights with the rest of the platform. For example, if you are a Sniper, set your Risk Guardian thresholds to alert you when your trade count exceeds two per day. If you are an Analyst, use the Strategy Lab to validate your ideas before taking them live. The system will surface personalized suggestions based on your profile.
      </p>
    </div>
  )
}
