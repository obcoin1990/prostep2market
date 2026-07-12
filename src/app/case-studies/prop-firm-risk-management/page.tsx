import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, TrendingUp, TrendingDown, Shield, Target, CheckCircle2, Quote, Building2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Case Study: Prop Firm Risk Management — ProStep2Market",
  description: "Illustrative example of how behavioral risk monitoring helps prop firms manage trader compliance.",
}

export default function PropFirmRiskPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6">
          <div className="mb-4 text-sm text-[#fcd535] font-medium">Case Study / Prop Firm</div>
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Prop Firm Risk Management with Behavioral Monitoring</h1>
          <p className="text-[#848e9c]">An illustrative example of how real-time behavioral analytics transform risk management for prop trading firms.</p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-10 md:py-16">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: "Automated", label: "Rule Violation Alerts" },
              { value: "Faster", label: "Onboarding" },
              { value: "Real-time", label: "Risk Visibility" },
              { value: "Growing", label: "ROI" },
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
                TopTier Trading managed 50 funded traders across 3 offices. Their risk team manually reviewed 
                trade logs weekly — often catching violations days after they occurred. Traders were exploiting 
                gaps in monitoring, and the firm had suffered two significant drawdown events from unbounded risk-taking.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-bold text-white">The Solution</h2>
              <p className="mb-4 text-[#848e9c] leading-relaxed">
                TopTier deployed ProStep2Market across all 50 traders with firm-wide risk rules. Each trader&apos;s 
                Risk Guardian was pre-configured with firm parameters. The management dashboard provided 
                real-time visibility into every trader&apos;s risk exposure. Automated alerts replaced manual monitoring.
              </p>
              <ul className="space-y-2">
                {[
                  "Firm-wide risk rules with automated enforcement",
                  "Real-time compliance dashboard for risk team",
                  "Automated onboarding with Trader DNA baseline assessment",
                  "Custom alert thresholds per trader based on experience level",
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
                    <TrendingDown className="h-4 w-4 text-[#ef4444]" />
                    <span className="text-xs font-medium text-[#ef4444]">Before</span>
                  </div>
                  <p className="mt-2 text-sm text-[#848e9c]">Manual monitoring | 2-5 day detection lag | 2 major drawdown events/yr | Reactive risk management</p>
                </div>
                <div className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-5">
                  <div className="mb-1 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#10b981]" />
                    <span className="text-xs font-medium text-[#10b981]">After</span>
                  </div>
                  <p className="mt-2 text-sm text-[#848e9c]">Real-time monitoring | Instant violation alerts | 0 drawdown events | Proactive risk management</p>
                </div>
              </div>
            </div>

            <div className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 md:p-8">
              <Quote className="mb-4 h-8 w-8 text-[#fcd535]" />
              <p className="mb-4 text-lg leading-relaxed text-white italic">
                &ldquo;Before ProStep2Market, we were flying blind between weekly risk reviews. Now we see 
                every trader&apos;s risk exposure in real time. The system caught a trader exceeding 
                position limits within seconds — something that would have taken us days to discover manually. 
                The ROI in prevented losses alone paid for the platform 12x over in the first year.&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-white">Sarah M.</p>
                <p className="text-xs text-[#848e9c]">Head of Risk, TopTier Trading</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-12 md:py-20">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Protect Your Firm</h2>
          <p className="mb-8 text-[#848e9c]">Schedule a demo to see how ProStep2Market can transform your risk management.</p>
          <Link href="/demo-request" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Schedule Demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
