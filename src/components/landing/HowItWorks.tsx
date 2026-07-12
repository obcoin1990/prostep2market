"use client"

import { UserPlus, Link2, PenTool, Sparkles, GraduationCap, TrendingUp } from "lucide-react"
import { useT } from "@/contexts/LanguageContext"

export function HowItWorks() {
  const t = useT()
  const steps = [
    { number: 1, icon: UserPlus,      titleKey: 'landing.step1Title', descKey: 'landing.step1Desc' },
    { number: 2, icon: Link2,         titleKey: 'landing.step2Title', descKey: 'landing.step2Desc' },
    { number: 3, icon: PenTool,       titleKey: 'landing.step3Title', descKey: 'landing.step3Desc' },
    { number: 4, icon: Sparkles,      titleKey: 'landing.step4Title', descKey: 'landing.step4Desc' },
    { number: 5, icon: GraduationCap, titleKey: 'landing.step5Title', descKey: 'landing.step5Desc' },
    { number: 6, icon: TrendingUp,    titleKey: 'landing.step6Title', descKey: 'landing.step6Desc' },
  ]

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-[#0B0B0B] md:mb-12 md:text-4xl">
          {t('landing.howItWorksHeading')}
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
                    <h3 className="font-semibold text-[#0B0B0B]">{t(step.titleKey)}</h3>
                  </div>
                  <p className="text-gray-600">{t(step.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
