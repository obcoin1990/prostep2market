import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Shield, Lock, FileCheck, Eye, Award, Server, CheckCircle2, RefreshCw } from "lucide-react"

export const metadata: Metadata = {
  title: "Trust Center — ProStep2Market",
  description: "ProStep2Market Trust Center: security, compliance, data protection, and privacy information for enterprise customers.",
  openGraph: { title: "ProStep2Market Trust Center", description: "Your data security is our highest priority." },
}

const sections = [
  { icon: Shield, title: "Security", desc: "Enterprise-grade security infrastructure including encryption, access controls, and network security.", href: "/trust/security", color: "#3b82f6" },
  { icon: FileCheck, title: "Compliance", desc: "SOC 2 Type II compliant. Regular third-party audits and industry-standard compliance frameworks.", href: "/trust/compliance", color: "#10b981" },
  { icon: Lock, title: "Data Protection", desc: "How we protect your trading data with encryption, access controls, and data isolation.", href: "/trust/data-protection", color: "#8b5cf6" },
  { icon: Eye, title: "Privacy", desc: "Our commitment to your privacy. How we collect, use, and protect your personal information.", href: "/trust/privacy", color: "#f59e0b" },
  { icon: Award, title: "Certifications", desc: "Industry certifications and attestations that validate our security and compliance posture.", href: "/trust/certifications", color: "#ef4444" },
]

const highlights = [
  { icon: Lock, label: "Data Encryption", value: "AES-256 at rest" },
  { icon: Shield, label: "Compliance", value: "SOC 2 Type II" },
  { icon: RefreshCw, label: "Uptime SLA", value: "99.9%" },
  { icon: Server, label: "Infrastructure", value: "AWS/GCP" },
]

export default function TrustPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            <span className="text-[#fcd535]">Trust</span> Center
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Security and trust are built into every layer of ProStep2Market. We protect your data 
            with enterprise-grade infrastructure, compliance, and privacy practices.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-t border-[#2b3139] py-16">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {highlights.map((h) => (
              <div key={h.label} className="text-center">
                <div className="mb-2 flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                    <h.icon className="h-5 w-5 text-[#fcd535]" />
                  </div>
                </div>
                <div className="text-sm font-semibold text-white">{h.value}</div>
                <div className="text-xs text-[#848e9c]">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => (
              <Link key={s.title} href={s.href} className="group rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-all hover:border-[#3a3a5c] hover:-translate-y-0.5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px]" style={{ backgroundColor: `${s.color}1A` }}>
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white group-hover:text-[#fcd535] transition-colors">{s.title}</h3>
                <p className="text-sm leading-relaxed text-[#848e9c]">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Need More Information?</h2>
          <p className="mb-8 text-[#848e9c]">Our security team can provide detailed documentation and answer your questions.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Contact Security Team <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
