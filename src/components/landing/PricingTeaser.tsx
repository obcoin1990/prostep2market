"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useT } from "@/contexts/LanguageContext"

export function PricingTeaser() {
  const t = useT()
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-[#0B0B0B] md:text-4xl">
            {t('landing.pricingHeading')}
          </h2>
          <p className="mb-10 text-lg text-gray-600 md:text-xl">
            {t('landing.pricingSubtitle')}
          </p>
          <Link href="/pricing">
            <Button size="lg" className="gap-2">
              {t('landing.viewPricing')}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
