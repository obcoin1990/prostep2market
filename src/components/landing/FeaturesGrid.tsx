"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Dna, Sparkles, ShieldAlert, BookMarked, Trophy, FlaskConical } from "lucide-react"
import { useT } from "@/contexts/LanguageContext"

export function FeaturesGrid() {
  const t = useT()
  const features = [
    { icon: Dna,        titleKey: 'landing.feat1Title', descKey: 'landing.feat1Desc' },
    { icon: Sparkles,   titleKey: 'landing.feat2Title', descKey: 'landing.feat2Desc' },
    { icon: ShieldAlert,titleKey: 'landing.feat3Title', descKey: 'landing.feat3Desc' },
    { icon: BookMarked, titleKey: 'landing.feat4Title', descKey: 'landing.feat4Desc' },
    { icon: Trophy,     titleKey: 'landing.feat5Title', descKey: 'landing.feat5Desc' },
    { icon: FlaskConical,titleKey:'landing.feat6Title', descKey: 'landing.feat6Desc' },
  ]

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
                <h3 className="mb-2 text-lg font-semibold text-[#0B0B0B]">{t(feature.titleKey)}</h3>
                <p className="text-sm text-gray-600">{t(feature.descKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
