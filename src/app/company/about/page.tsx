import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BarChart3, Users, TrendingUp, Award, Shield, Brain, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us — ProStep2Market",
  description: "We believe every trader has the potential for greatness. ProStep2Market combines behavioral finance science with AI to transform how traders develop discipline and consistency.",
  openGraph: { title: "About ProStep2Market", description: "Our mission to transform trader development through behavioral science and AI." },
}

const timeline = [
  { year: "2024", title: "The Insight", desc: "Our founders, experienced traders themselves, recognized that most trading platforms measure results but ignore the psychology driving those results. The idea for a behavior-first platform was born." },
  { year: "2025", title: "Building the Foundation", desc: "Assembled a team of behavioral psychologists, quant developers, and professional traders. Developed the proprietary behavioral assessment framework and AI analysis engine." },
  { year: "2026", title: "Platform Launch", desc: "Launched ProStep2Market with integrated modules: Trader DNA, AI Trade Intelligence, Risk Guardian, Trade Journal, Edge Score, and Strategy Lab." },
]

const values = [
  { icon: Brain, title: "Behavioral Science First", desc: "Every feature is grounded in proven behavioral finance research. We don't guess — we measure, analyze, and improve." },
  { icon: Shield, title: "Trader Safety Above All", desc: "Read-only connections, encrypted data, and non-intrusive interventions. We protect traders from their own worst impulses." },
  { icon: TrendingUp, title: "Continuous Improvement", desc: "Trading mastery is a journey, not a destination. Our platform evolves with every trade, every insight, every trader." },
  { icon: Users, title: "Community Over Competition", desc: "We believe the best traders lift others. Our platform fosters shared learning while respecting individual privacy and goals." },
]

const metrics = [
  { value: "6", label: "Core Modules" },
  { value: "AI", label: "Powered Analysis" },
  { value: "24/7", label: "Platform Availability" },
  { value: "SOC 2", label: "Security Compliance" },
]

export default function AboutPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Changing How Traders{" "}
            <span className="text-[#fcd535]">Understand Themselves</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            ProStep2Market was built on a simple truth: before you can master the markets, 
            you must master yourself. We combine behavioral finance science with AI to give 
            traders the self-awareness they need to trade consistently.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Start Your Journey <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/company/leadership" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              Meet Our Team
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

      {/* Story Timeline */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Our Story</h2>
          <p className="mb-16 text-center text-[#848e9c]">From insight to impact — the journey so far.</p>
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-4 top-0 h-full w-px bg-[#2b3139] md:left-1/2 md:-translate-x-px" />
            {timeline.map((item, i) => (
              <div key={item.year} className={`relative mb-12 flex flex-col gap-4 md:flex-row ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className="flex-1" />
                <div className="absolute left-2.5 z-10 flex h-3 w-3 items-center justify-center rounded-full bg-[#fcd535] md:left-1/2 md:-translate-x-1/2" />
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                  <span className="text-sm font-bold text-[#fcd535]">{item.year}</span>
                  <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#848e9c]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">What We Believe</h2>
          <p className="mb-16 text-center text-[#848e9c]">The principles that guide every decision we make.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-colors hover:border-[#3a3a5c]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px] bg-yellow-500/10">
                  <v.icon className="h-5 w-5 text-[#fcd535]" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{v.title}</h3>
                <p className="text-sm leading-relaxed text-[#848e9c]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to Transform Your Trading?</h2>
          <p className="mb-8 text-[#848e9c]">Join traders who are already improving their discipline and results.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
