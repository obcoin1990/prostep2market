"use client"

import { 
  Brain, 
  Target, 
  Shield, 
  BookOpen, 
  TrendingUp 
} from "lucide-react"

const solutions = [
  {
    icon: Brain,
    title: "Trader Intelligence Platform",
    description: "Personalized coaching and analytics driven by your Trader DNA.",
  },
  {
    icon: Target,
    title: "AI Behavioral Analytics",
    description: "Detects emotional patterns and trading fatigue.",
  },
  {
    icon: Shield,
    title: "Risk Guardian",
    description: "Real time behavioral warnings and risk escalation monitoring.",
  },
  {
    icon: BookOpen,
    title: "Trade Journal and Edge Score",
    description: "Objective performance scoring and gamified progress tracking.",
  },
  {
    icon: TrendingUp,
    title: "Education and Strategy Lab",
    description: "Structured learning and simulation to build repeatable edge.",
  },
]

export function SolutionSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-[#0B0B0B] md:text-4xl">
          What ProStep2Market Does
        </h2>
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col items-start rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50">
                <item.icon className="h-6 w-6 text-[#E53935]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#0B0B0B]">
                {item.title}
              </h3>
              <p className="text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}