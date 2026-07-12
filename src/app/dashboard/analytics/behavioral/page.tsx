'use client'

import { Brain, Heart, AlertTriangle, TrendingUp, TrendingDown, Target, Shield, Clock, ArrowUpRight, Activity, Eye, Sparkles, RefreshCw } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

interface BehaviorPattern {
  name: string
  desc: string
  frequency: string
  impact: string
  severity: string
  color: string
  tips: string[]
}

interface PsychScore {
  dimension: string
  score: number
  color: string
}

export default function BehavioralAnalyticsPage() {
  const supabase = createClient()

  const { data: patterns, loading: patternsLoading, error: patternsError, refetch: refetchPatterns } = useRealtimeData<BehaviorPattern[]>(
    async () => {
      const res = await supabase
        .from('behavioral_patterns')
        .select('*')
        .order('detected_at', { ascending: false })
      if (res.error) throw res.error
      return (res.data ?? []).map((b: any) => ({
        name: b.pattern_name,
        desc: b.description ?? '',
        frequency: `${b.frequency}x this month`,
        impact: `${b.impact >= 0 ? '+' : ''}${b.impact.toFixed(1)}R avg`,
        severity: b.severity,
        color: b.severity === 'High' ? '#f6465d' : b.severity === 'Medium' ? '#FFC107' : '#00B4D8',
        tips: b.tips ?? [],
      }))
    },
    [],
  )

  const { data: psychScores, loading: psychLoading, error: psychError, refetch: refetchPsych } = useRealtimeData<{ dimension: string; score: number; color: string }[]>(
    async () => {
      const res = await supabase
        .from('trader_profiles')
        .select('scores')
        .single()
      if (res.error) throw res.error
      const scores = (res.data as any)?.scores ?? {}
      const colors: Record<string, string> = {
        riskPersonality: '#00B4D8',
        emotionalStability: '#fcd535',
        decisionMaking: '#0ecb81',
        tradingBehavior: '#8A2BE2',
        learningStyle: '#f6465d',
      }
      const labels: Record<string, string> = {
        riskPersonality: 'Risk Personality',
        emotionalStability: 'Emotional Regulation',
        decisionMaking: 'Decision Making',
        tradingBehavior: 'Trading Behavior',
        learningStyle: 'Learning Style',
      }
      return Object.entries(scores).map(([key, val]) => ({
        dimension: labels[key] ?? key,
        score: val as number,
        color: colors[key] ?? '#0ecb81',
      }))
    },
    [],
  )

  const { data: recommendations, loading: recLoading, error: recError, refetch: refetchRec } = useRealtimeData<{ text: string; impact: string; icon: any; color: string }[]>(
    async () => {
      const res = await supabase
        .from('trader_profiles')
        .select('recommendations')
        .single()
      if (res.error) throw res.error
      const recs = (res.data as any)?.recommendations ?? []
      const colors = ['#f6465d', '#00B4D8', '#fcd535', '#0ecb81']
      return recs.map((r: string, i: number) => ({
        text: r,
        impact: 'Medium',
        icon: Brain,
        color: colors[i % colors.length],
      }))
    },
    [],
  )

  const loading = patternsLoading || psychLoading || recLoading
  const error = patternsError || psychError || recError

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
              <div className="h-3 w-20 bg-[#2b3139] rounded animate-pulse" />
              <div className="h-7 w-16 bg-[#2b3139] rounded animate-pulse" />
              <div className="h-3 w-24 bg-[#2b3139] rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
              <div className="h-4 w-40 bg-[#2b3139] rounded animate-pulse" />
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-10 bg-[#2b3139] rounded animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Behavioral Analytics" description="AI-powered behavioral pattern detection and psychology scores" icon={Brain} />
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-[#f6465d]/10 p-3">
              <TrendingDown className="h-5 w-5 text-[#f6465d]" />
            </div>
            <p className="text-sm text-white/60">Failed to load behavioral data</p>
            <p className="text-xs text-white/50">{error}</p>
            <Button variant="outline" size="sm" onClick={() => { refetchPatterns(); refetchPsych(); refetchRec() }}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const avgPsychScore = psychScores && psychScores.length > 0
    ? Math.round(psychScores.reduce((s, p) => s + p.score, 0) / psychScores.length)
    : 0

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Behavioral Analytics"
        description="AI-powered behavioral pattern detection and psychology scores"
        icon={Brain}
        action={<StatusBadge label="AI Active" variant="active" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Patterns Detected" value={patterns?.length ?? 0} icon={AlertTriangle} />
        <StatCard label="Psychology Score" value={avgPsychScore} icon={Heart} />
        <StatCard label="Improvement" value="+5 pts" icon={TrendingUp} trend={{ value: 7, positive: true }} />
        <StatCard label="Active Interventions" value={2} icon={Shield} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>Psychology Dimension Scores</DashboardCardTitle>
            <p className="text-xs text-white/60 mt-0.5">Your trading psychology breakdown</p>
          </DashboardCardHeader>
          <DashboardCardBody>
            {!psychScores || psychScores.length === 0 ? (
              <EmptyState icon={<Heart className="w-6 h-6" />} title="No assessment data yet" description="Complete the Trader DNA assessment to see your scores." variant="compact" />
            ) : (
              <div className="space-y-4">
                {psychScores.map((p) => (
                  <div key={p.dimension}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-white/80">{p.dimension}</span>
                      <span className="text-sm font-mono font-semibold text-white">{p.score}/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${p.score}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>AI Recommendations</DashboardCardTitle>
            <p className="text-xs text-white/60 mt-0.5">Personalized suggestions to improve your trading</p>
          </DashboardCardHeader>
          <DashboardCardBody>
            {!recommendations || recommendations.length === 0 ? (
              <EmptyState icon={<Sparkles className="w-6 h-6" />} title="No recommendations yet" description="Complete the Trader DNA assessment to get personalized insights." variant="compact" />
            ) : (
              <div className="space-y-3">
                {recommendations.map((r, i) => {
                  const Icon = r.icon
                  return (
                    <div key={i} className="rounded-lg border p-3" style={{ borderColor: `${r.color}20`, backgroundColor: `${r.color}08` }}>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4" style={{ color: r.color }} />
                        <span className="text-xs font-semibold text-white">{r.text}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Detected Behavioral Patterns</h3>
        {!patterns || patterns.length === 0 ? (
          <DashboardCard>
            <DashboardCardBody>
              <EmptyState icon={<Brain className="w-6 h-6" />} title="No patterns detected" description="AI continuously monitors your trading for behavioral patterns." variant="compact" />
            </DashboardCardBody>
          </DashboardCard>
        ) : (
          patterns.map((p) => (
            <DashboardCard key={p.name}>
              <DashboardCardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${p.color}15` }}>
                      <AlertTriangle className="h-4 w-4" style={{ color: p.color }} />
                    </div>
                    <div>
                      <DashboardCardTitle>{p.name}</DashboardCardTitle>
                      <p className="text-xs text-white/60 mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                  <StatusBadge
                    label={p.severity}
                    variant={p.severity === 'High' ? 'danger' : p.severity === 'Medium' ? 'warning' : 'info'}
                  />
                </div>
              </DashboardCardHeader>
              <DashboardCardBody>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                    <span className="text-xs text-white/60">Frequency</span>
                    <span className="text-xs font-medium text-white">{p.frequency}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                    <span className="text-xs text-white/60">Avg Impact</span>
                    <span className="text-xs font-mono font-medium" style={{ color: p.impact.startsWith('-') ? '#f6465d' : '#0ecb81' }}>{p.impact}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/60 mb-2">Improvement Tips</p>
                  <div className="space-y-1.5">
                    {p.tips.map((tip, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                        <ArrowUpRight className="h-3 w-3 text-[#fcd535] shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </DashboardCardBody>
            </DashboardCard>
          ))
        )}
      </div>
    </div>
  )
}
