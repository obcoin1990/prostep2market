import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Search, TrendingDown, Zap, Shield, BarChart3, Users, BookOpen, TrendingUp, Target, Brain, AlertTriangle, Frown, Crosshair, RefreshCw, Activity } from "lucide-react"

export const metadata: Metadata = {
  title: "Solutions by Problem — ProStep2Market",
  description: "Find the right solution for your specific trading challenge. Emotional trading, inconsistency, risk management, and more.",
  openGraph: { title: "ProStep2Market — Solutions by Problem", description: "Find solutions for your trading challenges." },
}

const problems = [
  {
    id: "inconsistent",
    icon: TrendingDown,
    title: "Inconsistent Trading Results",
    desc: "You have winning days and losing days, but no clear pattern for what&apos;s working and what isn&apos;t.",
    solution: "Trader DNA + Edge Score",
    detail: "Our Trader DNA assessment identifies the behavioral factors behind your inconsistency. Edge Score gives you a single metric to track improvement. AI analysis correlates your mental state with trading outcomes.",
    modules: ["Trader DNA", "Edge Score", "AI Trade Intelligence"],
    href: "/product",
    color: "#ef4444",
  },
  {
    id: "emotional",
    icon: Brain,
    title: "Emotional / Revenge Trading",
    desc: "After a loss, you feel the urge to immediately trade again to recover. Or you hold losing positions hoping they&apos;ll turn around.",
    solution: "Risk Guardian + AI Analysis",
    detail: "Risk Guardian detects emotional trading patterns in real-time and can automatically pause trading when risk parameters are breached. AI analysis identifies the emotional triggers behind your decisions.",
    modules: ["Risk Guardian", "AI Trade Intelligence", "Trade Journal"],
    href: "/product",
    color: "#f59e0b",
  },
  {
    id: "feedback",
    icon: Activity,
    title: "No Structured Feedback Loop",
    desc: "You close a trade and move on without understanding what you did right or wrong. No systematic improvement process.",
    solution: "Trade Journal + AI Insights",
    detail: "Our structured journaling templates ensure you capture the right data for every trade. AI-powered analysis delivers actionable insights after every session, creating a continuous improvement cycle.",
    modules: ["Trade Journal", "AI Trade Intelligence", "Analytics"],
    href: "/product",
    color: "#3b82f6",
  },
  {
    id: "scaling",
    icon: Users,
    title: "Difficulty Scaling Coaching",
    desc: "You&apos;re a coach who can only work with a limited number of students because personalized feedback is manual.",
    solution: "Platform + Group Analytics",
    detail: "ProStep2Market gives you visibility into every student&apos;s trading data. AI analysis highlights who needs intervention. Group features let you run challenges and compare progress at scale.",
    modules: ["Trader DNA", "Edge Score", "Education Platform"],
    href: "/solutions/trading-coaches",
    color: "#8b5cf6",
  },
  {
    id: "compliance",
    icon: Shield,
    title: "Trader Compliance Monitoring",
    desc: "You manage a prop firm and need to ensure all traders stay within risk parameters. Manual monitoring doesn&apos;t scale.",
    solution: "Risk Guardian + Reports",
    detail: "Firm-wide risk rules with automated alerts. Real-time compliance dashboard shows every trader&apos;s risk exposure. Generate compliance reports for auditors with one click.",
    modules: ["Risk Guardian", "Analytics", "Admin Dashboard"],
    href: "/solutions/prop-firms",
    color: "#10b981",
  },
]

export default function ByProblemPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Find Solutions by{" "}
            <span className="text-[#fcd535]">Problem</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Every trader faces challenges. Select yours and discover how ProStep2Market can help.
          </p>
        </div>
      </section>

      {/* Problem List */}
      {problems.map((p, i) => (
        <section key={p.id} id={p.id} className={`border-t border-[#2b3139] py-20 ${i % 2 === 1 ? "bg-[#0d1015]" : ""}`}>
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px]" style={{ backgroundColor: `${p.color}1A` }}>
                    <p.icon className="h-5 w-5" style={{ color: p.color }} />
                  </div>
                  <h2 className="text-xl font-bold text-white">{p.title}</h2>
                </div>
                <p className="mb-4 text-[#848e9c]">{p.desc}</p>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: `${p.color}1A`, color: p.color }}>
                  Solution: {p.solution}
                </div>
                <p className="text-sm leading-relaxed text-[#848e9c]">{p.detail}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.modules.map((m) => (
                    <span key={m} className="rounded-full border border-[#2b3139] px-2.5 py-1 text-xs text-[#eaecef]">{m}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-start justify-center gap-4">
                <Link href={p.href} className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
                  Explore Solution <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Still Not Sure?</h2>
          <p className="mb-8 text-[#848e9c]">Take our 2-minute assessment and we&apos;ll recommend the right solution.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Get Recommendations <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
