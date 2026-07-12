import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Shield, Lock, Users, Server, Globe, Sliders, CheckCircle2, Headphones, Zap, Layers, Building2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Enterprise — ProStep2Market Solutions",
  description: "Enterprise-grade trading analytics platform with SOC 2 compliance, SSO, white-label, and dedicated support.",
  openGraph: { title: "ProStep2Market Enterprise", description: "Enterprise trading platform with full compliance." },
}

const features = [
  { icon: Shield, title: "SOC 2 Type II Compliant", desc: "Regular third-party audits. Full SOC 2 report available on request." },
  { icon: Lock, title: "Enterprise Security", desc: "SSO/SAML/OIDC, IP whitelisting, role-based access control, and audit logging." },
  { icon: Globe, title: "White-Label Platform", desc: "Full white-label with custom domain, branding, and color scheme." },
  { icon: Users, title: "Team Management", desc: "Create teams, assign roles, set permissions, and manage users from a central dashboard." },
  { icon: Server, title: "Dedicated Infrastructure", desc: "Dedicated database and processing capacity. Guaranteed performance SLAs." },
  { icon: Headphones, title: "Priority Support", desc: "Dedicated account manager, priority ticket routing, and 24/7 emergency support." },
  { icon: Sliders, title: "Custom Integrations", desc: "Custom API integrations, webhook configurations, and data pipeline setup." },
  { icon: Layers, title: "Advanced Reporting", desc: "Custom report builder, scheduled exports, BI tool integration (Tableau/Power BI)." },
]

const plans = [
  { name: "Starter", price: "Custom", desc: "For small firms getting started", features: ["Up to 50 traders", "Core platform features", "Email support", "Basic analytics"] },
  { name: "Professional", price: "Custom", desc: "For growing operations", features: ["Up to 500 traders", "All platform features", "Priority email + chat", "Advanced analytics", "Custom risk rules"] },
  { name: "Enterprise", price: "Custom", desc: "For large institutions", features: ["Unlimited traders", "White-label option", "Dedicated account manager", "SSO/SAML integration", "Custom SLAs", "Dedicated infrastructure"] },
]

export default function EnterprisePage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2b3139] bg-[#1e2329] px-4 py-1.5 text-xs font-medium text-[#848e9c]">
            <Building2 className="h-3.5 w-3.5 text-[#fcd535]" />
            Enterprise-Grade Infrastructure
          </div>
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            For{" "}
            <span className="text-[#fcd535]">Enterprise Teams</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            The full power of ProStep2Market with the security, compliance, and support 
            that large organizations demand.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Contact Sales <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/trust/security" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              Security Overview
            </Link>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Enterprise Features</h2>
          <p className="mb-16 text-center text-[#848e9c]">Everything your organization needs to deploy at scale.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-colors hover:border-[#3a3a5c]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                  <f.icon className="h-5 w-5 text-[#fcd535]" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[#848e9c]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Plans */}
      <section className="border-t border-[#2b3139] py-20 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Enterprise Plans</h2>
          <p className="mb-16 text-center text-[#848e9c]">Custom pricing tailored to your organization&apos;s needs.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6">
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <div className="mt-2 text-3xl font-bold text-[#fcd535]">{p.price}</div>
                <p className="mt-1 text-sm text-[#848e9c]">{p.desc}</p>
                <ul className="mt-6 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#848e9c]">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#10b981]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="mt-6 flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#fcd535] px-4 py-2.5 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
                  Contact Sales <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to Scale?</h2>
          <p className="mb-8 text-[#848e9c]">Talk to our enterprise sales team about your requirements.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Schedule a Call <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
