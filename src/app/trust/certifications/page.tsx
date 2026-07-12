import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Award, Shield, FileCheck, CheckCircle2, Clock, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "Certifications — ProStep2Market Trust Center",
  description: "ProStep2Market industry certifications and attestations for security and compliance.",
}

const certs = [
  { name: "SOC 2 Type II", issuer: "A-LIGN", status: "Current", expiry: "Dec 2026", desc: "Validates our controls for security, availability, processing integrity, confidentiality, and privacy." },
  { name: "GDPR Compliance", issuer: "EU Regulatory", status: "Current", desc: "Full compliance with EU General Data Protection Regulation requirements." },
  { name: "CCPA Compliance", issuer: "California Regulatory", status: "Current", desc: "Compliant with California Consumer Privacy Act requirements." },
  { name: "ISO 27001", issuer: "Audit Pending", status: "In Progress", desc: "Working towards ISO 27001 certification. Expected completion Q4 2026.", progress: 65 },
  { name: "Penetration Testing", issuer: "CrowdStrike", status: "Annual", desc: "Annual third-party penetration testing. Latest report available on request." },
  { name: "Vulnerability Scanning", issuer: "Internal + HackerOne", status: "Continuous", desc: "Continuous automated vulnerability scanning with responsible disclosure program." },
]

export default function CertificationsPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mb-2 text-sm text-[#fcd535] font-medium">Trust Center / Certifications</div>
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Certifications</h1>
          <p className="text-[#848e9c]">Industry certifications and attestations that validate our security posture.</p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certs.map((c) => (
              <div key={c.name} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-colors hover:border-[#3a3a5c]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                    <Award className="h-5 w-5 text-[#fcd535]" />
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    c.status === "Current" ? "bg-[rgba(16,185,129,0.15)] text-[#10b981]" :
                    c.status === "Annual" ? "bg-[rgba(59,130,246,0.15)] text-[#3b82f6]" :
                    c.status === "Continuous" ? "bg-[rgba(139,92,246,0.15)] text-[#8b5cf6]" :
                    "bg-[rgba(252,213,53,0.15)] text-[#fcd535]"
                  }`}>{c.status}</span>
                </div>
                <h3 className="mb-1 text-base font-semibold text-white">{c.name}</h3>
                <p className="mb-2 text-xs text-[#848e9c]">Issued by: {c.issuer}</p>
                <p className="mb-3 text-sm text-[#848e9c]">{c.desc}</p>
                {c.expiry && <p className="text-xs text-[#848e9c]">Valid until: {c.expiry}</p>}
                {c.progress && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-[#848e9c] mb-1">
                      <span>Progress</span>
                      <span>{c.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#2b3139]">
                      <div className="h-1.5 rounded-full bg-[#fcd535]" style={{ width: `${c.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Verify Our Certifications</h2>
          <p className="mb-8 text-[#848e9c]">Enterprise customers can request copies of our certification reports and audit documentation.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Request Reports <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
