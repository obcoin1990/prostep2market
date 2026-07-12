import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Target, Eye, Heart, Lightbulb, BarChart3, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Mission & Vision — ProStep2Market",
  description: "Our mission is to make every trader self-aware, disciplined, and consistently profitable through behavioral science and AI. Learn what drives us.",
  openGraph: { title: "ProStep2Market Mission & Vision", description: "Making every trader self-aware through behavioral science and AI." },
}

const pillars = [
  { icon: Target, title: "Self-Awareness First", desc: "Traders cannot improve what they don't measure. We make invisible behavioral patterns visible through data, giving every trader a mirror into their trading psychology." },
  { icon: BarChart3, title: "Data-Driven Growth", desc: "Opinions are cheap. We replace guesswork with quantified metrics across discipline, risk management, emotional stability, consistency, and strategy adherence." },
  { icon: Shield, title: "Safety by Design", desc: "Trading is risky enough. Our platform is built with read-only connections, non-intrusive interventions, and ironclad privacy. We help, we never enable harm." },
  { icon: Lightbulb, title: "Practical Intelligence", desc: "Insights without action are noise. Every analysis comes with specific, actionable recommendations that traders can implement in their next session." },
  { icon: Heart, title: "Psychology-Driven Technology", desc: "Technology should serve human understanding, not replace it. Our AI exists to illuminate trader psychology, not to automate trading decisions." },
  { icon: Eye, title: "Continuous Evolution", desc: "A trader's psychology evolves. So does our platform. We continuously refine our models based on aggregate data while respecting individual privacy." },
]

export default function MissionPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Our Mission:{" "}
            <span className="text-[#fcd535]">Understand Yourself</span>
            <br />Before You Understand the Market
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            We believe the greatest edge in trading isn't a strategy, indicator, or algorithm. 
            It's self-awareness. Our mission is to give every trader the tools to understand 
            their own psychology and transform it into consistent performance.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Start Your Journey <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Our Philosophy</h2>
            <p className="mb-8 text-lg leading-relaxed text-[#848e9c]">
              The trading industry is broken. Platforms sell signals, strategies, and shortcuts. 
              They ignore the one factor that separates consistently profitable traders from everyone else: 
              <span className="text-white"> behavioral mastery</span>.
            </p>
            <p className="text-lg leading-relaxed text-[#848e9c]">
              We exist to fix that. ProStep2Market is the first platform that measures, analyzes, 
              and improves the trader behind the trades. We don't just track your P&L — we track 
              your decision quality, emotional patterns, discipline consistency, and risk behavior.
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="border-t border-[#2b3139] py-20" style={{ background: "linear-gradient(180deg, #0b0e11 0%, #111519 100%)" }}>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Eye className="mx-auto mb-6 h-10 w-10 text-[#fcd535]" />
            <h2 className="mb-4 text-3xl font-bold text-white">Our Vision</h2>
            <p className="mb-6 text-lg leading-relaxed text-[#848e9c]">
              A world where every trader — from retail beginner to institutional professional — 
              has complete visibility into their trading psychology. Where behavioral data is as 
              important as market data. Where consistency is celebrated over jackpot trades.
            </p>
            <p className="text-lg leading-relaxed text-[#848e9c]">
              We envision a future where trading platforms are judged not by the tools they provide, 
              but by the traders they create. Where prop firms evaluate candidates on behavioral 
              fitness as much as technical skill. Where the question isn't "what's your win rate?" 
              but "who are you as a trader?"
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">What Drives Us</h2>
          <p className="mb-16 text-center text-[#848e9c]">Six principles that guide every product decision.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-colors hover:border-[#3a3a5c]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px] bg-yellow-500/10">
                  <p.icon className="h-5 w-5 text-[#fcd535]" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{p.title}</h3>
                <p className="text-sm leading-relaxed text-[#848e9c]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Join the Behavior-First Revolution</h2>
          <p className="mb-8 text-[#848e9c]">The most important investment you'll ever make is in understanding yourself.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Begin Your Journey <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
