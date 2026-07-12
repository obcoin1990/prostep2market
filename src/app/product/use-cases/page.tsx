import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, User, Building2, GraduationCap, Briefcase, TrendingUp, Shield, BarChart3, Users, Target, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Use Cases — ProStep2Market",
  description: "See how different traders use ProStep2Market. From retail traders to prop firms, find the right solution for your needs.",
  openGraph: { title: "ProStep2Market Use Cases", description: "Trading solutions for every segment." },
}

const useCases = [
  {
    icon: User,
    title: "Retail Traders",
    subtitle: "Individual traders looking to improve consistency",
    color: "#3b82f6",
    painPoints: ["Emotional trading and revenge trading", "Inconsistent strategy execution", "No structured feedback loop", "Difficulty tracking patterns"],
    solutions: ["AI-powered trade journal with sentiment analysis", "Trader DNA profiling to identify blind spots", "Risk Guardian to prevent overtrading", "Edge Score to track consistency gains"],
    results: ["Track consistency improvements over time", "AI-powered emotional trading detection", "Structured feedback on every trade"],
    cta: "Start as Individual",
    href: "/signup",
  },
  {
    icon: Building2,
    title: "Prop Trading Firms",
    subtitle: "Firms managing multiple traders and risk exposure",
    color: "#10b981",
    painPoints: ["No standardized trader evaluation", "Hard to detect risky behavior early", "Manual compliance monitoring", "Trader onboarding is inefficient"],
    solutions: ["Unified dashboard for all trader performance", "Risk Guardian with firm-wide configurable rules", "Automated compliance alerts and reporting", "Structured education and certification paths"],
    results: ["Faster onboarding with Trader DNA assessment", "Automated compliance alerts and reporting", "Real-time risk visibility across all traders"],
    cta: "Explore Enterprise",
    href: "/solutions/enterprise",
  },
  {
    icon: GraduationCap,
    title: "Trading Coaches & Educators",
    subtitle: "Coaches training the next generation of traders",
    color: "#8b5cf6",
    painPoints: ["No objective way to measure student progress", "Manual review of student journals", "Difficult to scale personalized coaching", "Students lack self-awareness tools"],
    solutions: ["View student Trader DNA profiles and progress", "AI analysis highlights student improvement areas", "White-label education platform integration", "Group leaderboards for healthy competition"],
    results: ["Scale coaching with data-driven insights", "Data-driven student evaluations", "Higher student engagement and retention"],
    cta: "Learn About Coaching",
    href: "/solutions/trading-coaches",
  },
  {
    icon: Briefcase,
    title: "Brokerages & Trading Platforms",
    subtitle: "Brokers adding value-added services for clients",
    color: "#f59e0b",
    painPoints: ["High client churn due to poor trading results", "No differentiated educational offering", "Limited insights into client trading behavior", "Compliance and reporting overhead"],
    solutions: ["Integrated behavioral analytics for clients", "White-label platform with custom branding", "API access for seamless integration", "Automated compliance and risk reporting"],
    results: ["Reduced client churn with behavioral analytics", "Increased platform stickiness", "New revenue stream from value-added services"],
    cta: "Partner With Us",
    href: "/solutions/brokerages",
  },
  {
    icon: TrendingUp,
    title: "Enterprise & Institutions",
    subtitle: "Large organizations requiring compliance and scale",
    color: "#ef4444",
    painPoints: ["SOC 2 / ISO compliance requirements", "Need for SSO and role-based access", "Custom reporting and analytics needs", "Multi-team management complexity"],
    solutions: ["SOC 2 compliant infrastructure", "SSO integration with major providers", "Custom API and webhook support", "Dedicated account management and SLA"],
    results: ["Enterprise-grade security and compliance", "Seamless integration with existing stack", "Dedicated support and priority access"],
    cta: "Contact Sales",
    href: "/solutions/enterprise",
  },
]

const testimonials = [
  { quote: "ProStep2Market helped me identify a recurring overtrading pattern I never noticed. My win rate improved 12% in the first month.", author: "Marcus T.", role: "Retail Forex Trader" },
  { quote: "The Edge Score gave our team a objective way to evaluate strategy performance. We replaced three separate tools with one platform.", author: "Sarah L.", role: "Prop Firm Risk Manager" },
  { quote: "My coaching clients love seeing their Trader DNA profiles. It makes our feedback sessions data-driven instead of subjective.", author: "James K.", role: "Trading Coach" },
]

export default function UseCasesPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Built for{" "}
            <span className="text-[#fcd535]">Every Trader</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Whether you&apos;re an individual trader, a prop firm, a trading coach, or a brokerage — 
            ProStep2Market adapts to your needs.
          </p>
        </div>
      </section>

      {/* Use Cases */}
      {useCases.map((uc, i) => (
        <section key={uc.title} className={`border-t border-[#2b3139] py-20 ${i % 2 === 1 ? "bg-[#0d1015]" : ""}`}>
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[10px]" style={{ backgroundColor: `${uc.color}1A` }}>
                <uc.icon className="h-6 w-6" style={{ color: uc.color }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{uc.title}</h2>
                <p className="text-sm text-[#848e9c]">{uc.subtitle}</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#f6465d]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f6465d]" />
                  Pain Points
                </h3>
                <ul className="space-y-2">
                  {uc.painPoints.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-[#848e9c]">
                      <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-[#f6465d]" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#fcd535]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#fcd535]" />
                  Our Solution
                </h3>
                <ul className="space-y-2">
                  {uc.solutions.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-[#848e9c]">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#fcd535]" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#10b981]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                  Results
                </h3>
                <ul className="space-y-2">
                  {uc.results.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm text-[#848e9c]">
                      <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#10b981]" />
                      {r}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href={uc.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#fcd535] transition-colors hover:text-[#f0b90b]">
                    {uc.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Testimonials */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Trusted by Traders Everywhere</h2>
          <p className="mb-16 text-center text-[#848e9c]">Hear from the traders and organizations using ProStep2Market.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.author} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6">
                <p className="mb-4 text-sm leading-relaxed text-[#eaecef]">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-white">{t.author}</p>
                  <p className="text-xs text-[#848e9c]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Find Your Solution</h2>
          <p className="mb-8 text-[#848e9c]">Not sure which solution fits? Contact us for a personalized consultation.</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
