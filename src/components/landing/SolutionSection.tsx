"use client"

import { Brain, Target, Shield, BookOpen, TrendingUp } from "lucide-react"
import { useT } from "@/contexts/LanguageContext"

export function SolutionSection() {
  const t = useT()
  const solutions = [
    { icon: Brain,      titleKey: 'landing.sol1Title', descKey: 'landing.sol1Desc' },
    { icon: Target,     titleKey: 'landing.sol2Title', descKey: 'landing.sol2Desc' },
    { icon: Shield,     titleKey: 'landing.sol3Title', descKey: 'landing.sol3Desc' },
    { icon: BookOpen,   titleKey: 'landing.sol4Title', descKey: 'landing.sol4Desc' },
    { icon: TrendingUp, titleKey: 'landing.sol5Title', descKey: 'landing.sol5Desc' },
  ]

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-[#0B0B0B] md:mb-12 md:text-4xl">
          {t('landing.solutionHeading')}
        </h2>
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((item, index) => (
            <div key={index} className="flex flex-col items-start rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50">
                <item.icon className="h-6 w-6 text-[#E53935]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#0B0B0B]">{t(item.titleKey)}</h3>
              <p className="text-gray-600">{t(item.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
