import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, User, TrendingUp, Shield, BarChart3, Target, CheckCircle2, Brain, Sparkles, BookMarked, Dna, Trophy, FlaskConical } from "lucide-react"

export const metadata: Metadata = {
  title: "Retail Traders — ProStep2Market Solutions",
  description: "Transform your trading with behavioral science and AI. ProStep2Market for individual traders — improve consistency, eliminate emotional trading, and track your growth.",
  openGraph: { title: "ProStep2Market for Retail Traders", description: "Build trading consistency with AI-powered insights." },
}

const features = [
  { icon: Dna, title: "Know Your Trading DNA", desc: "Discover your unique psychological profile across 16 behavioral dimensions. Understand why you trade the way you do." },
  { icon: Sparkles, title: "AI Trade Reviews", desc: "Every trade analyzed by GPT-powered AI. Get personalized insights on what went right, what went wrong, and how to improve." },
  { icon: BookMarked, title: "Smart Trade Journal", desc: "Auto-sync from MT4/MT5. Add screenshots, sentiment, and strategy notes. Search and filter every trade instantly." },
  { icon: Shield, title: "Risk Guardian", desc: "Set your risk parameters and let the system alert you when you&apos;re偏离 your plan. Prevent emotional trading before it happens." },
  { icon: Trophy, title: "Edge Score", desc: "A single score that measures your trading consistency. Track your improvement over time and compare with peers." },
  { icon: FlaskConical, title: "Strategy Lab", desc: "Test strategies risk-free with backtesting and paper trading. Refine your approach before committing real capital." },
]

const plans = [
  { name: "Starter", price: "Free", desc: "Basic journaling and Trader DNA assessment", features: ["Trade journal with manual entry", "Trader DNA basic assessment", "Edge Score tracking", "Basic analytics"] },
  { name: "Pro", price: "$29/mo", desc: "Full platform access with AI analysis", features: ["Everything in Starter", "AI trade analysis (GPT-4)", "Risk Guardian alerts", "Strategy Lab access", "Advanced analytics", "Export reports"] },
  { name: "Elite", price: "$79/mo", desc: "Maximum insight with priority support", features: ["Everything in Pro", "Unlimited AI analysis", "Priority support", "Custom risk rules", "Multi-account aggregation", "Beta feature access"] },
]

export default function RetailTradersPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            For{" "}
            <span className="text-[#fcd535]">Retail Traders</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            You have the passion. You have the strategy. Now get the psychological edge that separates 
            consistent winners from everyone else.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Start Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/product/features" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              View Features
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="border-t border-[#2b3139] py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "Early Access", label: "Traders Onboarded" },
              { value: "Growing", label: "Avg. Consistency Gain" },
              { value: "Early Access", label: "User Satisfaction" },
              { value: "Growing", label: "Less Emotional Trading" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-3xl font-bold text-[#fcd535] md:text-4xl">{m.value}</div>
                <div className="mt-2 text-sm text-[#848e9c]">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Everything You Need</h2>
          <p className="mb-16 text-center text-[#848e9c]">Six integrated modules working together to build your trading consistency.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-colors hover:border-[#3a3a5c]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                  <f.icon className="h-5 w-5 text-[#fcd535]" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[#848e9c]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-[#2b3139] py-20 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Simple Pricing</h2>
          <p className="mb-16 text-center text-[#848e9c]">Start free. Upgrade when you&apos;re ready for more.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6">
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <div className="mt-2 text-3xl font-bold text-[#fcd535]">{p.price}</div>
                <p className="mt-1 text-sm text-[#848e9c]">{p.desc}</p>
                <ul className="mt-6 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#848e9c]">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#10b981]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="mt-6 flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#fcd535] px-4 py-2.5 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
                  {p.name === "Starter" ? "Get Started Free" : "Subscribe"} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Start Trading Consistently</h2>
          <p className="mb-8 text-[#848e9c]">Join traders who are transforming their approach.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
