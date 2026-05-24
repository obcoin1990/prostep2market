"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useT } from "@/contexts/LanguageContext"

export function FooterCTA() {
  const t = useT()
  return (
    <section className="bg-[#0B0B0B] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            {t('landing.footerCtaHeading')}
          </h2>
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              {t('landing.startFreeTrial')}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
