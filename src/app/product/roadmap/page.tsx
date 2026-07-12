import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Lightbulb, FlaskConical, CheckCircle2, Clock, ThumbsUp, MessageSquare, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Roadmap — ProStep2Market",
  description: "See what's coming next to ProStep2Market. Vote on features, track our progress, and help shape the future of trader development.",
  openGraph: { title: "ProStep2Market Roadmap", description: "See what we're building next." },
}

const roadmapItems = [
  {
    status: "shipped",
    icon: CheckCircle2,
    color: "#10b981",
    quarter: "Q2 2026",
    items: [
      { title: "Trader DNA v2.0", desc: "Expanded behavioral assessment from 12 to 16 dimensions with improved accuracy and personalized recommendations." },
      { title: "AI Trade Analysis GPT-4o", desc: "Upgraded AI engine with GPT-4o for deeper, more contextual trade analysis and coaching insights." },
      { title: "Multi-Account Aggregation", desc: "Connect multiple broker accounts for a unified view of your trading performance." },
      { title: "Risk Guardian Circuit Breakers", desc: "Automated trading pause when configurable risk parameters are breached." },
    ],
  },
  {
    status: "building",
    icon: FlaskConical,
    color: "#fcd535",
    quarter: "Q3 2026",
    items: [
      { title: "Strategy Lab v2.0", desc: "Visual strategy builder with drag-and-drop interface, improved backtesting engine, and portfolio simulation." },
      { title: "Mobile App (iOS + Android)", desc: "Native mobile apps with full journaling, risk monitoring, and performance tracking capabilities." },
      { title: "Social Trading Features", desc: "Follow top traders, copy strategies, and participate in community challenges." },
      { title: "Advanced Analytics Suite", desc: "New metrics dashboard with custom report builder, cohort analysis, and predictive insights." },
    ],
  },
  {
    status: "planned",
    icon: Lightbulb,
    color: "#3b82f6",
    quarter: "Q4 2026",
    items: [
      { title: "Prop Firm Challenge Mode", desc: "Integrated challenge tracking for prop firm evaluations with real-time progress monitoring." },
      { title: "API Platform v1.0", desc: "Public REST API with webhooks for custom integrations, data export, and automated workflows." },
      { title: "White-Label Platform", desc: "Full white-label solution for brokerages, prop firms, and trading academies." },
      { title: "Advanced Risk Analytics", desc: "Portfolio-level VaR calculations, stress testing, and correlation analysis." },
    ],
  },
  {
    status: "future",
    icon: Clock,
    color: "#848e9c",
    quarter: "2027 & Beyond",
    items: [
      { title: "AI Trading Assistant", desc: "Conversational AI coach that provides real-time guidance during trading sessions." },
      { title: "Institutional-Grade Compliance", desc: "FINRA/MiFID II compliance tools for regulated trading operations." },
      { title: "Decentralized Identity", desc: "Self-sovereign identity for traders with verifiable credentials and achievements." },
      { title: "Cross-Market Analytics", desc: "Multi-asset class support including crypto, forex, futures, and equities." },
    ],
  },
]

const topRequests = [
  "Mobile app with push notifications for risk alerts",
  "TradingView chart integration",
  "Automated trade execution based on strategy rules",
  "Social feed with trade sharing and discussion",
  "API access for custom tool building",
]

export default function RoadmapPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2b3139] bg-[#1e2329] px-4 py-1.5 text-xs font-medium text-[#848e9c]">
            <FlaskConical className="h-3.5 w-3.5 text-[#fcd535]" />
            Public Roadmap — Updated Monthly
          </div>
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Our{" "}
            <span className="text-[#fcd535]">Building Plan</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            We believe in building in public. See what we&apos;re working on, what&apos;s coming next, 
            and vote on what we should build after that.
          </p>
          <Link href="#vote" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Request a Feature <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="relative">
            {roadmapItems.map((phase) => (
              <div key={phase.quarter} className="relative mb-12 last:mb-0">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${phase.color}1A` }}>
                    <phase.icon className="h-5 w-5" style={{ color: phase.color }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{phase.quarter}</h2>
                    <span className="text-xs font-medium uppercase tracking-wider" style={{ color: phase.color }}>{phase.status}</span>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {phase.items.map((item) => (
                    <div key={item.title} className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-5 transition-colors hover:border-[#3a3a5c]">
                      <h3 className="mb-1 text-sm font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-[#848e9c]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Feature Requests */}
      <section id="vote" className="border-t border-[#2b3139] py-20 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mb-12 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[rgba(252,213,53,0.12)]">
              <ThumbsUp className="h-6 w-6 text-[#fcd535]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Top Feature Requests</h2>
              <p className="text-sm text-[#848e9c]">Vote on what we should build next</p>
            </div>
          </div>
          <div className="space-y-3">
            {topRequests.map((req, i) => (
              <div key={req} className="flex items-center gap-4 rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-4 transition-colors hover:border-[#3a3a5c]">
                <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[rgba(252,213,53,0.1)] text-sm font-bold text-[#fcd535]">
                  {i + 1}
                </div>
                <p className="flex-1 text-sm text-[#eaecef]">{req}</p>
                <button className="flex items-center gap-1.5 rounded-[6px] border border-[#2b3139] px-3 py-1.5 text-xs font-medium text-[#848e9c] transition-colors hover:border-[#fcd535] hover:text-[#fcd535]">
                  <ThumbsUp className="h-3 w-3" />
                  Vote
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="mb-4 text-sm text-[#848e9c]">Have an idea that&apos;s not on the list?</p>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              <MessageSquare className="h-4 w-4" />
              Submit Feature Request
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Start Your Journey Today</h2>
          <p className="mb-8 text-[#848e9c]">Don&apos;t wait for the future. Build your trading consistency now.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
