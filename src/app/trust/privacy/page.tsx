import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Eye, Shield, Database, FileText, Globe, RefreshCw, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy — ProStep2Market Trust Center",
  description: "ProStep2Market privacy practices: how we collect, use, and protect your personal information.",
}

const sections = [
  { title: "Information We Collect", items: ["Account information: name, email, and billing details", "Trading data: trade history, broker account information", "Behavioral data: Trader DNA assessment results, journal entries", "Usage data: platform interaction, feature usage, session information"] },
  { title: "How We Use Your Data", items: ["Provide and improve the ProStep2Market platform", "Generate personalized trading insights and analytics", "Send platform updates, security alerts, and support communications", "Aggregate anonymized data for research and product improvement"] },
  { title: "Data Sharing", items: ["We never sell your personal data", "We never share your trading data with third parties", "Anonymized, aggregated data may be used for research", "We comply with lawful requests from regulatory authorities"] },
  { title: "Data Retention", items: ["Active account data retained for the duration of your account", "Deleted accounts: data permanently removed within 30 days", "Anonymized analytics data retained for product improvement", "Legal holds may apply for compliance purposes"] },
]

export default function PrivacyPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mb-2 text-sm text-[#fcd535] font-medium">Trust Center / Privacy</div>
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Privacy</h1>
          <p className="text-[#848e9c]">Our commitment to protecting your personal information and trading data.</p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {sections.map((s) => (
              <div key={s.title} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6">
                <h3 className="mb-4 text-base font-semibold text-white">{s.title}</h3>
                <ul className="space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#848e9c]">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#fcd535]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-12 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6">
            <p className="text-sm text-[#848e9c]">
              For our complete privacy policy, including detailed information about data processing, your rights under GDPR and CCPA, 
              and how to exercise your data rights, please see our full{" "}
              <Link href="/legal/privacy" className="text-[#fcd535] hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Privacy Questions?</h2>
          <p className="mb-8 text-[#848e9c]">Contact our Data Protection Officer for privacy-related inquiries.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Contact DPO <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
