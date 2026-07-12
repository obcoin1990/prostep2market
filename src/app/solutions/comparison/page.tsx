import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Minus, Building2, User, GraduationCap, Briefcase, TrendingUp, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Comparison — ProStep2Market Solutions",
  description: "Compare ProStep2Market solutions for retail traders, prop firms, trading coaches, brokerages, and enterprise.",
  openGraph: { title: "ProStep2Market Comparison", description: "Find the right solution for your needs." },
}

const segments = [
  { name: "Retail Traders", icon: User, href: "/solutions/retail-traders", color: "#3b82f6" },
  { name: "Prop Firms", icon: Building2, href: "/solutions/prop-firms", color: "#10b981" },
  { name: "Trading Coaches", icon: GraduationCap, href: "/solutions/trading-coaches", color: "#8b5cf6" },
  { name: "Brokerages", icon: Briefcase, href: "/solutions/brokerages", color: "#f59e0b" },
  { name: "Enterprise", icon: Shield, href: "/solutions/enterprise", color: "#ef4444" },
]

const comparisons = [
  { feature: "Trade Journal", retail: true, prop: true, coach: true, brokerage: true, enterprise: true },
  { feature: "Trader DNA Assessment", retail: true, prop: true, coach: true, brokerage: true, enterprise: true },
  { feature: "AI Trade Analysis", retail: true, prop: true, coach: true, brokerage: true, enterprise: true },
  { feature: "Edge Score", retail: true, prop: true, coach: true, brokerage: true, enterprise: true },
  { feature: "Risk Guardian", retail: true, prop: true, coach: true, brokerage: true, enterprise: true },
  { feature: "Strategy Lab", retail: true, prop: "add-on", coach: "add-on", brokerage: false, enterprise: "add-on" },
  { feature: "Education Platform", retail: true, prop: true, coach: true, brokerage: true, enterprise: true },
  { feature: "Multi-Account View", retail: "elite", prop: true, coach: true, brokerage: true, enterprise: true },
  { feature: "Team Management", retail: false, prop: true, coach: true, brokerage: true, enterprise: true },
  { feature: "Firm-Wide Risk Rules", retail: false, prop: true, coach: false, brokerage: false, enterprise: true },
  { feature: "Compliance Reports", retail: false, prop: true, coach: false, brokerage: true, enterprise: true },
  { feature: "White-Label", retail: false, prop: "enterprise", coach: false, brokerage: true, enterprise: true },
  { feature: "SSO / SAML", retail: false, prop: "enterprise", coach: false, brokerage: "enterprise", enterprise: true },
  { feature: "Dedicated Support", retail: "elite", prop: true, coach: true, brokerage: true, enterprise: true },
  { feature: "Custom SLA", retail: false, prop: "enterprise", coach: false, brokerage: "enterprise", enterprise: true },
  { feature: "API Access", retail: true, prop: true, coach: true, brokerage: true, enterprise: true },
]

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <CheckCircle2 className="h-5 w-5 text-[#10b981]" />
  if (value === false) return <Minus className="h-5 w-5 text-[#2b3139]" />
  return <span className="text-xs font-medium capitalize" style={{ color: '#fcd535' }}>{value}</span>
}

export default function ComparisonPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Compare{" "}
            <span className="text-[#fcd535]">Solutions</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Not sure which solution fits? Compare features across all segments to find the right fit.
          </p>
        </div>
      </section>

      {/* Segment Quick Links */}
      <section className="border-t border-[#2b3139] py-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {segments.map((s) => (
              <Link key={s.name} href={s.href} className="inline-flex items-center gap-2 rounded-full border border-[#2b3139] bg-[#1e2329] px-4 py-2 text-sm font-medium text-[#eaecef] transition-colors hover:border-[#3a3a5c]">
                <s.icon className="h-4 w-4" style={{ color: s.color }} />
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2b3139]">
                  <th className="p-4 text-left text-sm font-semibold text-[#848e9c]">Feature</th>
                  {segments.map((s) => (
                    <th key={s.name} className="p-4 text-center text-sm font-semibold">
                      <div className="flex flex-col items-center gap-1">
                        <s.icon className="h-4 w-4" style={{ color: s.color }} />
                        <span style={{ color: s.color }}>{s.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-[#2b3139] ${i % 2 === 0 ? "bg-[#1e2329]" : "bg-transparent"}`}>
                    <td className="p-4 text-sm text-[#eaecef]">{row.feature}</td>
                    <td className="p-4 text-center"><Cell value={row.retail} /></td>
                    <td className="p-4 text-center"><Cell value={row.prop} /></td>
                    <td className="p-4 text-center"><Cell value={row.coach} /></td>
                    <td className="p-4 text-center"><Cell value={row.brokerage} /></td>
                    <td className="p-4 text-center"><Cell value={row.enterprise} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Still Have Questions?</h2>
          <p className="mb-8 text-[#848e9c]">Contact our team and we&apos;ll help you find the right solution.</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Talk to Sales <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
