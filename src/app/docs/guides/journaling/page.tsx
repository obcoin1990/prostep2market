'use client'

export default function JournalingGuide() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Journaling Guide</h1>
      <p className="text-white/60 mb-8">
        Consistent journaling is the cornerstone of trading improvement. The journal helps you capture every trade, emotion, and lesson so you can review and refine your approach over time.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. Creating a Trade Entry</h2>
      <p className="text-white/60 mb-4">
        Click the &quot;New Trade&quot; button in the journal or use the Quick Actions panel. Fill in the instrument, direction (long/short), entry and exit prices, position size, and the outcome. You can also tag the trade with the strategy you used. All fields save automatically as you type.
      </p>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 rounded mb-6">
        <p className="text-white/80 text-sm">
          <strong className="text-[#fcd535]">Tip:</strong> Log your trade immediately after closing it. Waiting even a few hours can blur important details about your decision-making process.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. Adding Screenshots and Notes</h2>
      <p className="text-white/60 mb-4">
        Attach up to five screenshots per trade entry — charts, order confirmations, or news events that influenced your decision. Use the notes field to describe your rationale, what you observed, and what you would do differently. Screenshots are stored securely and included in export reports.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Emotional Tagging System</h2>
      <p className="text-white/60 mb-4">
        After logging a trade, select the emotion you felt most during the trade: confident, anxious, impatient, focused, fearful, or neutral. Over time, the system correlates emotional states with performance outcomes, helping you identify which mindsets produce your best results.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Reviewing Past Entries</h2>
      <p className="text-white/60 mb-4">
        The journal browser lets you filter entries by date range, instrument, strategy, emotion, or outcome. Use the calendar view to spot patterns — for example, do you trade better on certain days of the week? Click any entry to expand the full detail including screenshots and notes.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Importing Trades</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">CSV Import</h3>
          <p className="text-white/60 text-sm">Upload a CSV file from your broker. Map columns to instrument, price, size, and date fields using the import wizard.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Broker API</h3>
          <p className="text-white/60 text-sm">Connect your broker account via API for automatic trade import. Supported brokers are listed in the integrations page.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Manual Entry</h3>
          <p className="text-white/60 text-sm">Use the quick-add form for one-off trades. The system will prompt you to backfill any missing details later.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Duplicate Detection</h3>
          <p className="text-white/60 text-sm">The journal automatically detects and flags potential duplicate entries so your stats stay accurate.</p>
        </div>
      </div>
    </div>
  )
}
