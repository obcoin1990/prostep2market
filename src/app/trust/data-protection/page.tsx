import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Lock, Database, Shield, Server, RefreshCw, Trash2, Download, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Data Protection — ProStep2Market Trust Center",
  description: "How ProStep2Market protects your trading data with encryption, access controls, backups, and data isolation.",
}

const items = [
  { icon: Lock, title: "Encryption at Rest & In Transit", desc: "All data encrypted with AES-256 at rest. TLS 1.3 for all data in transit. Database encryption keys managed through enterprise-grade KMS." },
  { icon: Database, title: "Data Isolation", desc: "Multi-tenant architecture with strict logical data isolation. Your trading data is never commingled with other users." },
  { icon: RefreshCw, title: "Automated Backups", desc: "Continuous database backups with point-in-time recovery. Geographic redundancy across multiple AWS availability zones." },
  { icon: Shield, title: "Access Controls", desc: "Strict internal access controls. Employee access requires approval and is logged. No access to production data without explicit authorization." },
  { icon: Trash2, title: "Data Deletion", desc: "Full account deletion available upon request. All data permanently deleted within 30 days. No residual copies retained." },
  { icon: Download, title: "Data Portability", desc: "Export your complete trading data, journal entries, and profiles at any time. Standard formats: CSV, JSON, PDF." },
]

export default function DataProtectionPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mb-2 text-sm text-[#fcd535] font-medium">Trust Center / Data Protection</div>
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Data Protection</h1>
          <p className="text-[#848e9c]">How we protect, store, and manage your trading data.</p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Your Data Rights</h2>
          <p className="mb-12 text-center text-[#848e9c]">We believe you should always own and control your data.</p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Right to Access", desc: "Request a copy of all data we hold about you at any time." },
              { title: "Right to Deletion", desc: "Request permanent deletion of your account and all associated data." },
              { title: "Right to Portability", desc: "Export your data in machine-readable formats for use elsewhere." },
            ].map((r) => (
              <div key={r.title} className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-5">
                <CheckCircle2 className="mb-2 h-5 w-5 text-[#10b981]" />
                <h3 className="mb-1 text-sm font-semibold text-white">{r.title}</h3>
                <p className="text-sm text-[#848e9c]">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Questions About Data Protection?</h2>
          <p className="mb-8 text-[#848e9c]">Our data protection team is available to answer your questions.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Contact DPO <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
