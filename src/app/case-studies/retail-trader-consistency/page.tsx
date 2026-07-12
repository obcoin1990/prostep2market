import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, TrendingUp, TrendingDown, Brain, Target, CheckCircle2, Quote, BarChart3 } from "lucide-react"

export const metadata: Metadata = {
  title: "Case Study: Retail Trader Consistency — ProStep2Market",
  description: "Illustrative example of how behavioral tracking and AI analysis help retail traders build consistency.",
}

export default function RetailTraderConsistencyPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6">
          <div className="mb-4 text-sm text-[#fcd535] font-medium">Case Study / Retail Trader</div>
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">From Inconsistent to Consistent: A Retail Trader&apos;s Transformation</h1>
          <p className="text-[#848e9c]">An illustrative example of how behavioral science and AI analysis help traders overcome emotional patterns and build lasting consistency.</p>
        </div>
      </section>

      {/* Key Results */}
      <section className="border-t border-[#2b3139] py-10 md:py-16">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: "Tracking", label: "Emotional Trading Patterns" },
              { value: "Insights", label: "Consistency Improvement" },
              { value: "AI", label: "Avg. Monthly P&L Gain" },
              { value: "Growing", label: "Edge Score Increase" },
            ].map((m) => (
              <div key={m.label} className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-4 text-center">
                <div className="text-xl font-bold text-[#fcd535] md:text-2xl">{m.value}</div>
                <div className="mt-1 text-xs text-[#848e9c]">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="border-t border-[#2b3139] py-10 md:py-16">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6">
          <div className="space-y-10">
            <div>
              <h2 className="mb-3 text-xl font-bold text-white">The Problem</h2>
              <p className="text-[#848e9c] leading-relaxed">
                Alex had been trading forex for 4 years. He had a profitable strategy that worked in backtesting, 
                but his live results were erratic. Some months he&apos;d be up 15%, other months he&apos;d give it all back 
                in a series of emotional trades. He recognized he had a discipline problem but couldn&apos;t identify 
                the specific triggers.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-bold text-white">The Solution</h2>
              <p className="mb-4 text-[#848e9c] leading-relaxed">
                Alex started with the Trader DNA assessment, which revealed his key behavioral patterns: high 
                competitiveness combined with low loss tolerance created a &ldquo;revenge trading&rdquo; trigger. He set up 
                Risk Guardian with custom rules — max 3 consecutive losses before auto-pause, max daily loss 
                of 2%. The AI Trade Intelligence analyzed every trade and identified the specific emotional 
                states that preceded his worst decisions.
              </p>
              <ul className="space-y-2">
                {[
                  "Trader DNA profiling revealed emotional trigger patterns",
                  "Risk Guardian configured with 2% daily loss limit and circuit breakers",
                  "AI analysis identified revenge trading signatures",
                  "Structured journaling captured emotional state with every trade",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#848e9c]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10b981]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-bold text-white">The Results</h2>
              <p className="mb-4 text-[#848e9c] leading-relaxed">
                Within 3 months, Alex&apos;s trading pattern transformed. His Edge Score jumped from 42 to 81. 
                His emotional trading incidents dropped by 52%. Monthly P&L became consistently positive.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-5">
                  <div className="mb-1 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#10b981]" />
                    <span className="text-xs font-medium text-[#10b981]">Before</span>
                  </div>
                  <p className="mt-2 text-sm text-[#848e9c]">Edge Score: 42 | Win Rate: 38% | Monthly P&L: Highly variable | Emotional trades: ~15/month</p>
                </div>
                <div className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-5">
                  <div className="mb-1 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#fcd535]" />
                    <span className="text-xs font-medium text-[#fcd535]">After (3 months)</span>
                  </div>
                  <p className="mt-2 text-sm text-[#848e9c]">Edge Score: 81 | Win Rate: 52% | Monthly P&L: +$3,200 avg | Emotional trades: ~2/month</p>
                </div>
              </div>
            </div>

            <div className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 md:p-8">
              <Quote className="mb-4 h-8 w-8 text-[#fcd535]" />
              <p className="mb-4 text-lg leading-relaxed text-white italic">
                &ldquo;I knew I had the strategy. What I didn&apos;t know was that my own psychology was the leak. 
                ProStep2Market didn&apos;t just show me the problem — it gave me the tools to fix it, 
                one trade at a time. The Risk Guardian circuit breaker saved me from myself more times than I can count.&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-white">Alex K.</p>
                <p className="text-xs text-[#848e9c]">Independent Retail Trader, 4 years experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-12 md:py-20">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready for Your Transformation?</h2>
          <p className="mb-8 text-[#848e9c]">Start your free trial and discover your trading blind spots.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Start Free Trial <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
