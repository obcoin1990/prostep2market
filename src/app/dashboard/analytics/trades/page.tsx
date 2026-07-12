'use client'

import { BarChart3, TrendingUp, TrendingDown, Target, Activity, Clock, DollarSign, RefreshCw } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

interface PairBreakdown {
  pair: string
  trades: number
  winRate: number
  avgRR: number
  pnl: string
  winColor: string
  lossColor: string
}

interface WinLossBucket {
  range: string
  wins: number
  losses: number
}

interface TimeBasedStat {
  period: string
  trades: number
  winRate: number
  avgRR: number
  grade: string
  gradeColor: string
}

export default function TradesAnalyticsPage() {
  const supabase = createClient()

  const { data: pairData, loading: pairLoading, error: pairError, refetch: refetchPair } = useRealtimeData<PairBreakdown[]>(
    async () => {
      const res = await supabase
        .from('trades')
        .select('symbol, outcome, r_multiple, pnl')
      if (res.error) throw res.error
      const trades = res.data ?? []
      const map = new Map<string, { trades: number; wins: number; totalRR: number; totalPnl: number }>()
      for (const t of trades) {
        const sym = t.symbol ?? 'Unknown'
        const cur = map.get(sym) ?? { trades: 0, wins: 0, totalRR: 0, totalPnl: 0 }
        cur.trades++
        if (t.outcome === 'win') cur.wins++
        cur.totalRR += t.r_multiple ?? 0
        cur.totalPnl += t.pnl ?? 0
        map.set(sym, cur)
      }
      return Array.from(map.entries()).map(([pair, v]) => ({
        pair,
        trades: v.trades,
        winRate: v.trades > 0 ? Math.round((v.wins / v.trades) * 100) : 0,
        avgRR: v.trades > 0 ? Math.round((v.totalRR / v.trades) * 10) / 10 : 0,
        pnl: `${v.totalPnl >= 0 ? '+' : ''}${v.totalPnl.toFixed(1)}R`,
        winColor: v.totalPnl >= 0 ? '#0ecb81' : '#f6465d',
        lossColor: '#f6465d',
      }))
    },
    [],
  )

  const { data: winLossData, loading: winLossLoading, error: winLossError, refetch: refetchWinLoss } = useRealtimeData<{ range: string; wins: number; losses: number }[]>(
    async () => {
      const res = await supabase
        .from('trades')
        .select('r_multiple, outcome')
      if (res.error) throw res.error
      const trades = res.data ?? []
      const buckets: Record<string, { wins: number; losses: number }> = {
        '0-5R': { wins: 0, losses: 0 },
        '5-10R': { wins: 0, losses: 0 },
        '10-20R': { wins: 0, losses: 0 },
        '20-50R': { wins: 0, losses: 0 },
        '50R+': { wins: 0, losses: 0 },
      }
      for (const t of trades) {
        const rr = Math.abs(t.r_multiple ?? 0)
        const key = rr <= 5 ? '0-5R' : rr <= 10 ? '5-10R' : rr <= 20 ? '10-20R' : rr <= 50 ? '20-50R' : '50R+'
        if (t.outcome === 'win') buckets[key].wins++
        else if (t.outcome === 'loss') buckets[key].losses++
      }
      return Object.entries(buckets).map(([range, v]) => ({ range, ...v }))
    },
    [],
  )

  const { data: timeData, loading: timeLoading, error: timeError, refetch: refetchTime } = useRealtimeData<{ period: string; trades: number; winRate: number; avgRR: number }[]>(
    async () => {
      const res = await supabase
        .from('trades')
        .select('created_at, outcome, r_multiple')
      if (res.error) throw res.error
      const trades = res.data ?? []
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const map = new Map<string, { trades: number; wins: number; totalRR: number }>()
      for (const t of trades) {
        const day = days[new Date(t.created_at).getDay()]
        const cur = map.get(day) ?? { trades: 0, wins: 0, totalRR: 0 }
        cur.trades++
        if (t.outcome === 'win') cur.wins++
        cur.totalRR += t.r_multiple ?? 0
        map.set(day, cur)
      }
      return Array.from(map.entries()).map(([period, v]) => ({
        period,
        trades: v.trades,
        winRate: v.trades > 0 ? Math.round((v.wins / v.trades) * 100) : 0,
        avgRR: v.trades > 0 ? Math.round((v.totalRR / v.trades) * 10) / 10 : 0,
      }))
    },
    [],
  )

  const loading = pairLoading || winLossLoading || timeLoading
  const error = pairError || winLossError || timeError

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
              <div className="h-4 w-32 bg-[#2b3139] rounded animate-pulse" />
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-8 bg-[#2b3139] rounded animate-pulse" />
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
        <SectionHeader title="Trade Analytics" description="Detailed breakdown by instrument, size, and time" icon={BarChart3} />
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-[#f6465d]/10 p-3">
              <TrendingDown className="h-5 w-5 text-[#f6465d]" />
            </div>
            <p className="text-sm text-white/60">Failed to load trade analytics</p>
            <p className="text-xs text-white/50">{error}</p>
            <Button variant="outline" size="sm" onClick={() => { refetchPair(); refetchWinLoss(); refetchTime() }}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const totalTrades = (pairData ?? []).reduce((sum, p) => sum + p.trades, 0)
  const totalWins = (pairData ?? []).reduce((sum, p) => sum + Math.round(p.trades * p.winRate / 100), 0)
  const totalLosses = totalTrades - totalWins
  const avgTradeR = pairData && pairData.length > 0
    ? (pairData.reduce((s, p) => s + p.avgRR, 0) / pairData.length).toFixed(1)
    : '0'

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Trade Analytics"
        description="Detailed breakdown by instrument, size, and time"
        icon={BarChart3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Trades" value={totalTrades} icon={Activity} />
        <StatCard label="Winning Trades" value={totalWins} icon={TrendingUp} />
        <StatCard label="Losing Trades" value={totalLosses} icon={TrendingDown} />
        <StatCard label="Avg Trade R" value={`+${avgTradeR}R`} icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>Pair Performance</DashboardCardTitle>
            <p className="text-xs text-white/60 mt-0.5">Win rate, RR, and P&L by currency pair</p>
          </DashboardCardHeader>
          <DashboardCardBody>
            {!pairData || pairData.length === 0 ? (
              <EmptyState icon={<BarChart3 className="w-6 h-6" />} title="No pair data yet" description="Start trading to see pair performance." variant="compact" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Pair</th>
                      <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Trades</th>
                      <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Win Rate</th>
                      <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Avg RR</th>
                      <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {pairData.map((p) => (
                      <tr key={p.pair} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 text-sm font-medium text-white">{p.pair}</td>
                        <td className="py-2.5 text-right font-mono text-sm text-white">{p.trades}</td>
                        <td className="py-2.5 text-right">
                          <span className="font-mono text-sm font-semibold" style={{ color: p.winRate >= 60 ? '#0ecb81' : '#f6465d' }}>{p.winRate}%</span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-sm text-white">{p.avgRR}</td>
                        <td className="py-2.5 text-right font-mono text-sm font-semibold" style={{ color: p.pnl.startsWith('+') ? '#0ecb81' : '#f6465d' }}>{p.pnl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>Win / Loss Distribution</DashboardCardTitle>
            <p className="text-xs text-white/60 mt-0.5">Trade outcomes by R-multiple range</p>
          </DashboardCardHeader>
          <DashboardCardBody>
            {!winLossData || winLossData.length === 0 ? (
              <EmptyState icon={<BarChart3 className="w-6 h-6" />} title="No distribution data yet" description="Trade data will populate this chart." variant="compact" />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-white/60 pb-1 border-b border-white/10">
                  <span>Range</span>
                  <div className="flex gap-6">
                    <span>Wins</span>
                    <span>Losses</span>
                  </div>
                </div>
                {winLossData.map((d) => {
                  const maxWins = Math.max(...winLossData.map(x => x.wins), 1)
                  const maxLosses = Math.max(...winLossData.map(x => x.losses), 1)
                  return (
                    <div key={d.range} className="flex items-center justify-between">
                      <span className="text-sm text-white/80 w-16">{d.range}</span>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full bg-[#0ecb81]" style={{ width: `${(d.wins / maxWins) * 100}%` }} />
                        </div>
                        <span className="text-xs font-mono text-[#0ecb81] w-8 text-right">{d.wins}</span>
                        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full bg-[#f6465d]" style={{ width: `${(d.losses / maxLosses) * 100}%` }} />
                        </div>
                        <span className="text-xs font-mono text-[#f6465d] w-8 text-right">{d.losses}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>
      </div>

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardTitle>Performance by Day of Week</DashboardCardTitle>
          <p className="text-xs text-white/60 mt-0.5">Identify your strongest and weakest trading days</p>
        </DashboardCardHeader>
        <DashboardCardBody>
          {!timeData || timeData.length === 0 ? (
            <EmptyState icon={<Clock className="w-6 h-6" />} title="No time-based data yet" description="Trade data will populate this breakdown." variant="compact" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Day</th>
                    <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Trades</th>
                    <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Win Rate</th>
                    <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Avg RR</th>
                    <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {timeData.map((d) => {
                    const grade = d.winRate >= 70 ? 'A' : d.winRate >= 60 ? 'B' : d.winRate >= 55 ? 'C' : 'D'
                    const gradeColor = grade === 'A' ? '#0ecb81' : grade === 'B' ? '#00B4D8' : grade === 'C' ? '#FFC107' : '#f6465d'
                    return (
                      <tr key={d.period} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 text-sm font-medium text-white">{d.period}</td>
                        <td className="py-2.5 text-right font-mono text-sm text-white">{d.trades}</td>
                        <td className="py-2.5 text-right font-mono text-sm" style={{ color: d.winRate >= 60 ? '#0ecb81' : '#f6465d' }}>{d.winRate}%</td>
                        <td className="py-2.5 text-right font-mono text-sm text-white">{d.avgRR}</td>
                        <td className="py-2.5 text-right font-mono text-sm font-bold" style={{ color: gradeColor }}>{grade}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </DashboardCardBody>
      </DashboardCard>
    </div>
  )
}
