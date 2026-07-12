import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, TrendingUp, Shield, Target, CheckCircle2, Quote, Award, Clock, Building2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Case Study: Enterprise Compliance — ProStep2Market",
  description: "Illustrative example of how enterprise trading desks achieve SOC 2 compliance with ProStep2Market.",
}

export default function EnterpriseCompliancePage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6">
          <div className="mb-4 text-sm text-[#fcd535] font-medium">Case Study / Enterprise</div>
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Enterprise Compliance with ProStep2Market</h1>
          <p className="text-[#848e9c]">An illustrative example of how enterprise trading desks achieve SOC 2 compliance and unified oversight.</p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-10 md:py-16">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: "SOC 2", label: "Compliance Ready" },
              { value: "Full", label: "Compliance Coverage" },
              { value: "Automated", label: "Audit Prep" },
              { value: "Unified", label: "Trading Oversight" },
            ].map((m) => (
              <div key={m.label} className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-4 text-center">
                <div className="text-xl font-bold text-[#fcd535] md:text-2xl">{m.value}</div>
                <div className="mt-1 text-xs text-[#848e9c]">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-10 md:py-16">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6">
          <div className="space-y-10">
            <div>
              <h2 className="mb-3 text-xl font-bold text-white">The Problem</h2>
              <p className="text-[#848e9c] leading-relaxed">
                Meridian Capital operated 3 separate trading desks (equities, forex, crypto) with different 
                risk systems, compliance workflows, and reporting tools. Preparing for SOC 2 Type II audit 
                required unified visibility into all trading activity — something their fragmented toolchain 
                couldn&apos;t provide.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-bold text-white">The Solution</h2>
              <p className="mb-4 text-[#848e9c] leading-relaxed">
                Meridian deployed ProStep2Market Enterprise across all 3 desks with SSO integration, 
                custom risk rules, and automated compliance reporting. The platform became their single 
                source of truth for trader activity, risk monitoring, and audit trails.
              </p>
              <ul className="space-y-2">
                {[
                  "Unified compliance dashboard across all 3 trading desks",
                  "SOC 2 compliant audit trails with SIEM integration",
                  "SSO/SAML integration with existing identity provider",
                  "Custom risk rules per desk with firm-wide override capability",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#848e9c]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10b981]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-bold text-white">The Results</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-5">
                  <div className="mb-1 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#ef4444]" />
                    <span className="text-xs font-medium text-[#ef4444]">Before</span>
                  </div>
                  <p className="mt-2 text-sm text-[#848e9c]">3 separate systems | Manual compliance reporting | 6-month audit prep | Fragmented visibility</p>
                </div>
                <div className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-5">
                  <div className="mb-1 flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#10b981]" />
                    <span className="text-xs font-medium text-[#10b981]">After</span>
                  </div>
                  <p className="mt-2 text-sm text-[#848e9c]">Single unified platform | Automated compliance reports | 4-month SOC 2 timeline | 100% visibility</p>
                </div>
              </div>
            </div>

            <div className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 md:p-8">
              <Quote className="mb-4 h-8 w-8 text-[#fcd535]" />
              <p className="mb-4 text-lg leading-relaxed text-white italic">
                &ldquo;We were dreading the SOC 2 audit. Our compliance stack was held together with spreadsheets 
                and email threads. ProStep2Market gave us a single pane of glass for every trade, every 
                risk event, every compliance flag across all our desks. We passed the audit with zero 
                findings and cut our audit preparation time by 60%.&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-white">David L.</p>
                <p className="text-xs text-[#848e9c]">CTO, Meridian Capital</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-12 md:py-20">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready for Enterprise-Grade Compliance?</h2>
          <p className="mb-8 text-[#848e9c]">Talk to our enterprise team about your compliance requirements.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Contact Enterprise Sales <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
