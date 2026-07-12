import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Briefcase, Users, TrendingUp, Shield, BarChart3, Globe, CheckCircle2, Star, DollarSign, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Brokerages — ProStep2Market Solutions",
  description: "Reduce churn and increase platform stickiness with integrated behavioral analytics for your brokerage clients.",
  openGraph: { title: "ProStep2Market for Brokerages", description: "Value-added services for trading platforms." },
}

const benefits = [
  { icon: Users, title: "Client Retention", desc: "Reduce churn with differentiated behavioral analytics that keep clients engaged and improving." },
  { icon: Star, title: "Value-Added Service", desc: "Offer your clients a professional-grade trading psychology platform that sets you apart from competitors." },
  { icon: Globe, title: "White-Label Ready", desc: "Full white-label solution with your branding. Seamless integration into your existing platform." },
  { icon: DollarSign, title: "New Revenue Stream", desc: "Monetize through subscription revenue share or premium tier offerings to your client base." },
  { icon: Shield, title: "Reduced Support Load", desc: "Better-informed traders make fewer support requests. Education and self-awareness reduce common issues." },
  { icon: BarChart3, title: "Client Insights", desc: "Aggregate anonymized data on client trading behavior to inform your product and education strategy." },
]

export default function BrokeragesPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            For{" "}
            <span className="text-[#fcd535]">Brokerages</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Your clients trade with you because they believe in your platform. Give them the tools 
            to trade better — and watch your retention and revenue grow.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Become a Partner <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/solutions/enterprise" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              Enterprise Features
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Why Partner With Us</h2>
          <p className="mb-16 text-center text-[#848e9c]">A partnership that benefits your business and your clients.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-colors hover:border-[#3a3a5c]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                  <b.icon className="h-5 w-5 text-[#fcd535]" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{b.title}</h3>
                <p className="text-sm leading-relaxed text-[#848e9c]">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Let&apos;s Partner</h2>
          <p className="mb-8 text-[#848e9c]">Contact our partnerships team to discuss integration options.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Contact Partnerships <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
