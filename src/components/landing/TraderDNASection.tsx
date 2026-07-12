"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, Shield, Brain, Activity } from "lucide-react"
import { useT } from "@/contexts/LanguageContext"

export function TraderDNASection() {
  const t = useT()
  return (
    <section className="bg-[#0A0F1C] py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-4xl">
            {t('marketing.dnaTitle')}
          </h2>
          <p className="mb-8 text-lg text-[rgba(255,255,255,0.7)] md:mb-12 md:text-xl">
            {t('marketing.dnaSubtitle')}
          </p>
        </div>
        
        <div className="mt-16 grid max-w-6xl gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <Brain className="h-8 w-8 text-[#00B4D8]" />
              <div>
                <h3 className="text-xl font-semibold text-white">{t('marketing.dnaProfileTitle')}</h3>
                <p className="text-[rgba(255,255,255,0.6)]">{t('marketing.dnaProfileDesc')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Shield className="h-8 w-8 text-[#8A2BE2]" />
              <div>
                <h3 className="text-xl font-semibold text-white">{t('marketing.dnaBehaviorTitle')}</h3>
                <p className="text-[rgba(255,255,255,0.6)]">{t('marketing.dnaBehaviorDesc')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Activity className="h-8 w-8 text-[#00B4D8]" />
              <div>
                <h3 className="text-xl font-semibold text-white">{t('marketing.dnaPerfTitle')}</h3>
                <p className="text-[rgba(255,255,255,0.6)]">{t('marketing.dnaPerfDesc')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Zap className="h-8 w-8 text-[#8A2BE2]" />
              <div>
                <h3 className="text-xl font-semibold text-white">{t('marketing.dnaInsightTitle')}</h3>
                <p className="text-[rgba(255,255,255,0.6)]">{t('marketing.dnaInsightDesc')}</p>
              </div>
            </div>
          </div>
          
          <div className="relative rounded-xl bg-[rgba(10,15,28,0.6)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] p-8">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold text-white">{t('marketing.dnaAssessmentTitle')}</h3>
              <p className="mt-2 text-[rgba(255,255,255,0.6)]">{t('marketing.dnaAssessmentDesc')}</p>
            </div>
            
            <div className="h-64 w-full bg-[rgba(0,0,0,0.2)] rounded-xl mb-6 flex items-center justify-center">
              <span className="text-[rgba(255,255,255,0.3)] text-sm">{t('marketing.dnaRadarPlaceholder')}</span>
            </div>
            
            <div className="space-y-4">
              <Link href="/dashboard/trader-dna">
                <Button variant="primary" size="lg" className="w-full gap-3">
                  {t('marketing.dnaTakeAssessment')}
                  <Activity className="h-5 w-5" />
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" className="w-full gap-3 text-[rgba(255,255,255,0.7)] hover:text-white border-[rgba(255,255,255,0.2)] hover:border-white">
                {t('marketing.dnaViewSample')}
                <Zap className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
