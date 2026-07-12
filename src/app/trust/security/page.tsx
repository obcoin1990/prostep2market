import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Shield, Lock, Server, Users, Eye, Key, Wifi, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Security — ProStep2Market Trust Center",
  description: "ProStep2Market enterprise security: encryption, access control, network security, and infrastructure protection.",
}

const items = [
  { icon: Lock, title: "Encryption", desc: "All data encrypted at rest using AES-256 and in transit using TLS 1.3. Database encryption keys managed through AWS KMS." },
  { icon: Key, title: "Access Control", desc: "Role-based access control (RBAC) with granular permissions. Multi-factor authentication (MFA) available for all accounts." },
  { icon: Server, title: "Infrastructure Security", desc: "Hosted on AWS and GCP with enterprise-grade security groups, VPC isolation, and regular vulnerability scanning." },
  { icon: Users, title: "Identity Management", desc: "SSO support via SAML 2.0 and OIDC. Integrates with Okta, Azure AD, Google Workspace, and any SAML provider." },
  { icon: Eye, title: "Monitoring & Logging", desc: "24/7 security monitoring with SIEM integration. Comprehensive audit logs for all platform activity." },
  { icon: Wifi, title: "Network Security", desc: "IP whitelisting available for enterprise clients. Web application firewall (WAF) protecting all endpoints." },
  { icon: Shield, title: "Read-Only Architecture", desc: "ProStep2Market connects to brokers with read-only API keys. We never have the ability to withdraw or place trades." },
  { icon: CheckCircle2, title: "Third-Party Audits", desc: "Regular penetration testing and security assessments by independent third-party firms." },
]

export default function SecurityPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mb-2 text-sm text-[#fcd535] font-medium">Trust Center / Security</div>
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Security</h1>
          <p className="text-[#848e9c]">Enterprise-grade security protecting your trading data at every layer.</p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.title} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-colors hover:border-[#3a3a5c]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                  <item.icon className="h-5 w-5 text-[#fcd535]" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#848e9c]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "AES-256", label: "Encryption Standard" },
              { value: "TLS 1.3", label: "Transport Security" },
              { value: "99.9%", label: "Uptime SLA" },
              { value: "24/7", label: "Security Monitoring" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-3xl font-bold text-[#fcd535] md:text-4xl">{m.value}</div>
                <div className="mt-2 text-sm text-[#848e9c]">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Security Questions?</h2>
          <p className="mb-8 text-[#848e9c]">Contact our security team for detailed documentation, SOC 2 reports, or vulnerability disclosures.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Contact Security <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
