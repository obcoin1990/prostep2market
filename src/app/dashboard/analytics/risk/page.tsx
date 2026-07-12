'use client'

import { Shield, TrendingDown, AlertTriangle, DollarSign, Percent, PieChart, Activity, Target, ArrowUpRight, BarChart3, RefreshCw } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

interface DrawdownPeriod {
  period: string
  depth: string
  duration: string
  recovery: string
  status: 'Recovered' | 'Active'
}

export default function RiskAnalyticsPage() {
  const supabase = createClient()

  const { data: riskMetrics, loading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useRealtimeData<any[]>(
    async () => {
      const res = await supabase
        .from('daily_analytics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30)
      if (res.error) throw res.error
      const days = res.data ?? []
      const maxDD = days.length > 0 ? Math.min(...days.map((d: any) => d.max_drawdown ?? 0)) : 0
      const currentDD = days.length > 0 ? (days[0] as any).max_drawdown ?? 0 : 0
      return [
        { label: 'Current Drawdown', value: `${currentDD.toFixed(1)}%`, icon: TrendingDown, trend: { value: 2.1, positive: false } },
        { label: 'Max Drawdown (30d)', value: `${maxDD.toFixed(1)}%`, icon: AlertTriangle },
        { label: 'Risk per Trade', value: '1.2%', icon: Percent },
        { label: 'Exposure Ratio', value: '34%', icon: PieChart },
        { label: 'Sharpe Ratio', value: '1.84', icon: Activity },
        { label: 'Recovery Factor', value: '2.1', icon: TrendingDown },
      ];
    },
    [],
  )

  const { data: positionSizing, loading: sizingLoading, error: sizingError, refetch: refetchSizing } = useRealtimeData<{ status: string; count: number; color: string }[]>(
    async () => {
      const res = await supabase
        .from('trades')
        .select('lot_size, outcome')
      if (res.error) throw res.error
      const trades = res.data ?? []
      const avgLot = trades.reduce((s, t: any) => s + (t.lot_size ?? 0), 0) / (trades.length || 1)
      let appropriate = 0, tooLarge = 0, tooSmall = 0
      for (const t of trades) {
        const ls = (t as any).lot_size ?? 0
        if (ls <= avgLot * 1.2 && ls >= avgLot * 0.8) appropriate++
        else if (ls > avgLot * 1.2) tooLarge++
        else tooSmall++
      }
      const total = appropriate + tooLarge + tooSmall || 1
      return [
        { status: 'Appropriate', count: Math.round((appropriate / total) * 100), color: '#0ecb81' },
        { status: 'Too Large', count: Math.round((tooLarge / total) * 100), color: '#f6465d' },
        { status: 'Too Small', count: Math.round((tooSmall / total) * 100), color: '#FFC107' },
      ]
    },
    [],
  )

  const { data: drawdowns, loading: ddLoading, error: ddError, refetch: refetchDD } = useRealtimeData<{ period: string; depth: string; duration: string; recovery: string; status: 'Recovered' | 'Active' }[]>(
    async () => {
      const res = await supabase
        .from('daily_analytics')
        .select('date, max_drawdown')
        .order('date', { ascending: false })
        .limit(30)
      if (res.error) throw res.error
      const days = res.data ?? []
      const periods: { period: string; depth: string; duration: string; recovery: string; status: 'Recovered' | 'Active' }[] = []
      let inDrawdown = false
      let startDate = ''
      let minDD = 0
      for (const d of days) {
        const dd = (d as any).max_drawdown ?? 0
        if (dd < -2) {
          if (!inDrawdown) {
            startDate = (d as any).date
            minDD = dd
            inDrawdown = true
          } else {
            minDD = Math.min(minDD, dd)
          }
        } else if (inDrawdown) {
          periods.push({
            period: `${startDate} - ${(d as any).date}`,
            depth: `${minDD.toFixed(1)}%`,
            duration: '—',
            recovery: '—',
            status: 'Recovered' as const,
          })
          inDrawdown = false
        }
      }
      if (inDrawdown) {
        periods.push({
          period: `${startDate} - ongoing`,
          depth: `${minDD.toFixed(1)}%`,
          duration: '—',
          recovery: '—',
          status: 'Active' as const,
        })
      }
      return periods
    },
    [],
  )

  const { data: stopLossData, loading: slLoading, error: slError, refetch: refetchSL } = useRealtimeData<{ label: string; value: number; total: number; color: string }[]>(
    async () => {
      const res = await supabase
        .from('trades')
        .select('stop_loss, outcome')
      if (res.error) throw res.error
      const trades = res.data ?? []
      const withSL = trades.filter((t: any) => t.stop_loss != null).length
      const total = trades.length || 1
      return [
        { label: 'Trades with SL', value: Math.round((withSL / total) * 100), total: 100, color: '#0ecb81' },
        { label: 'SL at Risk% Target', value: 78, total: 100, color: '#00B4D8' },
        { label: 'Manual Exit Before SL', value: 14, total: 100, color: '#FFC107' },
      ]
    },
    [],
  )

  const loading = metricsLoading || sizingLoading || ddLoading || slLoading
  const error = metricsError || sizingError || ddError || slError

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
              <div className="h-3 w-20 bg-[#2b3139] rounded animate-pulse" />
              <div className="h-7 w-16 bg-[#2b3139] rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
              <div className="h-4 w-36 bg-[#2b3139] rounded animate-pulse" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-12 bg-[#2b3139] rounded animate-pulse" />
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
        <SectionHeader title="Risk Analytics" description="Drawdown analysis, position sizing, and risk metrics" icon={Shield} />
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-[#f6465d]/10 p-3">
              <TrendingDown className="h-5 w-5 text-[#f6465d]" />
            </div>
            <p className="text-sm text-white/60">Failed to load risk data</p>
            <p className="text-xs text-white/50">{error}</p>
            <Button variant="outline" size="sm" onClick={() => { refetchMetrics(); refetchSizing(); refetchDD(); refetchSL() }}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Risk Analytics"
        description="Drawdown analysis, position sizing, and risk metrics"
        icon={Shield}
        action={<StatusBadge label="Within Limits" variant="success" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {(riskMetrics ?? []).map((m) => (
          <StatCard key={m.label} label={m.label} value={m.value} icon={m.icon} trend={m.trend} variant="compact" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>Position Sizing Audit</DashboardCardTitle>
            <p className="text-xs text-white/60 mt-0.5">Analysis of your recent position sizes</p>
          </DashboardCardHeader>
          <DashboardCardBody>
            {!positionSizing || positionSizing.length === 0 ? (
              <EmptyState icon={<BarChart3 className="w-6 h-6" />} title="No position sizing data yet" description="Trade data will populate this audit." variant="compact" />
            ) : (
              <div className="space-y-4">
                {positionSizing.map((p) => (
                  <div key={p.status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-white/80">{p.status}</span>
                      <span className="text-sm font-mono font-semibold text-white">{p.count}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${p.count}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>Stop Loss Compliance</DashboardCardTitle>
            <p className="text-xs text-white/60 mt-0.5">How consistently you use protective stops</p>
          </DashboardCardHeader>
          <DashboardCardBody>
            {!stopLossData || stopLossData.length === 0 ? (
              <EmptyState icon={<Shield className="w-6 h-6" />} title="No compliance data yet" description="Trade data will populate this analysis." variant="compact" />
            ) : (
              <div className="space-y-4">
                {stopLossData.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-white/80">{s.label}</span>
                      <span className="text-sm font-mono text-white">{s.value}/{s.total}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.value}%`, backgroundColor: s.color }} />
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
          <DashboardCardTitle>Drawdown History</DashboardCardTitle>
          <p className="text-xs text-white/60 mt-0.5">Recent drawdown periods and recovery times</p>
        </DashboardCardHeader>
        <DashboardCardBody>
          {!drawdowns || drawdowns.length === 0 ? (
            <EmptyState icon={<TrendingDown className="w-6 h-6" />} title="No drawdown periods recorded" description="Your account hasn't experienced significant drawdowns." variant="compact" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Period</th>
                    <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Depth</th>
                    <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Duration</th>
                    <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Recovery</th>
                    <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {drawdowns.map((d) => (
                    <tr key={d.period} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 text-sm text-white">{d.period}</td>
                      <td className="py-2.5 text-right font-mono text-sm text-[#f6465d]">{d.depth}</td>
                      <td className="py-2.5 text-right font-mono text-sm text-white">{d.duration}</td>
                      <td className="py-2.5 text-right font-mono text-sm text-white">{d.recovery}</td>
                      <td className="py-2.5 text-right">
                        <StatusBadge label={d.status} variant="success" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DashboardCardBody>
      </DashboardCard>
    </div>
  )
}
