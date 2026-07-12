import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, TrendingUp, Users, Target, CheckCircle2, Quote, GraduationCap, BarChart3 } from "lucide-react"

export const metadata: Metadata = {
  title: "Case Study: Trading Coach Scaling — ProStep2Market",
  description: "Illustrative example of how data-driven insights help trading coaches scale their practice.",
}

export default function TradingCoachScalePage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6">
          <div className="mb-4 text-sm text-[#fcd535] font-medium">Case Study / Trading Coach</div>
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Trading Coach Scaling with Data-Driven Insights</h1>
          <p className="text-[#848e9c]">An illustrative example of how coaches use analytics to scale their practice while improving student outcomes.</p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-10 md:py-16">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: "Scaling", label: "Coaching Capacity" },
              { value: "Data", label: "Student Outcomes" },
              { value: "AI", label: "Manual Review Time" },
              { value: "Growing", label: "Student Retention" },
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
                Dr. James was a successful trading psychologist with a waitlist of 60+ students. 
                His coaching model required reviewing each student&apos;s trade journal manually — a process that 
                took 2-3 hours per student per week. He was capped at 20 active students and couldn&apos;t scale 
                without either sacrificing quality or burning out.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-bold text-white">The Solution</h2>
              <p className="mb-4 text-[#848e9c] leading-relaxed">
                Dr. James adopted ProStep2Market as his coaching platform. Students completed Trader DNA 
                assessments, connected their brokers, and started journaling. AI analysis highlighted 
                behavioral patterns automatically. Dr. James used the group dashboard to prioritize 
                which students needed intervention each week.
              </p>
              <ul className="space-y-2">
                {[
                  "AI analysis pre-flagged students needing intervention",
                  "Group dashboard showed all student Edge Scores at a glance",
                  "Automated behavioral pattern detection replaced manual journal review",
                  "Education platform with structured learning paths for students",
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
                    <Users className="h-4 w-4 text-[#ef4444]" />
                    <span className="text-xs font-medium text-[#ef4444]">Before</span>
                  </div>
                  <p className="mt-2 text-sm text-[#848e9c]">20 students max | 2-3 hrs/student/week | Manual journal review | Limited to local students</p>
                </div>
                <div className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-5">
                  <div className="mb-1 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#10b981]" />
                    <span className="text-xs font-medium text-[#10b981]">After</span>
                  </div>
                  <p className="mt-2 text-sm text-[#848e9c]">100 students | 30 min/student/week | AI-assisted review | Global student base</p>
                </div>
              </div>
            </div>

            <div className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 md:p-8">
              <Quote className="mb-4 h-8 w-8 text-[#fcd535]" />
              <p className="mb-4 text-lg leading-relaxed text-white italic">
                &ldquo;ProStep2Market didn&apos;t just help me scale — it made me a better coach. The AI analysis 
                catches behavioral patterns I would have missed. I spend my time on high-impact interventions 
                instead of manual journal reading. My students get better results, and I get my evenings back.&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-white">Dr. James R.</p>
                <p className="text-xs text-[#848e9c]">Trading Psychologist & Coach, PhD Behavioral Finance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-12 md:py-20">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Scale Your Coaching Practice</h2>
          <p className="mb-8 text-[#848e9c]">Join coaches using ProStep2Market to deliver better results.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Start Coaching Smarter <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
