'use client';

import { PricingCard } from "@/components/pricing/PricingCard"
import { ComparisonTable } from "@/components/pricing/ComparisonTable"
import { Button } from "@/components/ui/button"

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

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0B0B0B] mb-4">
            Plans for Traders and Institutions
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose the plan that matches your growth. Start free, upgrade when you are ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tiers.map((tier) => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#0B0B0B] mb-6 text-center">
            Feature Comparison
          </h2>
          <ComparisonTable features={comparisonFeatures} />
        </div>

        <div className="text-center bg-white rounded-[12px] p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-[#0B0B0B] mb-4">
            Choose the Plan That Matches Your Growth
          </h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Start your free account today and upgrade when you are ready to take your trading to the next level.
          </p>
          <Button onClick={() => (window.location.href = "/signup")}>
            Start Free Today
          </Button>
        </div>
      </div>
    </div>
  )
}
