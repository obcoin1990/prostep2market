import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, FileCheck, Shield, ClipboardCheck, Building2, Globe, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Compliance — ProStep2Market Trust Center",
  description: "ProStep2Market compliance: SOC 2 Type II, GDPR, data residency, and regulatory frameworks.",
}

const frameworks = [
  { name: "SOC 2 Type II", status: "Certified", desc: "Annual third-party audits validate our controls for security, availability, processing integrity, confidentiality, and privacy.", icon: Shield },
  { name: "GDPR", status: "Compliant", desc: "Full compliance with EU General Data Protection Regulation. Data processing agreements available for EU customers.", icon: Globe },
  { name: "CCPA", status: "Compliant", desc: "Compliant with California Consumer Privacy Act. California residents can exercise their data rights.", icon: FileCheck },
  { name: "ISO 27001", status: "In Progress", desc: "Working towards ISO 27001 certification with expected completion in Q4 2026.", icon: ClipboardCheck },
]

export default function CompliancePage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mb-2 text-sm text-[#fcd535] font-medium">Trust Center / Compliance</div>
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Compliance</h1>
          <p className="text-[#848e9c]">Industry-standard compliance frameworks protecting your organization.</p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {frameworks.map((f) => (
              <div key={f.name} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-colors hover:border-[#3a3a5c]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                    <f.icon className="h-5 w-5 text-[#fcd535]" />
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    f.status === "Certified" ? "bg-[rgba(16,185,129,0.15)] text-[#10b981]" :
                    f.status === "Compliant" ? "bg-[rgba(59,130,246,0.15)] text-[#3b82f6]" :
                    "bg-[rgba(252,213,53,0.15)] text-[#fcd535]"
                  }`}>{f.status}</span>
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{f.name}</h3>
                <p className="text-sm leading-relaxed text-[#848e9c]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Need Compliance Documentation?</h2>
          <p className="mb-8 text-[#848e9c]">Enterprise customers can request our SOC 2 report, DPA, and other compliance documentation.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Request Documents <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
