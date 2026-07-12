'use client'

import { Dna, Brain, Heart, Target, Shield, Activity, TrendingUp } from 'lucide-react'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

const PROFILE_TYPES = [
  { type: 'Sniper', desc: 'Precision trader — few setups, high conviction', color: '#E53935', icon: Target },
  { type: 'Analyst', desc: 'Data-driven — researches every angle before entry', color: '#00B4D8', icon: Brain },
  { type: 'Warrior', desc: 'High volume — thrives on action and market intensity', color: '#FF8A65', icon: Activity },
  { type: 'Disciplinarian', desc: 'Rule-bound — follows system with unwavering consistency', color: '#2E7D32', icon: Shield },
  { type: 'Opportunist', desc: 'Flexible — adapts quickly to changing market conditions', color: '#9C27B0', icon: TrendingUp },
]

export default function TraderDNADashboardPage() {
  const supabase = createClient()

  const { data: edgeScore, loading: scoreLoading } = useRealtimeData<any | null>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      const { data } = await supabase
        .from('edge_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .single()
      return data
    },
    [],
  )

  const { data: profile, loading: profileLoading } = useRealtimeData<any | null>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      const { data } = await supabase.from('trader_profiles').select('*').eq('user_id', user.id).single()
      return data
    },
    [],
  )

  const loading = scoreLoading || profileLoading

  const scores = edgeScore ? [
    { dimension: 'Risk Personality', score: Math.round(edgeScore.risk_score), color: '#00B4D8', desc: 'Risk management approach' },
    { dimension: 'Emotional Stability', score: Math.round(edgeScore.emotional_stability_score), color: '#fcd535', desc: 'Recovery after losses' },
    { dimension: 'Decision Making', score: Math.round(edgeScore.discipline_score), color: '#0ecb81', desc: 'Structured approach to entries' },
    { dimension: 'Strategy Adherence', score: Math.round(edgeScore.strategy_adherence_score), color: '#8A2BE2', desc: 'Following your trading plan' },
    { dimension: 'Consistency', score: Math.round(edgeScore.consistency_score), color: '#f6465d', desc: 'Pattern regularity over time' },
  ] : []

  const primaryType = profile?.dna_type ?? profile?.trader_type ?? null
  const compositeScore = edgeScore ? Math.round(edgeScore.composite_score) : null

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Trader DNA" description="Your psychological trading profile and behavioral assessment" icon={Dna} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full lg:col-span-2" />
        </div>
      </div>
    )
  }

  if (!edgeScore && !profile) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Trader DNA" description="Your psychological trading profile and behavioral assessment" icon={Dna} />
        <DashboardCard>
          <DashboardCardBody>
            <EmptyState
              title="Trader DNA profile not yet generated"
              description="Complete the Trader DNA assessment to unlock your psychological trading profile and personalized recommendations."
            />
          </DashboardCardBody>
        </DashboardCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Trader DNA"
        description="Your psychological trading profile and behavioral assessment"
        icon={Dna}
        action={<StatusBadge label={primaryType ? `${primaryType} Profile` : 'Profile Complete'} variant="success" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard className="lg:col-span-1">
          <DashboardCardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00B4D8]/15">
                <Target className="h-6 w-6 text-[#00B4D8]" />
              </div>
              <div>
                <DashboardCardTitle>Your Profile</DashboardCardTitle>
                <p className="text-xs text-white/60">Primary Trader Type</p>
              </div>
            </div>
          </DashboardCardHeader>
          <DashboardCardBody className="text-center py-4">
            <p className="text-2xl font-bold text-[#00B4D8]">{primaryType ?? 'Not Determined'}</p>
            <p className="text-xs text-white/50 mt-1">
              {PROFILE_TYPES.find(p => p.type === primaryType)?.desc ?? 'Complete more trades to determine your profile'}
            </p>
            {compositeScore !== null && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Composite Score</span>
                  <span className="font-semibold text-white">{compositeScore}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-[#00B4D8]" style={{ width: `${compositeScore}%` }} />
                </div>
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard className="lg:col-span-2">
          <DashboardCardHeader>
            <DashboardCardTitle>Dimensional Scores</DashboardCardTitle>
          </DashboardCardHeader>
          <DashboardCardBody>
            {scores.length === 0 ? (
              <EmptyState title="No scores yet" description="Complete more trades for your dimensional scores to appear." />
            ) : (
              <div className="space-y-4">
                {scores.map((s) => (
                  <div key={s.dimension}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-white">{s.dimension}</span>
                        <span className="text-[10px] text-white/50 hidden sm:inline">{s.desc}</span>
                      </div>
                      <span className="text-xs font-mono font-semibold" style={{ color: s.color }}>{s.score}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${s.score}%`, backgroundColor: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>
      </div>

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardTitle>Profile Types Explained</DashboardCardTitle>
        </DashboardCardHeader>
        <DashboardCardBody>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {PROFILE_TYPES.map((p) => {
              const Icon = p.icon
              const isCurrent = p.type === primaryType
              return (
                <div key={p.type} className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${isCurrent ? 'border-[#fcd535]/30 bg-[#fcd535]/5' : 'border-white/10 hover:border-white/20'}`}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${p.color}15` }}>
                    <Icon className="h-4 w-4" style={{ color: p.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{p.type}</p>
                    <p className="text-[10px] text-white/50">{p.desc}</p>
                  </div>
                  {isCurrent && <span className="ml-auto text-[10px] font-medium text-[#fcd535]">Your Profile</span>}
                </div>
              )
            })}
          </div>
        </DashboardCardBody>
      </DashboardCard>
    </div>
  )
}
