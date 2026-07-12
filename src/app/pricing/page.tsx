'use client';

import { PricingCard } from "@/components/pricing/PricingCard"
import { ComparisonTable } from "@/components/pricing/ComparisonTable"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

const comparisonFeatures = [
  { feature: "Trading Journal", free: "limited", pro: "full", enterprise: "full" },
  { feature: "AI Analysis", free: "limited", pro: "full", enterprise: "full" },
  { feature: "Edge Score", free: "preview", pro: "full", enterprise: "full" },
  { feature: "Risk Guardian", free: "no", pro: "full", enterprise: "full" },
  { feature: "Strategy Lab", free: "no", pro: "no", enterprise: "full" },
  { feature: "White Label", free: "no", pro: "no", enterprise: "yes" },
  { feature: "Priority Support", free: "no", pro: "yes", enterprise: "yes" },
  { feature: "Custom Integrations", free: "no", pro: "no", enterprise: "yes" },
]

const tiers = [
  {
    name: "Free",
    price: "Free",
    description: "Get started with basic trading insights",
    features: [
      "Limited journal entries (20/month)",
      "AI analysis (10 trades/month)",
      "Edge Score preview",
      "Basic trade statistics",
    ],
    highlighted: false,
    buttonText: "Get Started",
    buttonHref: "/signup",
  },
  {
    name: "Pro",
    price: "$29",
    description: "For serious traders ready to level up",
    features: [
      "Unlimited journal entries",
      "Full AI analysis & recommendations",
      "Complete Edge Score breakdown",
      "Risk Guardian alerts",
      "Priority support",
    ],
    highlighted: true,
    badge: "Most Popular",
    buttonText: "Start Free Trial",
    buttonHref: "/signup?plan=pro",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For brokers and institutions",
    features: [
      "Everything in Pro",
      "White label customization",
      "Custom integrations",
      "Dedicated account manager",
      "SLA & compliance support",
    ],
    highlighted: false,
    buttonText: "Contact Sales",
    buttonHref: "/contact",
  },
]

const faqItems = [
  { q: "Can I switch plans later?", a: "Yes, you can upgrade or downgrade at any time. When upgrading, you get immediate access to new features. When downgrading, changes take effect at the next billing cycle." },
  { q: "Is there a free trial for Pro?", a: "Yes! Start with a 14-day free trial of the Pro plan. No credit card required. Cancel anytime." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex) and PayPal. Enterprise customers can also pay by invoice." },
  { q: "Can I get a refund?", a: "We offer a 30-day money-back guarantee on all paid plans. Contact our support team for a full refund within 30 days of purchase." },
  { q: "How does the Enterprise plan work?", a: "Enterprise plans are custom-tailored to your organization's needs. Contact our sales team for a personalized quote and demo." },
  { q: "Is my data secure?", a: "Absolutely. We use AES-256 encryption, SOC 2 compliant infrastructure, and read-only broker connections. Your data never leaves your control." },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Plans for Traders and Institutions
          </h1>
          <p className="mx-auto max-w-2xl text-[#848e9c] text-lg">
            Choose the plan that matches your growth. Start free, upgrade when you are ready.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="border-t border-[#2b3139] py-16">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <PricingCard key={tier.name} {...tier} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="border-t border-[#2b3139] py-16">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <h2 className="mb-8 text-2xl font-bold text-white text-center">
            Feature Comparison
          </h2>
          <ComparisonTable features={comparisonFeatures} />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="border-t border-[#2b3139] py-16">
        <div className="mx-auto max-w-[700px] px-4 sm:px-6 text-center rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Choose the Plan That Matches Your Growth
          </h2>
          <p className="mb-6 text-[#848e9c] max-w-lg mx-auto">
            Start your free account today and upgrade when you are ready to take your trading to the next level.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-[8px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#e6c02e]"
          >
            Start Free Today
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#2b3139] py-16">
        <div className="mx-auto max-w-[700px] px-4 sm:px-6">
          <h2 className="mb-8 text-2xl font-bold text-white text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left"
                >
                  <span className="text-sm font-medium text-white">{item.q}</span>
                  <ChevronDown className={`h-4 w-4 text-[#848e9c] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-[#848e9c]">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
