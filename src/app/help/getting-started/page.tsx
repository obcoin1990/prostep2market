import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Compass, UserPlus, Link2, BookMarked, Shield, BarChart3, Trophy, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Getting Started — ProStep2Market Help",
  description: "New to ProStep2Market? Follow this guided onboarding to set up your account and start your trading journey.",
}

const steps = [
  { num: 1, icon: UserPlus, title: "Create Your Account", desc: "Sign up for a free account. No credit card required. You'll get immediate access to all core features." },
  { num: 2, icon: Link2, title: "Connect Your Broker", desc: "Link your MT4 or MT5 account. The connection is read-only — we never have access to withdraw or trade." },
  { num: 3, icon: BookMarked, title: "Complete Your First Journal Entry", desc: "Log your first trade manually or let it sync automatically. Add notes, screenshots, and sentiment." },
  { num: 4, icon: Shield, title: "Set Up Risk Guardian", desc: "Configure your risk parameters: max daily loss, max position size, and alert preferences." },
  { num: 5, icon: BarChart3, title: "Take the Trader DNA Assessment", desc: "Complete the 16-dimension behavioral assessment to understand your trading psychology profile." },
]

const quickLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/resources/tutorials", label: "Video Tutorials" },
  { href: "/resources/guides", label: "User Guides" },
  { href: "/resources/webinars", label: "Live Webinars" },
]

export default function GettingStartedPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Getting Started</h1>
          <p className="text-[#848e9c]">Follow these steps to set up your account and start your trading improvement journey.</p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            {steps.map((step) => (
              <div key={step.num} className="relative mb-8 flex gap-6 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fcd535] text-sm font-bold text-[#181a20]">
                    {step.num}
                  </div>
                  {step.num < steps.length && <div className="mt-1 h-full w-0.5 bg-[#2b3139]" />}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                    <step.icon className="h-5 w-5 text-[#fcd535]" />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-1 text-sm text-[#848e9c]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-12 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-6 text-center text-lg font-semibold text-white">Quick Links</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {quickLinks.map((l) => (
              <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 rounded-full border border-[#2b3139] bg-[#1e2329] px-4 py-2 text-sm text-[#eaecef] transition-colors hover:border-[#3a3a5c]">
                {l.label} <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to Begin?</h2>
          <p className="mb-8 text-[#848e9c]">Your journey to consistent trading starts now.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
