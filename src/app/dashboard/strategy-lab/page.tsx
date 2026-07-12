'use client'

import { FlaskConical, TrendingUp, Target, BarChart3, Plus, ArrowRight, CheckCircle2, Shield } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

function formatPnl(val: number | null | undefined): string {
  if (val == null) return '0R'
  const prefix = val > 0 ? '+' : ''
  return `${prefix}${val}R`
}

function formatWinRate(val: number | null | undefined): string {
  if (val == null) return '0%'
  return `${Math.round(val)}%`
}

export default function StrategyLabDashboardPage() {
  const supabase = createClient()

  const { data: strategies, loading: strategiesLoading } = useRealtimeData<any[]>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data } = await supabase
        .from('strategies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      return data ?? []
    },
    [],
  )

  const { data: backtests, loading: backtestsLoading } = useRealtimeData<any[]>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data } = await supabase
        .from('strategy_backtests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      return data ?? []
    },
    [],
  )

  const loading = strategiesLoading || backtestsLoading
  const strategyList = strategies ?? []
  const backtestList = backtests ?? []

  const activeCount = strategyList.filter((s: any) => s.status === 'active').length
  const totalBacktests = backtestList.length
  const avgWinRate = strategyList.length > 0
    ? Math.round(strategyList.reduce((sum: number, s: any) => sum + (s.win_rate ?? 0), 0) / strategyList.length)
    : 0
  const bestStrategy = strategyList.length > 0
    ? strategyList.reduce((best: any, s: any) => (s.net_pnl_r ?? 0) > (best.net_pnl_r ?? 0) ? s : best)
    : null

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Strategy Lab" description="Build, test, and refine your trading strategies" icon={FlaskConical} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (strategyList.length === 0) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Strategy Lab"
          description="Build, test, and refine your trading strategies"
          icon={FlaskConical}
          action={
            <Link href="/strategy-lab/builder">
              <button className="rounded-lg bg-[#fcd535] px-3 py-1.5 text-xs font-semibold text-[#0b0e11] hover:bg-[#fde04e] transition-colors">
                <Plus className="h-3.5 w-3.5 inline mr-1" />
                New Strategy
              </button>
            </Link>
          }
        />
        <DashboardCard>
          <DashboardCardBody>
            <EmptyState
              title="No strategies yet"
              description="Create your first trading strategy to start backtesting and tracking performance."
              action={
                <Link href="/strategy-lab/builder">
                  <button className="rounded-lg bg-[#fcd535] px-4 py-2 text-sm font-semibold text-[#0b0e11] hover:bg-[#fde04e] transition-colors">
                    <Plus className="h-4 w-4 inline mr-1" />
                    Create Strategy
                  </button>
                </Link>
              }
            />
          </DashboardCardBody>
        </DashboardCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Strategy Lab"
        description="Build, test, and refine your trading strategies"
        icon={FlaskConical}
        action={
          <Link href="/strategy-lab/builder">
            <button className="rounded-lg bg-[#fcd535] px-3 py-1.5 text-xs font-semibold text-[#0b0e11] hover:bg-[#fde04e] transition-colors">
              <Plus className="h-3.5 w-3.5 inline mr-1" />
              New Strategy
            </button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Strategies" value={activeCount} icon={Target} />
        <StatCard label="Total Backtests" value={totalBacktests} icon={BarChart3} />
        <StatCard label="Avg Win Rate" value={`${avgWinRate}%`} icon={TrendingUp} />
        <StatCard label="Best Performer" value={formatPnl(bestStrategy?.net_pnl_r)} icon={CheckCircle2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <DashboardCardHeader className="flex items-center justify-between">
            <DashboardCardTitle>Your Strategies</DashboardCardTitle>
            <button className="text-xs text-[#fcd535] hover:underline">Manage</button>
          </DashboardCardHeader>
          <DashboardCardBody>
            <div className="space-y-3">
              {strategyList.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border border-white/10 p-4 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${s.color ?? '#fcd535'}15` }}>
                      <FlaskConical className="h-4 w-4" style={{ color: s.color ?? '#fcd535' }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{s.name}</p>
                      <p className="text-xs text-white/60">{s.strategy_type ?? 'Custom'} · {s.total_trades ?? 0} trades</p>
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-sm font-mono font-semibold text-white">{formatWinRate(s.win_rate)}</p>
                    <p className="text-xs font-mono" style={{ color: (s.net_pnl_r ?? 0) >= 0 ? '#0ecb81' : '#f6465d' }}>{formatPnl(s.net_pnl_r)}</p>
                  </div>
                  <StatusBadge
                    label={s.status}
                    variant={s.status === 'active' ? 'active' : s.status === 'paused' ? 'warning' : 'danger'}
                  />
                </div>
              ))}
            </div>
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader className="flex items-center justify-between">
            <DashboardCardTitle>Backtest Results</DashboardCardTitle>
            <button className="text-xs text-[#fcd535] hover:underline">View All</button>
          </DashboardCardHeader>
          <DashboardCardBody>
            {backtestList.length === 0 ? (
              <EmptyState
                title="No backtests yet"
                description="Run your first backtest to see results here."
              />
            ) : (
              <div className="space-y-3">
                {backtestList.map((b: any) => (
                  <div key={b.id} className="rounded-lg border border-white/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-white">{b.name}</p>
                      <StatusBadge label={(b.sharpe_ratio ?? 0) >= 2 ? "Strong" : (b.sharpe_ratio ?? 0) >= 1.5 ? "Good" : "Average"} variant={(b.sharpe_ratio ?? 0) >= 2 ? 'success' : (b.sharpe_ratio ?? 0) >= 1.5 ? 'info' : 'warning'} />
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-xs text-white/60">
                      <div><span className="block text-white/60">{b.total_trades ?? 0}</span>Trades</div>
                      <div><span className="block text-white/60">{formatWinRate(b.win_rate)}</span>Win Rate</div>
                      <div><span className="block text-[#0ecb81]">{formatPnl(b.net_pnl_r)}</span>P&L</div>
                      <div><span className="block text-[#f6465d]">{b.max_drawdown_pct != null ? `-${b.max_drawdown_pct}%` : '—'}</span>Max DD</div>
                      <div><span className="block text-white/60">{b.sharpe_ratio ?? '—'}</span>Sharpe</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>
      </div>

      {bestStrategy && (
        <div className="rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/5 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00B4D8]/15">
              <Shield className="h-5 w-5 text-[#00B4D8]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Strategy Tip</p>
              <p className="text-sm text-white/60 mt-0.5">
                Your {bestStrategy.name} strategy is performing well with a Sharpe of {bestStrategy.sharpe_ratio ?? 'N/A'}.
                {(bestStrategy.sharpe_ratio ?? 0) >= 1.5
                  ? ' Consider paper-trading an improved version before going live.'
                  : ' Focus on refining entry and exit rules to improve consistency.'}
              </p>
            </div>
            <Link href={`/strategy-lab/simulate/${encodeURIComponent(bestStrategy.name)}`}>
              <button className="rounded-lg border border-[#00B4D8]/30 px-3 py-1.5 text-xs text-[#00B4D8] hover:bg-[#00B4D8]/10 transition-colors">
                Simulate <ArrowRight className="h-3 w-3 inline ml-1" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
