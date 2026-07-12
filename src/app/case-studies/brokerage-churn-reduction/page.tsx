import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, TrendingUp, Users, Target, CheckCircle2, Quote, BarChart3, DollarSign } from "lucide-react"

export const metadata: Metadata = {
  title: "Case Study: Brokerage Client Retention — ProStep2Market",
  description: "Illustrative example of how behavioral analytics help brokerages reduce client churn.",
}

export default function BrokerageChurnPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6">
          <div className="mb-4 text-sm text-[#fcd535] font-medium">Case Study / Brokerage</div>
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Brokerage Client Retention with Behavioral Analytics</h1>
          <p className="text-[#848e9c]">An illustrative example of how behavioral analytics help brokerages retain clients and improve engagement.</p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-10 md:py-16">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: "Reduced", label: "Client Churn" },
              { value: "Growing", label: "Retained Revenue" },
              { value: "Higher", label: "Client Engagement" },
              { value: "Early Access", label: "Client Satisfaction" },
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
                ForexPrime had 50,000 active clients but was losing 18% annually to churn. 
                Research showed most clients left within 6 months — the period when poor trading results 
                and lack of progress led to frustration. The brokerage needed a way to keep clients engaged 
                and improving.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-bold text-white">The Solution</h2>
              <p className="mb-4 text-[#848e9c] leading-relaxed">
                ForexPrime integrated ProStep2Market as a white-label value-added service. Every new client 
                received free access to the platform for 3 months. The brokerage used aggregated, anonymized 
                data to identify at-risk clients before they churned.
              </p>
              <ul className="space-y-2">
                {[
                  "White-label ProStep2Market with ForexPrime branding",
                  "3-month free trial for all new clients",
                  "Automated intervention triggers for at-risk traders",
                  "Client success stories and progress sharing features",
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
                    <TrendingUp className="h-4 w-4 text-[#ef4444]" />
                    <span className="text-xs font-medium text-[#ef4444]">Before</span>
                  </div>
                  <p className="mt-2 text-sm text-[#848e9c]">18% annual churn | $9K avg client LTV | No engagement insights | Reactive retention</p>
                </div>
                <div className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-5">
                  <div className="mb-1 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#10b981]" />
                    <span className="text-xs font-medium text-[#10b981]">After</span>
                  </div>
                  <p className="mt-2 text-sm text-[#848e9c]">12% annual churn | $14K avg client LTV | Predictive churn alerts | Proactive retention</p>
                </div>
              </div>
            </div>

            <div className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 md:p-8">
              <Quote className="mb-4 h-8 w-8 text-[#fcd535]" />
              <p className="mb-4 text-lg leading-relaxed text-white italic">
                &ldquo;We tried everything to reduce churn — better education, more market research, lower spreads. 
                Nothing moved the needle like ProStep2Market. When clients see their Edge Score improving 
                month over month, they stay. They&apos;re invested in their own progress. The $2.1M in retained 
                revenue speaks for itself.&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-white">Michael T.</p>
                <p className="text-xs text-[#848e9c]">VP of Client Success, ForexPrime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-12 md:py-20">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Reduce Churn at Your Brokerage</h2>
          <p className="mb-8 text-[#848e9c]">Contact our partnerships team to discuss white-label integration.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Contact Partnerships <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
