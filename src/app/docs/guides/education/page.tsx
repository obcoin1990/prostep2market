'use client'

export default function EducationGuide() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Education Guide</h1>
      <p className="text-white/60 mb-8">
          The Education module provides structured learning paths designed to take you from foundational concepts to advanced trading strategies. Track your progress, earn certifications, and build knowledge at your own pace.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. Learning Paths Overview</h2>
      <p className="text-white/60 mb-4">
        Learning paths are curated sequences of lessons, videos, and quizzes organized by topic and skill level. Each path has a clear beginning and end, with milestones along the way. You can take multiple paths simultaneously, but we recommend focusing on one at a time for best retention.
      </p>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 rounded mb-6">
        <p className="text-white/80 text-sm">
          <strong className="text-[#fcd535]">Tip:</strong> New traders should start with the Beginner Foundation path before moving to specialized topics. It takes about two weeks to complete at one hour per day.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. Available Learning Paths</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Beginner Foundation</h3>
          <p className="text-white/60 text-sm">Covers market structure, order types, basic terminology, platform navigation, and trade mechanics. No prior experience needed.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Technical Analysis</h3>
          <p className="text-white/60 text-sm">Chart patterns, indicators (moving averages, RSI, MACD), support and resistance, trend analysis, and candlestick reading.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Trading Psychology</h3>
          <p className="text-white/60 text-sm">Emotional regulation, discipline, dealing with losses, building routines, and developing a trader mindset.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Advanced Strategies</h3>
          <p className="text-white/60 text-sm">Multi-timeframe analysis, options strategies, algorithmic trading concepts, and portfolio management techniques.</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Tracking Progress</h2>
      <p className="text-white/60 mb-4">
        Your learning dashboard shows completion percentage, time spent, quiz scores, and upcoming lessons for each active path. Progress syncs across all your devices. Each completed lesson contributes to your Edge Score&apos;s Strategy Adherence dimension, reinforcing the connection between knowledge and execution.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Certifications and Quizzes</h2>
      <p className="text-white/60 mb-4">
        At the end of each learning path, you take a final assessment. Passing grants you a certification badge displayed on your profile. Quizzes throughout each path help reinforce key concepts. Retake any quiz as many times as you like — only your highest score is recorded.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Recommended Learning Schedule</h2>
      <p className="text-white/60 mb-4">
        For best results, commit to at least 30 minutes of learning per trading day. A suggested weekly rhythm: two days of new lessons, one day of review and quizzes, one day of applying concepts in the Strategy Lab, and one day of reflection and journaling. Adjust based on your pace and availability.
      </p>
    </div>
  )
}
