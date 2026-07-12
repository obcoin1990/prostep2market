import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Dna, BookMarked, Sparkles, ShieldAlert, Trophy, FlaskConical, Brain, BarChart3, CheckCircle2, Layers, Zap, Users, Lock } from "lucide-react"

export const metadata: Metadata = {
  title: "Product — ProStep2Market",
  description: "A complete behavioral trading platform. Trader DNA, AI Trade Intelligence, Trade Journal, Risk Guardian, Edge Score, Strategy Lab, and Education — built to make you a consistent trader.",
  openGraph: { title: "ProStep2Market Product", description: "Six integrated modules that transform how you trade." },
}

const modules = [
  { icon: Dna, title: "Trader DNA", desc: "Your unique psychological profile mapped across 16 behavioral dimensions. Understand your risk tolerance, emotional triggers, and decision patterns.", href: "/trader-dna", color: "#8b5cf6" },
  { icon: Sparkles, title: "AI Trade Intelligence", desc: "GPT-powered analysis that reviews every trade, identifies patterns in your decision-making, and delivers personalized coaching insights.", href: "/analysis", color: "#fcd535" },
  { icon: BookMarked, title: "Trade Journal", desc: "Structured journaling with MT4/MT5 sync, sentiment tracking, screenshot capture, and pattern recognition — the most comprehensive trade log in existence.", href: "/journal", color: "#3b82f6" },
  { icon: ShieldAlert, title: "Risk Guardian", desc: "Real-time risk monitoring with configurable alerts. Set drawdown limits, position size rules, and pause trading when you exceed your parameters.", href: "/risk-guardian", color: "#ef4444" },
  { icon: Trophy, title: "Edge Score", desc: "A single, scientifically validated score that measures your trading consistency. Track your improvement over time and compete on leaderboards.", href: "/dashboard#edge-score", color: "#f59e0b" },
  { icon: FlaskConical, title: "Strategy Lab", desc: "Backtest, simulate, and refine strategies in a risk-free environment. Test hypotheses before committing real capital.", href: "/strategy-lab", color: "#10b981" },
  { icon: Brain, title: "Education Platform", desc: "Structured learning paths, interactive quizzes, certification programs, and expert-led courses — from beginner to professional trader.", href: "/education", color: "#06b6d4" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Comprehensive performance analytics with 40+ metrics, custom date ranges, exportable reports, and visual trend analysis.", href: "/dashboard", color: "#ec4899" },
]

const features = [
  { icon: Layers, title: "Unified Platform", desc: "All modules work together seamlessly. Your Trader DNA informs your Risk Guardian. Your journal feeds your AI analysis. Every module enhances every other." },
  { icon: Zap, title: "Real-Time Sync", desc: "Automatic MT4/MT5 trade synchronization. Every trade captured, categorized, and analyzed the moment it closes." },
  { icon: Users, title: "Team & Social", desc: "Compare progress with peers, share strategies in private groups, and learn from a growing community of traders." },
  { icon: Lock, title: "Enterprise Security", desc: "SOC 2 compliant, data encrypted at rest and in transit, read-only broker connections — your data never leaves your control." },
]

export default function ProductPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2b3139] bg-[#1e2329] px-4 py-1.5 text-xs font-medium text-[#848e9c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#fcd535]" />
            Six Integrated Modules, One Platform
          </div>
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            The Complete Platform for{" "}
            <span className="text-[#fcd535]">Consistent Traders</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            ProStep2Market is the only platform that combines behavioral psychology, AI analysis, 
            risk management, and structured education into a single, integrated system. 
            Every tool works together to build your trading discipline.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/product/features" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Module Grid */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Integrated Modules</h2>
          <p className="mb-16 text-center text-[#848e9c]">Every module designed to work together, amplifying your growth.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {modules.map((m) => (
              <Link key={m.title} href={m.href} className="group rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-all hover:border-[#3a3a5c] hover:-translate-y-0.5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px]" style={{ backgroundColor: `${m.color}1A` }}>
                  <m.icon className="h-5 w-5" style={{ color: m.color }} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white group-hover:text-[#fcd535] transition-colors">{m.title}</h3>
                <p className="text-sm leading-relaxed text-[#848e9c]">{m.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Platform Features</h2>
          <p className="mb-16 text-center text-[#848e9c]">What makes ProStep2Market different from every other trading tool.</p>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4 rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                  <f.icon className="h-5 w-5 text-[#fcd535]" />
                </div>
                <div>
                  <h3 className="mb-1 text-base font-semibold text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-[#848e9c]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="border-t border-[#2b3139] py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "Early Access", label: "Active Traders" },
              { value: "Growing", label: "Trades Analyzed" },
              { value: "Early Access", label: "User Satisfaction" },
              { value: "Growing", label: "Avg. Consistency Gain" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-3xl font-bold text-[#fcd535] md:text-4xl">{m.value}</div>
                <div className="mt-2 text-sm text-[#848e9c]">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to Trade Consistently?</h2>
          <p className="mb-8 text-[#848e9c]">Join traders who are transforming their approach with ProStep2Market.</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/demo/dashboard" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              Try Live Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
