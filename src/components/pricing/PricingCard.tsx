"use client"

import { Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
    <Card
      className={`relative flex flex-col p-6 ${
        highlighted
          ? "border-2 border-[#E53935] shadow-lg"
          : "border border-gray-100"
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="error" className="px-3 py-1">
            {badge}
          </Badge>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-[#0B0B0B]">{name}</h3>
        <p className="text-gray-600 mt-1 text-sm">{description}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold text-[#0B0B0B]">{price}</span>
        {price !== "Custom" && price !== "Free" && (
          <span className="text-gray-500 text-sm ml-1">/month</span>
        )}
      </div>

      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-[#2E7D32] mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={highlighted ? "primary" : "secondary"}
        className="w-full"
        onClick={() => (window.location.href = buttonHref)}
      >
        {buttonText}
      </Button>
    </Card>
  )
}
