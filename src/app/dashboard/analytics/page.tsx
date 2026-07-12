'use client'

import { BarChart3, TrendingUp, TrendingDown, Target, Activity, Clock, ArrowUpRight, RefreshCw } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

interface PairStat {
  pair: string
  trades: number
  winRate: number
  avgRR: number
  pnl: string
  color: string
}

interface SessionStat {
  session: string
  trades: number
  winRate: number
  avgRR: number
  grade: string
}

interface BehaviorPattern {
  pattern: string
  frequency: string
  impact: string
  severity: string
  color: string
}

function LoadingSkeleton() {
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

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="rounded-full bg-[#f6465d]/10 p-3">
          <TrendingDown className="h-5 w-5 text-[#f6465d]" />
        </div>
        <p className="text-sm text-white/60">Failed to load data</p>
        <p className="text-xs text-white/50">{message}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Retry
        </Button>
      </div>
    </div>
  )
}

export default function AnalyticsDashboardPage() {
  const supabase = createClient()

  const { data: pairData, loading: pairLoading, error: pairError, refetch: refetchPair } = useRealtimeData<PairStat[]>(
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
        color: v.totalPnl >= 0 ? '#0ecb81' : '#f6465d',
      }))
    },
    [],
  )

  const { data: sessionData, loading: sessionLoading, error: sessionError, refetch: refetchSession } = useRealtimeData<SessionStat[]>(
    async () => {
      const res = await supabase
        .from('trades')
        .select('session, outcome, r_multiple')
        .not('session', 'is', null)
      if (res.error) throw res.error
      const trades = res.data ?? []
      const map = new Map<string, { trades: number; wins: number; totalRR: number }>()
      for (const t of trades) {
        const sess = t.session ?? 'Unknown'
        const cur = map.get(sess) ?? { trades: 0, wins: 0, totalRR: 0 }
        cur.trades++
        if (t.outcome === 'win') cur.wins++
        cur.totalRR += t.r_multiple ?? 0
        map.set(sess, cur)
      }
          return Array.from(map.entries()).map(([session, v]) => {
            const winRate = v.trades > 0 ? Math.round((v.wins / v.trades) * 100) : 0
            return {
              session,
              trades: v.trades,
              winRate,
              avgRR: v.trades > 0 ? Math.round((v.totalRR / v.trades) * 10) / 10 : 0,
              grade: winRate >= 70 ? 'A' : winRate >= 60 ? 'B' : winRate >= 50 ? 'C' : 'D',
            }
          })
    },
    [],
  )

  const { data: behaviorData, loading: behaviorLoading, error: behaviorError, refetch: refetchBehavior } = useRealtimeData<BehaviorPattern[]>(
    async () => {
      const res = await supabase
        .from('behavioral_patterns')
        .select('*')
        .order('detected_at', { ascending: false })
      if (res.error) throw res.error
      return (res.data ?? []).map((b: any) => ({
        pattern: b.pattern_name,
        frequency: `${b.frequency}x this month`,
        impact: `${b.impact >= 0 ? '+' : ''}${b.impact.toFixed(1)}R avg`,
        severity: b.severity,
        color: b.severity === 'High' ? '#f6465d' : b.severity === 'Medium' ? '#FFC107' : '#00B4D8',
      }))
    },
    [],
  )

  const loading = pairLoading || sessionLoading || behaviorLoading
  const error = pairError || sessionError || behaviorError

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
        <SectionHeader title="Analytics & Trading Data" description="Deep analysis of your trading performance and patterns" icon={BarChart3} />
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-[#f6465d]/10 p-3">
              <TrendingDown className="h-5 w-5 text-[#f6465d]" />
            </div>
            <p className="text-sm text-white/60">Failed to load analytics data</p>
            <p className="text-xs text-white/50">{error}</p>
            <Button variant="outline" size="sm" onClick={() => { refetchPair(); refetchSession(); refetchBehavior() }}>
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
  const overallWinRate = totalTrades > 0 ? Math.round((totalWins / totalTrades) * 100) : 0
  const bestDay = (sessionData ?? []).reduce((best, s) => s.winRate > (best?.winRate ?? 0) ? s : best, null as SessionStat | null)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analytics & Trading Data"
        description="Deep analysis of your trading performance and patterns"
        icon={BarChart3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Win Rate" value={`${overallWinRate}%`} icon={Target} trend={{ value: 3, positive: true }} />
        <StatCard label="Avg RR" value={pairData && pairData.length > 0 ? (pairData.reduce((s, p) => s + p.avgRR, 0) / pairData.length).toFixed(1) : '0'} icon={TrendingUp} />
        <StatCard label="Total Trades" value={totalTrades} icon={Activity} />
        <StatCard label="Best Day" value={bestDay?.session ?? '—'} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>Pair Performance</DashboardCardTitle>
            <p className="text-xs text-white/60 mt-0.5">Win rate and profitability by currency pair</p>
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
            <DashboardCardTitle>Session Analysis</DashboardCardTitle>
            <p className="text-xs text-white/60 mt-0.5">Performance breakdown by trading session</p>
          </DashboardCardHeader>
          <DashboardCardBody>
            {!sessionData || sessionData.length === 0 ? (
              <EmptyState icon={<Clock className="w-6 h-6" />} title="No session data yet" description="Trades with session tags will appear here." variant="compact" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Session</th>
                      <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Trades</th>
                      <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Win Rate</th>
                      <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">RR</th>
                      <th className="text-right py-2 font-medium text-[10px] text-white/60 uppercase tracking-wider">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {sessionData.map((s) => (
                      <tr key={s.session} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 text-sm text-white">{s.session}</td>
                        <td className="py-2.5 text-right font-mono text-sm text-white">{s.trades}</td>
                        <td className="py-2.5 text-right font-mono text-sm" style={{ color: s.winRate >= 60 ? '#0ecb81' : '#f6465d' }}>{s.winRate}%</td>
                        <td className="py-2.5 text-right font-mono text-sm text-white">{s.avgRR}</td>
                        <td className="py-2.5 text-right">
                          <span className="font-mono text-sm font-bold" style={{ color: s.grade === 'A' || s.grade === 'A-' ? '#0ecb81' : s.grade.startsWith('C') ? '#FFC107' : '#f6465d' }}>{s.grade}</span>
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

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardTitle>Behavioral Pattern Detection</DashboardCardTitle>
          <p className="text-xs text-white/60 mt-0.5">AI-detected behavioral patterns affecting your performance</p>
        </DashboardCardHeader>
        <DashboardCardBody>
          {!behaviorData || behaviorData.length === 0 ? (
            <EmptyState icon={<Activity className="w-6 h-6" />} title="No patterns detected" description="AI continuously monitors for new patterns." variant="compact" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {behaviorData.map((b) => (
                <div key={b.pattern} className="rounded-lg border border-white/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{b.pattern}</span>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${b.color}15`, color: b.color }}>
                      {b.severity}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/60">Frequency</span>
                      <span className="text-white/80">{b.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Avg Impact</span>
                      <span className="font-mono text-white/80">{b.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-white/10 p-4 flex items-center justify-center text-center">
                <div>
                  <ArrowUpRight className="h-5 w-5 text-white/50 mx-auto mb-1" />
                  <p className="text-xs text-white/50">AI continuously monitors for new patterns</p>
                </div>
              </div>
            </div>
          )}
        </DashboardCardBody>
      </DashboardCard>
    </div>
  )
}
