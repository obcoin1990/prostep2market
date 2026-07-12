"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, Gauge, Bell, BarChart3, HeartPulse, Brain } from "lucide-react"
import { useT } from "@/contexts/LanguageContext"

export function DashboardPreview() {
  const t = useT()
  return (
    <section className="relative overflow-hidden bg-[#0A0F1C] py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-4xl">
            {t('marketing.dashTitle')}
          </h2>
          <p className="mb-8 text-lg text-[rgba(255,255,255,0.7)] md:mb-12 md:text-xl">
            {t('marketing.dashSubtitle')}
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-[#00B4D8] hover:bg-[#0096C7] text-white px-8 py-3 gap-2 transition-colors">
              {t('marketing.dashExplore')}
              <ArrowRight className="h-5 w-5 text-white" />
            </Button>
          </Link>
        </div>
        
        {/* Preview Grid - 5 key metrics */}
        <div className="mt-16 grid max-w-6xl gap-6 md:grid-cols-3 lg:grid-cols-5 mx-auto">
          
          {/* Edge Score */}
          <div className="relative rounded-xl bg-[rgba(10,15,28,0.6)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Gauge className="h-6 w-6 text-[#00B4D8]" />
              <span className="font-semibold text-sm tracking-wide">{t('marketing.dashEdgeScore')}</span>
            </div>
            <div className="text-4xl font-bold text-[#00B4D8]">78</div>
            <p className="mt-2 text-sm text-[rgba(255,255,255,0.6)]">{t('marketing.dashEdgeScoreDesc')}</p>
            <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-[rgba(0,180,216,0.1)] flex items-center justify-center">
              <span className="text-xs text-[#00B4D8]">+2</span>
            </div>
          </div>
          
          {/* Emotional Risk Meter */}
          <div className="relative rounded-xl bg-[rgba(10,15,28,0.6)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <HeartPulse className="h-6 w-6 text-[#8A2BE2]" />
              <span className="font-semibold text-sm tracking-wide">{t('marketing.dashEmotionalRisk')}</span>
            </div>
            <div className="text-4xl font-bold text-[#8A2BE2]">Low</div>
            <p className="mt-2 text-sm text-[rgba(255,255,255,0.6)]">{t('marketing.dashEmotionalRiskDesc')}</p>
            <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-[rgba(138,43,226,0.1)] flex items-center justify-center">
              <span className="text-xs text-[#8A2BE2]">↓</span>
            </div>
          </div>
          
          {/* AI Alerts */}
          <div className="relative rounded-xl bg-[rgba(10,15,28,0.6)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-6 w-6 text-[#00B4D8]" />
              <span className="font-semibold text-sm tracking-wide">{t('marketing.dashAiAlerts')}</span>
            </div>
            <div className="text-4xl font-bold text-[#00B4D8]">3</div>
            <p className="mt-2 text-sm text-[rgba(255,255,255,0.6)]">{t('marketing.dashAiAlertsDesc')}</p>
            <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-[rgba(0,180,216,0.1)] flex items-center justify-center">
              <span className="text-xs text-[#00B4D8]">+1</span>
            </div>
          </div>
          
          {/* Weekly Consistency */}
          <div className="relative rounded-xl bg-[rgba(10,15,28,0.6)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-6 w-6 text-[#8A2BE2]" />
              <span className="font-semibold text-sm tracking-wide">{t('marketing.dashConsistency')}</span>
            </div>
            <div className="text-4xl font-bold text-[#8A2BE2]">82%</div>
            <p className="mt-2 text-sm text-[rgba(255,255,255,0.6)]">{t('marketing.dashConsistencyDesc')}</p>
            <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-[rgba(138,43,226,0.1)] flex items-center justify-center">
              <span className="text-xs text-[#8A2BE2]">↑</span>
            </div>
          </div>
          
          {/* Trading Psychology */}
          <div className="relative rounded-xl bg-[rgba(10,15,28,0.6)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="h-6 w-6 text-[#00B4D8]" />
              <span className="font-semibold text-sm tracking-wide">{t('marketing.dashPsychology')}</span>
            </div>
            <div className="text-4xl font-bold text-[#00B4D8]">76</div>
            <p className="mt-2 text-sm text-[rgba(255,255,255,0.6)]">{t('marketing.dashPsychologyDesc')}</p>
            <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-[rgba(0,180,216,0.1)] flex items-center justify-center">
              <span className="text-xs text-[#00B4D8]">+3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}