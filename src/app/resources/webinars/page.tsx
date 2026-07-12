import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Monitor, Clock, User, Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "Webinars — ProStep2Market Resources",
  description: "Live and recorded webinars on trading psychology, platform features, and industry insights.",
}

const webinars = [
  { title: "The Science of Trading Consistency", presenter: "Dr. Sarah Chen", date: "Jul 25, 2026", time: "2:00 PM EST", desc: "Join behavioral psychologist Dr. Chen for a deep dive into the science behind consistent trading performance.", type: "Live", register: true },
  { title: "Prop Firm Panel: What Evaluators Look For", presenter: "Multiple Speakers", date: "Jul 18, 2026", time: "1:00 PM EST", desc: "Hear from prop firm evaluators about what separates successful candidates from the rest.", type: "Live", register: true },
  { title: "Platform Deep Dive: Strategy Lab 2.0", presenter: "Product Team", date: "Jul 11, 2026", time: "3:00 PM EST", desc: "See the new Strategy Lab features in action with a live demonstration.", type: "Recorded", register: false },
  { title: "Risk Management for Active Traders", presenter: "Alex Rivera", date: "Jun 28, 2026", time: "2:00 PM EST", desc: "Practical risk management strategies that active traders can implement immediately.", type: "Recorded", register: false },
  { title: "Getting Started with ProStep2Market", presenter: "Onboarding Team", date: "Jun 15, 2026", time: "1:00 PM EST", desc: "A complete walkthrough for new users covering all platform features.", type: "Recorded", register: false },
  { title: "Advanced Analytics: Beyond Basic Metrics", presenter: "Dr. James Park", date: "Jun 5, 2026", time: "2:00 PM EST", desc: "Learn how to interpret advanced performance metrics and use them to improve.", type: "Recorded", register: false },
]

export default function WebinarsPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Webinars</h1>
          <p className="text-[#848e9c]">Live events and recorded sessions with trading experts and platform specialists.</p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {webinars.map((w) => (
              <div key={w.title} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-colors hover:border-[#3a3a5c]">
                <div className="mb-3 flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${w.type === "Live" ? "bg-[rgba(16,185,129,0.15)] text-[#10b981]" : "bg-[rgba(132,142,156,0.15)] text-[#848e9c]"}`}>
                    {w.type === "Live" ? "🔴 Live" : "📹 Recorded"}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{w.title}</h3>
                <p className="mb-4 text-sm text-[#848e9c]">{w.desc}</p>
                <div className="mb-4 space-y-1 text-xs text-[#848e9c]">
                  <div className="flex items-center gap-1.5"><User className="h-3 w-3" />{w.presenter}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{w.date}</div>
                  <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{w.time}</div>
                </div>
                {w.register ? (
                  <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#fcd535] hover:text-[#f0b90b] transition-colors">
                    Register Now <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#848e9c] hover:text-[#eaecef] transition-colors">
                    Watch Recording <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
