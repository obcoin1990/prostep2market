"use client"

import { UserPlus, Link2, PenTool, Sparkles, GraduationCap, TrendingUp } from "lucide-react"

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: "Register and Complete Trader DNA Assessment",
    description: "Receive a personalized profile.",
  },
  {
    number: 2,
    icon: Link2,
    title: "Connect or Upload Trades",
    description: "MT5 read only, CSV import, or manual upload.",
  },
  {
    number: 3,
    icon: PenTool,
    title: "Journal and Reflect",
    description: "Log emotions and attach screenshots.",
  },
  {
    number: 4,
    icon: Sparkles,
    title: "Receive AI Feedback",
    description: "Behavioral warnings, trade quality analysis, and improvement suggestions.",
  },
  {
    number: 5,
    icon: GraduationCap,
    title: "Train in Strategy Lab",
    description: "Test rules and measure consistency.",
  },
  {
    number: 6,
    icon: TrendingUp,
    title: "Improve Edge Score",
    description: "Track progress and climb ranks.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-[#0B0B0B] md:text-4xl">
          How It Works
        </h2>
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E53935] text-white font-bold text-lg">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mt-2 h-16 w-0.5 bg-gray-200 md:hidden" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <step.icon className="h-5 w-5 text-[#E53935]" />
                    <h3 className="font-semibold text-[#0B0B0B]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}