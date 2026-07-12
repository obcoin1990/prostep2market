import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, GraduationCap, Users, BarChart3, Target, Eye, ClipboardCheck, CheckCircle2, TrendingUp, BookOpen, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "Trading Coaches — ProStep2Market Solutions",
  description: "Scale your trading coaching with data-driven insights. Monitor student progress, identify weaknesses, and deliver personalized coaching at scale.",
  openGraph: { title: "ProStep2Market for Trading Coaches", description: "Data-driven coaching for trading educators." },
}

const benefits = [
  { icon: Eye, title: "Student Progress Visibility", desc: "View every student&apos;s Trader DNA profile, trade history, Edge Score trends, and improvement areas at a glance." },
  { icon: Target, title: "Identify Weaknesses Fast", desc: "AI analysis highlights each student&apos;s specific behavioral blind spots so you can target your coaching." },
  { icon: Users, title: "Group Management", desc: "Create cohorts, run group challenges, and compare student progress on leaderboards." },
  { icon: BarChart3, title: "Objective Measurements", desc: "Replace subjective assessments with data-driven Edge Scores and behavioral metrics." },
  { icon: BookOpen, title: "Curriculum Integration", desc: "Assign structured learning paths and track completion. See how education translates to trading improvement." },
  { icon: TrendingUp, title: "Scale Your Practice", desc: "Coach 5x more students with the same effort. Automated insights free you to focus on high-impact interventions." },
]

export default function TradingCoachesPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            For{" "}
            <span className="text-[#fcd535]">Trading Coaches</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            You know every trader is different. Now you have the data to prove it — and the tools 
            to coach each student exactly where they need it most.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Start Coaching <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Coach Smarter, Not Harder</h2>
          <p className="mb-16 text-center text-[#848e9c]">Data-driven coaching that scales.</p>
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
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to Scale Your Coaching?</h2>
          <p className="mb-8 text-[#848e9c]">Join trading coaches using ProStep2Market.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
