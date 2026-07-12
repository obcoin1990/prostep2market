'use client'

export default function StrategyLabGuide() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Strategy Lab Guide</h1>
      <p className="text-white/60 mb-8">
        Strategy Lab is your environment for designing, testing, and refining trading strategies before risking real capital. Combine rules, run backtests, and validate your edge with forward testing.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. What Is Strategy Lab?</h2>
      <p className="text-white/60 mb-4">
        Strategy Lab bridges the gap between idea and execution. You define a strategy as a set of entry and exit rules, then test it against historical data (backtesting) and live simulated markets (forward testing). The lab tracks every result so you can iterate with data, not guesswork.
      </p>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 rounded mb-6">
        <p className="text-white/80 text-sm">
          <strong className="text-[#fcd535]">Tip:</strong> Start simple. A strategy with three clear rules is easier to evaluate and fix than one with fifteen edge cases.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. Building a Strategy with Rules</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Entry Rules</h3>
          <p className="text-white/60 text-sm">Define conditions for entering a trade: indicator values, price patterns, volume thresholds, or time-based filters.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Exit Rules</h3>
          <p className="text-white/60 text-sm">Set profit targets, stop-loss levels, trailing stops, or time-based exits. You can define multiple exit conditions.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Position Sizing</h3>
          <p className="text-white/60 text-sm">Configure fixed size, percentage risk, or Kelly criterion-based sizing. The lab calculates units automatically.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Filters &amp; Scenarios</h3>
          <p className="text-white/60 text-sm">Add market condition filters (trending vs ranging, high vs low volatility) and scenario tags for later analysis.</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Backtesting</h2>
      <p className="text-white/60 mb-4">
        Run your strategy against historical data with a single click. Configure the date range, initial capital, and commission model. The backtest engine processes tick-by-tick or OHLC data depending on your plan. Results include all standard metrics plus your estimated Edge Score impact. Review the trade-by-trade log to verify each decision matched your rules.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Forward Testing / Paper Trading</h2>
      <p className="text-white/60 mb-4">
        Once your strategy passes backtesting, move to forward testing in a simulated environment. The paper trading engine uses real-time market data but executes against virtual capital. Forward test results are tracked separately from your live trading stats. A minimum of 50 forward-test trades is recommended before considering a strategy for live use.
      </p>

      <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Analyzing Results</h2>
      <p className="text-white/60 mb-4">
        Every backtest and forward test produces a detailed report: equity curve, drawdown periods, win/loss distribution, monthly returns, and comparison against a buy-and-hold baseline. Use the comparison view to pit two strategies against each other side by side. Export results to share with a mentor or trading community.
      </p>
    </div>
  )
}
