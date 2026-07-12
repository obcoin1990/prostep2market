import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, TrendingUp, TrendingDown, BarChart3, Award, Users, Quote } from "lucide-react"

export const metadata: Metadata = {
  title: "Case Studies — ProStep2Market",
  description: "See how traders and organizations transform their trading results with ProStep2Market. Real stories, hard metrics, proven results.",
  openGraph: { title: "ProStep2Market Case Studies", description: "Real results from real traders and organizations." },
}

const studies = [
  {
    slug: "retail-trader-consistency",
    title: "Retail Trader Consistency: How Behavioral Tracking Improves Results",
    client: "Illustrative Example — Independent Retail Trader",
    metric: "Behavioral tracking reduces emotional trading",
    metricValue: "Soon",
    icon: TrendingUp,
    color: "#10b981",
    tags: ["Retail Trader", "Behavioral Change", "Consistency"],
  },
  {
    slug: "prop-firm-risk-management",
    title: "Prop Firm Risk Management: Automated Compliance Monitoring",
    client: "Illustrative Example — Prop Trading Firm",
    metric: "Automated alerts reduce rule violations",
    metricValue: "Soon",
    icon: TrendingDown,
    color: "#3b82f6",
    tags: ["Prop Firm", "Risk Management", "Compliance"],
  },
  {
    slug: "trading-coach-scale",
    title: "Trading Coach Scaling: Data-Driven Student Progress Tracking",
    client: "Illustrative Example — Trading Coach",
    metric: "Scale coaching with analytics",
    metricValue: "Soon",
    icon: Users,
    color: "#8b5cf6",
    tags: ["Trading Coach", "Scale", "Education"],
  },
  {
    slug: "brokerage-churn-reduction",
    title: "Brokerage Client Retention: Value-Added Behavioral Analytics",
    client: "Illustrative Example — Brokerage",
    metric: "Reduce churn with behavioral insights",
    metricValue: "Soon",
    icon: BarChart3,
    color: "#f59e0b",
    tags: ["Brokerage", "Retention", "Analytics"],
  },
  {
    slug: "enterprise-compliance",
    title: "Enterprise Compliance: SOC 2 with ProStep2Market",
    client: "Illustrative Example — Institutional Trading Desk",
    metric: "Enterprise-grade compliance",
    metricValue: "Soon",
    icon: Award,
    color: "#ef4444",
    tags: ["Enterprise", "Compliance", "Security"],
  },
]

export default function CaseStudiesPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            <span className="text-[#fcd535]">Case Studies</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Real traders and organizations. Real challenges. Real results measured in hard metrics.
          </p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid gap-8">
            {studies.map((s) => (
              <Link key={s.slug} href={`/case-studies/${s.slug}`} className="group rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 md:p-8 transition-all hover:border-[#3a3a5c] hover:-translate-y-0.5">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[12px]" style={{ backgroundColor: `${s.color}1A` }}>
                    <s.icon className="h-7 w-7" style={{ color: s.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <span key={t} className="rounded-full border border-[#2b3139] px-2.5 py-0.5 text-xs text-[#848e9c]">{t}</span>
                      ))}
                    </div>
                    <h2 className="text-lg font-bold text-white group-hover:text-[#fcd535] transition-colors">{s.title}</h2>
                    <p className="mt-1 text-sm text-[#848e9c]">{s.client}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: s.color }}>{s.metricValue}</div>
                    <div className="text-xs text-[#848e9c]">{s.metric}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Want to Be Our Next Case Study?</h2>
          <p className="mb-8 text-[#848e9c]">Join traders and organizations transforming their results with ProStep2Market.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Start Your Journey <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
