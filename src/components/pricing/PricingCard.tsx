"use client"

import { Check } from "lucide-react"
import Link from "next/link"

interface PricingCardProps {
  name: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
  badge?: string
  buttonText: string
  buttonHref: string
}

export function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false,
  badge,
  buttonText,
  buttonHref,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-[12px] p-6 transition-all ${
        highlighted
          ? "border-2 border-[#fcd535] bg-gradient-to-b from-[rgba(252,213,53,0.08)] to-[#1e2329] shadow-[0_0_30px_rgba(252,213,53,0.1)]"
          : "border border-[#2b3139] bg-[#1e2329] hover:border-[#3a3a5c]"
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-[#fcd535] px-3 py-1 text-xs font-bold text-[#181a20]">
            {badge}
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <p className="text-[#848e9c] mt-1 text-sm">{description}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold text-white">{price}</span>
        {price !== "Custom" && price !== "Free" && (
          <span className="text-[#848e9c] text-sm ml-1">/month</span>
        )}
      </div>

      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-[#0ecb81] mt-0.5 flex-shrink-0" />
            <span className="text-[#c9d1d9]">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={buttonHref}
        className={`flex items-center justify-center w-full rounded-[8px] px-4 py-2.5 text-sm font-semibold transition-colors ${
          highlighted
            ? "bg-[#fcd535] text-[#181a20] hover:bg-[#e6c02e]"
            : "border border-[#2b3139] bg-transparent text-white hover:border-[#3a3a5c] hover:bg-[rgba(255,255,255,0.03)]"
        }`}
      >
        {buttonText}
      </Link>
    </div>
  )
}
