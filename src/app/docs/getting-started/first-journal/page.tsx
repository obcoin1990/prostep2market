'use client'

export default function FirstJournalEntry() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-[#eaecef]">Your First Journal Entry</h1>
        <p className="text-[#aeaeae] max-w-2xl">
          Recording your trades is the foundation of becoming a better trader. This guide walks you through
          creating your first journal entry and capturing the emotional context behind every trade.
        </p>
      </div>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 text-sm text-[#eaecef]">
        <strong>Why journaling matters:</strong> Traders who consistently journal improve their win rate by an
        average of 22%. Capturing not just what you traded, but <em>why</em> and <em>how you felt</em>, reveals
        patterns in your decision-making that lead to measurable growth.
      </div>

      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">1. Navigate to the Journal</h2>
          <p className="text-[#aeaeae]">
            From the sidebar, click <strong>Journal</strong>. If this is your first visit, you will see an
            empty timeline. Click the <strong>+ New Entry</strong> button in the top-right corner to begin.
          </p>
          <div className="border border-[#2b3139] rounded-lg p-4 bg-[#1e2329] text-sm text-[#aeaeae]">
            <em>[Screenshot: Journal page with + New Entry button highlighted]</em>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">2. Select Instrument & Trade Type</h2>
          <p className="text-[#aeaeae]">
            Choose the instrument you traded (e.g., EURUSD, BTCUSD, AAPL) and whether it was a buy or sell
            position. Use the search bar if you have a long list of favorites.
          </p>
          <div className="bg-[#1e2329] border border-[#2b3139] rounded-lg p-4 font-mono text-sm text-[#aeaeae]">
            <div>Instrument: EURUSD</div>
            <div>Direction: Long (Buy)</div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">3. Enter Entry & Exit Details</h2>
          <p className="text-[#aeaeae]">
            Fill in your entry price, exit price, position size, stop loss, and take profit levels. If the trade
            was imported automatically from MT5, these fields will be pre-filled.
          </p>
          <div className="border border-[#2b3139] rounded-lg p-4 bg-[#1e2329] text-sm text-[#aeaeae]">
            <em>[Screenshot: Trade details form with price fields]</em>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">4. Add Notes & Strategy Tags</h2>
          <p className="text-[#aeaeae]">
            Write a brief note about the trade setup, market conditions, and whether you followed your plan.
            Add strategy tags like <strong>trend-following</strong>, <strong>breakout</strong>, or{' '}
            <strong>reversal</strong> to categorize your entries.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">5. Rate Your Emotions</h2>
          <p className="text-[#aeaeae]">
            Use the emotion slider to rate how you felt during the trade — from fearful to confident. This data
            feeds your Trader DNA profile and helps you spot emotional patterns over time.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">6. Submit</h2>
          <p className="text-[#aeaeae]">
            Review your entry, then click <strong>Save Entry</strong>. Your trade will appear in the journal
            timeline and your Dashboard stats will update automatically.
          </p>
        </section>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-[#eaecef]">Tips for Great Journals</h2>
        <ul className="space-y-2 text-sm text-[#aeaeae] list-disc pl-5">
          <li>Journal every trade — winners and losers alike. Both teach you something.</li>
          <li>Be honest about your emotional state. There is no right or wrong feeling.</li>
          <li>Use consistent strategy tags so you can filter and analyze later.</li>
          <li>Add screenshots of your chart setup for visual reference.</li>
        </ul>
      </div>
    </div>
  )
}
