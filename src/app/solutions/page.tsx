import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, User, Building2, GraduationCap, Briefcase, TrendingUp, Shield, BarChart3, Users, Target, CheckCircle2, Search } from "lucide-react"

export const metadata: Metadata = {
  title: "Solutions — ProStep2Market",
  description: "Find the right ProStep2Market solution for your needs. Retail traders, prop firms, trading coaches, brokerages, and enterprise.",
  openGraph: { title: "ProStep2Market Solutions", description: "Trading solutions for every segment." },
}

const solutions = [
  { icon: User, title: "Retail Traders", desc: "Individual trading consistency through behavioral science and AI.", href: "/solutions/retail-traders", color: "#3b82f6", stats: "Early Access" },
  { icon: Building2, title: "Prop Trading Firms", desc: "Manage trader performance, risk, and compliance at scale.", href: "/solutions/prop-firms", color: "#10b981", stats: "Early Access" },
  { icon: GraduationCap, title: "Trading Coaches", desc: "Scale your coaching with data-driven student insights.", href: "/solutions/trading-coaches", color: "#8b5cf6", stats: "Early Access" },
  { icon: Briefcase, title: "Brokerages", desc: "Reduce churn with differentiated value-added services.", href: "/solutions/brokerages", color: "#f59e0b", stats: "Early Access" },
  { icon: Shield, title: "Enterprise", desc: "SOC 2 compliant platform with SSO, SLAs, and white-label.", href: "/solutions/enterprise", color: "#ef4444", stats: "99.9% SLA" },
]

const problems = [
  { problem: "Inconsistent trading results", solution: "Trader DNA + Edge Score", href: "/solutions/by-problem#inconsistent" },
  { problem: "Emotional / revenge trading", solution: "Risk Guardian + AI Analysis", href: "/solutions/by-problem#emotional" },
  { problem: "No structured feedback loop", solution: "Trade Journal + AI Insights", href: "/solutions/by-problem#feedback" },
  { problem: "Difficulty scaling coaching", solution: "Platform + Group Analytics", href: "/solutions/by-problem#scaling" },
  { problem: "Trader compliance monitoring", solution: "Risk Guardian + Reports", href: "/solutions/by-problem#compliance" },
]

export default function SolutionsPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Solutions for Every{" "}
            <span className="text-[#fcd535]">Trading Need</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Whether you&apos;re an individual trader looking to improve consistency, a prop firm 
            managing risk across multiple traders, or a brokerage serving clients — 
            ProStep2Market has a solution for you.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Find Your Solution <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/solutions/comparison" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              Compare Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Choose Your Path</h2>
          <p className="mb-16 text-center text-[#848e9c]">Select the solution that matches your needs.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <Link key={s.title} href={s.href} className="group rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-all hover:border-[#3a3a5c] hover:-translate-y-0.5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px]" style={{ backgroundColor: `${s.color}1A` }}>
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white group-hover:text-[#fcd535] transition-colors">{s.title}</h3>
                <p className="mb-3 text-sm leading-relaxed text-[#848e9c]">{s.desc}</p>
                <div className="text-xs font-medium" style={{ color: s.color }}>{s.stats}</div>
              </Link>
            ))}
            <Link href="/solutions/by-problem" className="group rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-all hover:border-[#3a3a5c] hover:-translate-y-0.5 flex flex-col items-center justify-center text-center">
              <Search className="mb-3 h-8 w-8 text-[#848e9c] group-hover:text-[#fcd535] transition-colors" />
              <h3 className="text-base font-semibold text-white group-hover:text-[#fcd535] transition-colors">Browse by Problem</h3>
              <p className="mt-1 text-sm text-[#848e9c]">Find solutions for your specific challenges</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Problem */}
      <section className="border-t border-[#2b3139] py-20 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Common Challenges</h2>
          <p className="mb-16 text-center text-[#848e9c]">See how ProStep2Market solves specific trading problems.</p>
          <div className="mx-auto max-w-3xl space-y-3">
            {problems.map((p) => (
              <Link key={p.problem} href={p.href} className="flex items-center gap-4 rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-4 transition-colors hover:border-[#3a3a5c]">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{p.problem}</p>
                  <p className="text-xs text-[#fcd535]">{p.solution}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#848e9c]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Not Sure Which Solution?</h2>
          <p className="mb-8 text-[#848e9c]">Take our 2-minute assessment and we&apos;ll recommend the right plan.</p>
          <Link href="/solutions/comparison" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Compare Solutions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
