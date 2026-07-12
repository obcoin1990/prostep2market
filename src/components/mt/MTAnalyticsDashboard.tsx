'use client'

import React, { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MTSessionHeatmap }     from '@/components/mt/MTSessionHeatmap'
import { MTPerformanceMetrics } from '@/components/mt/MTPerformanceMetrics'
import { MTMistakesPanel }      from '@/components/mt/MTMistakesPanel'
import { MTTraderDNAPanel }     from '@/components/mt/MTTraderDNAPanel'
import type { AnalyticsResult } from '@/lib/mt-analytics/compute'
import type { DNAScores }       from '@/lib/trader-dna/auto-builder'

const MTEquityCurve = dynamic(
  () => import('@/components/mt/MTEquityCurve').then(mod => ({ default: mod.MTEquityCurve })),
  { ssr: false }
)
const MTSymbolBreakdown = dynamic(
  () => import('@/components/mt/MTSymbolBreakdown').then(mod => ({ default: mod.MTSymbolBreakdown })),
  { ssr: false }
)

type Tab = 'overview' | 'sessions' | 'symbols' | 'dna' | 'mistakes'

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'overview',  label: 'Overview'  },
  { id: 'sessions',  label: 'Sessions'  },
  { id: 'symbols',   label: 'Symbols'   },
  { id: 'dna',       label: 'Trader DNA'},
  { id: 'mistakes',  label: 'Mistakes'  },
]

interface MTAnalyticsDashboardProps {
  connectionId?: string
  currency?: string
}

export function MTAnalyticsDashboard({ connectionId, currency = 'USD' }: MTAnalyticsDashboardProps) {
  const [tab, setTab]           = useState<Tab>('overview')
  const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null)
  const [dnaScores, setDnaScores] = useState<DNAScores | null>(null)
  const [loading, setLoading]   = useState(true)

  const loadAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const url = connectionId
        ? `/api/mt/analytics?connectionId=${connectionId}`
        : '/api/mt/analytics'
      const res  = await fetch(url)
      const json = await res.json()
      if (json.analytics) setAnalytics(json.analytics)
    } finally {
      setLoading(false)
    }
  }, [connectionId])

  const loadDNA = useCallback(async () => {
    try {
      // Pull existing trader_profiles row
      const res  = await fetch('/api/profile')
      const json = await res.json()
      if (json.profile) {
        setDnaScores({
          risk_personality_score:    json.profile.risk_personality_score    ?? 0,
          emotional_stability_score: json.profile.emotional_stability_score ?? 0,
          decision_making_score:     json.profile.decision_making_score     ?? 0,
          trading_behavior_score:    json.profile.trading_behavior_score    ?? 0,
          learning_style_score:      json.profile.learning_style_score      ?? 0,
          profile_type:              json.profile.profile_type              ?? '',
          learning_path:             json.profile.learning_path             ?? '',
        })
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    loadAnalytics()
    loadDNA()
  }, [loadAnalytics, loadDNA])

  const mistakeCount = analytics?.patterns?.filter(
    (p) => p.severity === 'high' || p.severity === 'medium'
  ).length ?? 0

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-full overflow-x-auto">
        {TABS.map((t) => (
<button type="button" 
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-max py-1.5 px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              tab === t.id
                ? 'bg-white text-[#0A0F1C] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
            {t.id === 'mistakes' && mistakeCount > 0 && (
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                {mistakeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <MTPerformanceMetrics
            metrics={analytics?.metrics ?? emptyMetrics()}
            currency={currency}
            loading={loading}
          />
          <MTEquityCurve
            data={analytics?.equityCurve ?? []}
            currency={currency}
          />
        </div>
      )}

      {tab === 'sessions' && (
        <MTSessionHeatmap data={analytics?.sessionHeatmap ?? []} />
      )}

      {tab === 'symbols' && (
        <MTSymbolBreakdown data={analytics?.symbolStats ?? []} currency={currency} />
      )}

      {tab === 'dna' && (
        <MTTraderDNAPanel
          scores={dnaScores}
          onRebuilt={(s) => setDnaScores(s)}
        />
      )}

      {tab === 'mistakes' && (
        <MTMistakesPanel patterns={analytics?.patterns ?? []} />
      )}

      {/* Footer */}
      {analytics && (
        <p className="text-[11px] text-gray-400 text-right">
          Based on {analytics.tradeCount} closed trades ·
          Generated {new Date(analytics.generatedAt).toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}

function emptyMetrics() {
  return {
    totalTrades: 0, winRate: 0, profitFactor: 0, netProfit: 0,
    avgWin: 0, avgLoss: 0, avgRR: null, maxDrawdown: 0, maxDrawdownPct: 0,
    sharpeRatio: null, avgDurationMinutes: null, longestWinStreak: 0,
    longestLossStreak: 0, bestTrade: 0, worstTrade: 0, totalVolume: 0,
    tradedSymbols: 0, avgTradesPerDay: 0,
  }
}
