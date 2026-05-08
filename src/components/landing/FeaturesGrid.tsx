"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Dna,
  Sparkles,
  ShieldAlert,
  BookMarked,
  Trophy,
  FlaskConical
} from "lucide-react"

const features = [
  {
    icon: Dna,
    title: "Trader DNA Assessment",
    description: "Personalized profile that tailors coaching and analytics.",
  },
  {
    icon: Sparkles,
    title: "AI Trade Intelligence Engine",
    description: "Trade quality, emotional analysis, and risk metrics.",
  },
  {
    icon: ShieldAlert,
    title: "Risk Guardian System",
    description: "Behavioral alerts and fatigue detection.",
  },
  {
    icon: BookMarked,
    title: "Trade Journal System",
    description: "Attach screenshots, log emotions, get AI reflections.",
  },
  {
    icon: Trophy,
    title: "Edge Score System",
    description: "Gamified scoring for discipline and consistency.",
  },
  {
    icon: FlaskConical,
    title: "Strategy Lab",
    description: "Simulate rules, RR, and session strategies.",
  },
]

export function FeaturesGrid() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} variant="elevated" className="transition-transform hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#E53935]/10">
                  <feature.icon className="h-5 w-5 text-[#E53935]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#0B0B0B]">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}