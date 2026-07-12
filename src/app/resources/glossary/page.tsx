import type { Metadata } from "next"
import { Search } from "lucide-react"

export const metadata: Metadata = {
  title: "Glossary — ProStep2Market Resources",
  description: "Comprehensive glossary of trading psychology, behavioral finance, and platform terminology.",
}

const terms = [
  { term: "Behavioral Finance", def: "The study of how psychological influences affect financial behaviors and market outcomes." },
  { term: "Cognitive Bias", def: "Systematic patterns of deviation from rationality in judgment, often affecting trading decisions." },
  { term: "Confirmation Bias", def: "The tendency to search for or interpret information in a way that confirms one's preconceptions." },
  { term: "Drawdown", def: "The peak-to-trough decline in a trading account's value, typically expressed as a percentage." },
  { term: "Edge Score", def: "ProStep2Market's proprietary metric measuring trading consistency across 12 weighted behavioral factors." },
  { term: "Expectancy", def: "The average amount you can expect to win or lose per trade over many trades." },
  { term: "FOMO (Fear of Missing Out)", def: "Anxiety-driven trading behavior where traders enter positions due to fear of missing potential profits." },
  { term: "Loss Aversion", def: "The tendency to prefer avoiding losses over acquiring equivalent gains — losses feel approximately twice as painful." },
  { term: "Overconfidence Effect", def: "A bias where traders overestimate their knowledge, skill, or ability to predict market movements." },
  { term: "Position Sizing", def: "Determining the appropriate amount of capital to risk on a single trade based on account size and risk parameters." },
  { term: "Recency Bias", def: "The tendency to weigh recent events more heavily than earlier events when making decisions." },
  { term: "Revenge Trading", def: "Emotional trading行为 driven by the desire to recover losses, often leading to further losses." },
  { term: "Risk-Reward Ratio", def: "The ratio of potential profit to potential loss on a trade, typically expressed as 1:2, 1:3, etc." },
  { term: "Sharpe Ratio", def: "A measure of risk-adjusted return, calculated as the excess return per unit of volatility." },
  { term: "Slippage", def: "The difference between the expected price of a trade and the price at which the trade is executed." },
  { term: "Stop Loss", def: "An order placed to close a position at a predetermined price level to limit potential losses." },
  { term: "Trader DNA", def: "ProStep2Market's behavioral assessment system that profiles traders across 16 psychological dimensions." },
  { term: "Win Rate", def: "The percentage of trades that result in a profit, calculated as winning trades divided by total trades." },
  { term: "Risk Guardian", def: "ProStep2Market's real-time risk monitoring system with configurable alerts and circuit breakers." },
  { term: "Strategy Lab", def: "ProStep2Market's backtesting and simulation environment for developing and testing trading strategies." },
  { term: "Sortino Ratio", def: "A variation of the Sharpe ratio that only considers downside volatility in its calculation." },
  { term: "Calmar Ratio", def: "A ratio comparing the average annual rate of return to the maximum drawdown over a specified period." },
  { term: "Profit Factor", def: "The ratio of gross profit to gross loss, used to evaluate a strategy's profitability." },
  { term: "Max Drawdown", def: "The largest peak-to-trough decline in account value over a specific period." },
  { term: "Average Win / Average Loss", def: "The ratio of average winning trade to average losing trade, used to assess risk-reward efficiency." },
  { term: "Consecutive Losses", def: "A sequence of losing trades that can trigger emotional decision-making and revenge trading." },
  { term: "Risk-Adjusted Return", def: "A measure of how much return an investment generates relative to the risk taken." },
  { term: "Volatility", def: "A statistical measure of the dispersion of returns for a given market or instrument." },
  { term: "Leverage", def: "The use of borrowed capital to increase the potential return of an investment." },
  { term: "Liquidity", def: "The ease with which an asset can be bought or sold without affecting its market price." },
  { term: "Bid-Ask Spread", def: "The difference between the highest price a buyer is willing to pay and the lowest price a seller is willing to accept." },
  { term: "Pips", def: "The smallest price movement in forex trading, typically the fourth decimal place in most currency pairs." },
  { term: "Lot Size", def: "The standardized quantity of a financial instrument being traded, such as standard, mini, or micro lots." },
  { term: "Margin Call", def: "A broker's demand that a trader deposits additional funds to maintain minimum account equity." },
  { term: "Backtesting", def: "Testing a trading strategy on historical data to evaluate its potential performance before live deployment." },
  { term: "Paper Trading", def: "Simulated trading with virtual capital to practice strategies without financial risk." },
  { term: "Risk Tolerance", def: "An individual's capacity and willingness to endure market volatility and potential losses." },
  { term: "Discipline", def: "The ability to consistently follow a trading plan regardless of emotional state or market conditions." },
  { term: "Overtrading", def: "Excessive trading behavior often driven by emotional factors rather than strategic opportunity." },
  { term: "Anchoring", def: "A cognitive bias where traders rely too heavily on an initial piece of information when making decisions." },
  { term: "Herd Mentality", def: "The tendency to follow the actions of the majority, often leading to crowded trades." },
  { term: "Hindsight Bias", def: "The tendency to see past events as having been predictable after they have occurred." },
  { term: "Self-Attribution Bias", def: "The tendency to attribute successes to personal skill and failures to external factors." },
  { term: "Gambler's Fallacy", def: "The mistaken belief that past events affect future probabilities in independent random events." },
]

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export default function GlossaryPage() {
  const grouped = alphabet.map(letter => ({
    letter,
    terms: terms.filter(t => t.term[0].toUpperCase() === letter),
  })).filter(g => g.terms.length > 0)

  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Glossary</h1>
          <p className="mb-8 text-[#848e9c]">Common trading psychology and platform terms explained.</p>
          <div className="mx-auto flex max-w-md items-center gap-2 rounded-[10px] border border-[#2b3139] bg-[#1e2329] px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-[#848e9c]" />
            <input type="text" placeholder="Search terms..." className="w-full bg-transparent text-sm text-[#eaecef] placeholder-[#848e9c] outline-none" readOnly />
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex flex-wrap gap-2">
            {alphabet.map(l => {
              const hasTerms = grouped.some(g => g.letter === l)
              return (
                <span key={l} className={`flex h-8 w-8 items-center justify-center rounded-[6px] text-xs font-medium ${hasTerms ? "bg-[#1e2329] text-[#eaecef] border border-[#2b3139]" : "text-[#2b3139]"}`}>{l}</span>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {terms.map((t) => (
              <div key={t.term} className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-5">
                <h3 className="mb-1 text-sm font-semibold text-[#fcd535]">{t.term}</h3>
                <p className="text-sm leading-relaxed text-[#848e9c]">{t.def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
