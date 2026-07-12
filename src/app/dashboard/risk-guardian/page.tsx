'use client'

import { Shield, ShieldAlert, AlertTriangle, Activity, Clock, HeartPulse, Bell, Sliders, CheckCircle2 } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

const ALERT_ICONS: Record<string, any> = {
  revenge_trading: AlertTriangle,
  fatigue: Clock,
  risk_escalation: ShieldAlert,
  emotional_instability: Activity,
  exposure_warning: ShieldAlert,
  overtrading: Activity,
  session_duration: Clock,
}

const ALERT_COLORS: Record<string, string> = {
  critical: '#f6465d',
  warning: '#FFC107',
  info: '#00B4D8',
}

export default function RiskGuardianDashboardPage() {
  const supabase = createClient()

  const { data: alerts, loading: alertsLoading } = useRealtimeData<any[]>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .gte('triggered_at', today)
        .order('triggered_at', { ascending: false })
        .limit(20)
      return data ?? []
    },
    [],
  )

  const { data: settings, loading: settingsLoading } = useRealtimeData<any | null>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      const { data } = await supabase.from('risk_guardian_settings').select('*').eq('user_id', user.id).single()
      return data
    },
    [],
  )

  const { data: patterns, loading: patternsLoading } = useRealtimeData<any[]>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data } = await supabase
        .from('behavioral_patterns')
        .select('*')
        .eq('user_id', user.id)
        .order('detected_at', { ascending: false })
        .limit(10)
      return data ?? []
    },
    [],
  )

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

  const loading = alertsLoading || settingsLoading || patternsLoading || scoreLoading

  const todayAlerts = alerts ?? []
  const alertCount = todayAlerts.length
  const highAlerts = todayAlerts.filter((a: any) => a.severity === 'critical').length
  const riskLevel = highAlerts > 2 ? 'High' : highAlerts > 0 ? 'Elevated' : 'Low'

  const guardianToggles = settings ? [
    { label: 'Loss Limit Threshold', enabled: true, desc: `Stop after -${settings.exposure_multiplier ?? 1.3}% daily` },
    { label: 'Revenge Trading Sensitivity', enabled: settings.revenge_trading_alert_enabled ?? true, desc: 'Triggers on oversized positions after losses' },
    { label: 'Fatigue Timer', enabled: settings.fatigue_warning_enabled ?? true, desc: `Warn after ${settings.max_session_duration ?? 120} minutes` },
    { label: 'Auto-Pause on High Risk', enabled: false, desc: 'Enable to force session breaks' },
    { label: 'Emotional Escalation Alerts', enabled: settings.emotional_instability_threshold ? true : false, desc: `Triggers on ${settings.emotional_instability_threshold ?? 5}+ negative states` },
  ] : []

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Risk Guardian" description="Real-time behavioral monitoring and risk protection" icon={Shield} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Risk Guardian"
        description="Real-time behavioral monitoring and risk protection"
        icon={Shield}
        action={<StatusBadge label="Guardian Active" variant="active" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Current Risk Level" value={riskLevel} icon={ShieldAlert} />
        <StatCard label="Alerts Today" value={String(alertCount)} icon={Bell} />
        <StatCard label="Trades Today" value={String(todayAlerts.length)} icon={Activity} />
        <StatCard label="Guardian Status" value="Active" icon={Sliders} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <DashboardCard className="lg:col-span-3">
          <DashboardCardHeader>
            <div className="flex items-center justify-between">
              <DashboardCardTitle>Live Alert Feed</DashboardCardTitle>
              <span className="text-[10px] text-white/60">Today&apos;s session</span>
            </div>
          </DashboardCardHeader>
          <DashboardCardBody>
            {todayAlerts.length === 0 ? (
              <EmptyState title="No alerts today" description="Risk Guardian is monitoring your session. Alerts will appear here in real-time." />
            ) : (
              <div className="space-y-3">
                {todayAlerts.map((alert: any) => {
                  const Icon = ALERT_ICONS[alert.type] ?? AlertTriangle
                  const color = ALERT_COLORS[alert.severity] ?? '#9ea3ad'
                  const time = new Date(alert.triggered_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                  return (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-white/[0.02]"
                      style={{ borderColor: `${color}20`, backgroundColor: `${color}08` }}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}20` }}>
                        <Icon className="h-4 w-4" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-semibold text-white">{alert.title}</p>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
                            style={{ backgroundColor: `${color}20`, color }}
                          >
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 mt-1">{alert.message}</p>
                      </div>
                      <span className="text-[10px] text-white/50 shrink-0">{time}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard className="lg:col-span-2">
          <DashboardCardHeader>
            <DashboardCardTitle>Guardian Settings</DashboardCardTitle>
            <p className="text-xs text-white/60 mt-0.5">Configure your risk thresholds</p>
          </DashboardCardHeader>
          <DashboardCardBody>
            {guardianToggles.length === 0 ? (
              <EmptyState title="No settings" description="Guardian settings will appear here once configured." />
            ) : (
              <div className="space-y-3">
                {guardianToggles.map((s, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white">{s.label}</p>
                      <p className="text-[10px] text-white/60">{s.desc}</p>
                    </div>
                    <div
                      className="relative h-5 w-9 rounded-full shrink-0 flex items-center transition-colors"
                      style={{ backgroundColor: s.enabled ? '#fcd535' : 'rgba(255,255,255,0.12)' }}
                    >
                      <span
                        className="absolute h-3.5 w-3.5 rounded-full bg-[#0b0e11] shadow transition-transform"
                        style={{ transform: s.enabled ? 'translateX(18px)' : 'translateX(2px)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>Risk Patterns This Month</DashboardCardTitle>
          </DashboardCardHeader>
          <DashboardCardBody>
            {(patterns ?? []).length === 0 ? (
              <EmptyState title="No patterns detected" description="Risk Guardian will detect and display behavioral patterns as you trade." />
            ) : (
              <div className="space-y-4">
                {patterns?.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/80">{p.pattern_name}</span>
                        <span className="text-xs font-mono text-white/60">{p.frequency}x</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((p.frequency / 10) * 100, 100)}%`,
                            backgroundColor: p.severity === 'High' ? '#f6465d' : p.severity === 'Medium' ? '#FFC107' : '#00B4D8',
                          }}
                        />
                      </div>
                    </div>
                    <span
                      className="text-xs font-mono font-semibold"
                      style={{ color: p.impact >= 0 ? '#0ecb81' : '#f6465d' }}
                    >
                      {p.impact >= 0 ? '+' : ''}{Number(p.impact).toFixed(1)}R
                    </span>
                  </div>
                ))}
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader>
            <div className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-[#f6465d]" />
              <DashboardCardTitle>Health Score</DashboardCardTitle>
            </div>
          </DashboardCardHeader>
          <DashboardCardBody>
            {edgeScore ? (
              <div className="text-center py-6">
                <div className="text-5xl font-bold text-[#fcd535] font-mono">{Math.round(edgeScore.composite_score)}</div>
                <p className="text-sm text-white/50 mt-2">Trading Health Score</p>
                <div className="mt-4 flex justify-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#0ecb81] font-mono">{Math.round(edgeScore.discipline_score)}%</p>
                    <p className="text-[10px] text-white/60">Discipline</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#00B4D8] font-mono">{Math.round(edgeScore.risk_score)}%</p>
                    <p className="text-[10px] text-white/60">Risk Control</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#fcd535] font-mono">{Math.round(edgeScore.emotional_stability_score)}%</p>
                    <p className="text-[10px] text-white/60">Emotional</p>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState title="No health score yet" description="Complete more trades for Risk Guardian to calculate your health score." />
            )}
          </DashboardCardBody>
        </DashboardCard>
      </div>
    </div>
  )
}
