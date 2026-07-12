"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Brain, Activity } from "lucide-react"
import { useT } from "@/contexts/LanguageContext"

export function AIRiskGuardianSection() {
  const t = useT()
  return (
    <section className="bg-[#0A0F1C] py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-4xl">
            {t('marketing.guardianTitle')}
          </h2>
          <p className="mb-8 text-lg text-[rgba(255,255,255,0.7)] md:mb-12 md:text-xl">
            {t('marketing.guardianSubtitle')}
          </p>
        </div>
        
        <div className="mt-16 grid max-w-6xl gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="h-8 w-8 text-[#00B4D8]" />
              <div>
                <h3 className="text-xl font-semibold text-white">{t('marketing.guardianMonitorTitle')}</h3>
                <p className="text-[rgba(255,255,255,0.6)]">{t('marketing.guardianMonitorDesc')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Zap className="h-8 w-8 text-[#8A2BE2]" />
              <div>
                <h3 className="text-xl font-semibold text-white">{t('marketing.guardianAlertTitle')}</h3>
                <p className="text-[rgba(255,255,255,0.6)]">{t('marketing.guardianAlertDesc')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Brain className="h-8 w-8 text-[#00B4D8]" />
              <div>
                <h3 className="text-xl font-semibold text-white">{t('marketing.guardianCoachingTitle')}</h3>
                <p className="text-[rgba(255,255,255,0.6)]">{t('marketing.guardianCoachingDesc')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Activity className="h-8 w-8 text-[#8A2BE2]" />
              <div>
                <h3 className="text-xl font-semibold text-white">{t('marketing.guardianPreventTitle')}</h3>
                <p className="text-[rgba(255,255,255,0.6)]">{t('marketing.guardianPreventDesc')}</p>
              </div>
            </div>
          </div>
          
          <div className="relative rounded-xl bg-[rgba(10,15,28,0.6)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] p-8">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold text-white">{t('marketing.guardianAlertSystemTitle')}</h3>
              <p className="mt-2 text-[rgba(255,255,255,0.6)]">{t('marketing.guardianAlertSystemDesc')}</p>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-lg bg-[rgba(229,57,53,0.1)] border border-[rgba(229,57,53,0.2)] p-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-[#E53935] flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{t('marketing.guardianRevengeTitle')}</h4>
                    <p className="text-[rgba(255,255,255,0.7)] text-sm">{t('marketing.guardianRevengeDesc')}</p>
                    <Button variant="outline" size="sm" className="mt-2 text-[rgba(255,255,255,0.6)] hover:text-white border-[#E53935] hover:border-white">
                      {t('marketing.guardianViewDetails')}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-[rgba(255,193,7,0.1)] border border-[rgba(255,193,7,0.2)] p-4">
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-[#FFC107] flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{t('marketing.guardianOvertradingTitle')}</h4>
                    <p className="text-[rgba(255,255,255,0.7)] text-sm">{t('marketing.guardianOvertradingDesc')}</p>
                    <Button variant="outline" size="sm" className="mt-2 text-[rgba(255,255,255,0.6)] hover:text-white border-[rgba(255,193,7,0.6)] hover:border-white">
                      {t('marketing.guardianViewDetails')}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-[rgba(156,39,176,0.1)] border border-[rgba(156,39,176,0.2)] p-4">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-[#9C27B0] flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{t('marketing.guardianFatigueTitle')}</h4>
                    <p className="text-[rgba(255,255,255,0.7)] text-sm">{t('marketing.guardianFatigueDesc')}</p>
                    <Button variant="outline" size="sm" className="mt-2 text-[rgba(255,255,255,0.6)] hover:text-white border-[rgba(156,39,176,0.6)] hover:border-white">
                      {t('marketing.guardianViewDetails')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link href="/risk-guardian">
                <Button variant="primary" size="lg" className="w-full gap-3">
                  {t('marketing.guardianEnable')}
                  <Shield className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
