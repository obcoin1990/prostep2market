"use client"

import { useT } from "@/contexts/LanguageContext"

export function ProblemSection() {
  const t = useT()
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-[#0B0B0B] md:text-4xl">
            {t('landing.problemHeading')}
          </h2>
          <p className="text-lg text-gray-600 md:text-xl">
            {t('landing.problemBody')}
          </p>
        </div>
      </div>
    </section>
  )
}