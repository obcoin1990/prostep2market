import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Building2, Shield, Users, BarChart3, Bell, Target, CheckCircle2, Eye, TrendingUp, ClipboardCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Prop Firms — ProStep2Market Solutions",
  description: "Manage trader performance, risk, and compliance across your entire firm. ProStep2Market for prop trading firms.",
  openGraph: { title: "ProStep2Market for Prop Firms", description: "Trader management and risk monitoring at scale." },
}

const benefits = [
  { icon: Eye, title: "Full Trader Visibility", desc: "See every trade, every risk parameter breach, and every behavioral pattern across all your traders in one dashboard." },
  { icon: Shield, title: "Firm-Wide Risk Control", desc: "Set global risk rules that apply across all traders. Automated alerts when any trader exceeds parameters." },
  { icon: BarChart3, title: "Performance Analytics", desc: "Rank traders by Edge Score, risk-adjusted returns, and consistency. Make data-driven decisions about trader funding." },
  { icon: Users, title: "Structured Onboarding", desc: "Automated onboarding with Trader DNA assessment, education paths, and initial risk parameter setup." },
  { icon: Bell, title: "Real-Time Alerts", desc: "Instant notifications for drawdown breaches, position size violations, and unusual trading patterns." },
  { icon: ClipboardCheck, title: "Compliance Reporting", desc: "Generate compliance reports for auditors. Export trader performance data for internal analysis." },
]

const metrics = [
  { value: "Early Access", label: "Faster Trader Onboarding" },
  { value: "Growing", label: "Fewer Rule Violations" },
  { value: "Real-time", label: "Trader Visibility" },
  { value: "Real-time", label: "Risk Monitoring" },
]

export default function PropFirmsPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            For{" "}
            <span className="text-[#fcd535]">Prop Trading Firms</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Manage traders with confidence. ProStep2Market gives you real-time visibility 
            into every trader&apos;s risk exposure, behavioral patterns, and performance metrics.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Schedule Demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/solutions/enterprise" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              Enterprise Features
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="border-t border-[#2b3139] py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-3xl font-bold text-[#fcd535] md:text-4xl">{m.value}</div>
                <div className="mt-2 text-sm text-[#848e9c]">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Why Prop Firms Choose ProStep2Market</h2>
          <p className="mb-16 text-center text-[#848e9c]">Purpose-built for the unique needs of prop trading operations.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-colors hover:border-[#3a3a5c]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                  <b.icon className="h-5 w-5 text-[#fcd535]" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{b.title}</h3>
                <p className="text-sm leading-relaxed text-[#848e9c]">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">See It In Action</h2>
          <p className="mb-8 text-[#848e9c]">Schedule a personalized demo for your prop firm.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Book a Demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
