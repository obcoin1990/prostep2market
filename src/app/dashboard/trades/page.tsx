'use client'

import { Activity, TrendingUp, TrendingDown, Search, Filter, ArrowUpRight, Clock, DollarSign, Target, BarChart3, MoreHorizontal, RefreshCw, FileText, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { StatCard } from '@/components/dashboard/StatCard'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

interface Trade {
  id: string
  pair: string
  direction: 'Long' | 'Short'
  entry: number
  exit: number | null
  size: number
  pnl: number | null
  result: string | null
  setup: string | null
  created_at: string
}

async function fetchTrades(): Promise<Trade[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  if (error) throw new Error(error.message)
  return data ?? []
}

async function fetchTradeStats() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('trades')
    .select('outcome, pnl, r_multiple')
  if (error) throw new Error(error.message)
  const total = data?.length ?? 0
  const wins = data?.filter(t => t.outcome === 'win').length ?? 0
  const losses = total - wins
  const winRate = total > 0 ? (wins / total) * 100 : 0
  return { total, wins, losses, winRate }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 rounded-lg bg-white/5 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="p-5 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-white/5 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-300">Failed to load trades</p>
          <p className="text-xs text-red-400/80 mt-0.5">{message}</p>
        </div>
        <button type="button" onClick={onRetry} className="shrink-0 px-3 py-1.5 rounded-lg border border-red-500/30 text-xs text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      </div>
    </div>
  )
}

export default function TradesPage() {
  const { data: trades, loading, error, refetch } = useRealtimeData(fetchTrades, [])
  const { data: stats } = useRealtimeData(fetchTradeStats, [])

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {!error && (
      <>
      <SectionHeader
        title="Trades"
        description="Track and review your trade history"
        icon={Activity}
        action={
          <Link href="/journal/entry">
            <button type="button" className="btn-primary text-sm px-4 py-2">
              Log New Trade
            </button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Trades" value={stats?.total ?? 0} icon={BarChart3} />
        <StatCard label="Win Rate" value={stats ? `${stats.winRate.toFixed(1)}%` : '\u2014'} icon={Target} />
        <StatCard label="Wins" value={stats?.wins ?? 0} icon={TrendingUp} />
        <StatCard label="Losses" value={stats?.losses ?? 0} icon={TrendingDown} />
      </div>

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardTitle>Trade History</DashboardCardTitle>
        </DashboardCardHeader>
        <DashboardCardBody>
          {!trades || trades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-white/50 mb-4" />
              <p className="text-base font-medium text-white/60">No trades recorded yet</p>
              <p className="text-sm text-white/60 mt-1">Start by logging your first trade in the journal.</p>
              <Link href="/journal/entry">
                <button type="button" className="btn-primary text-sm px-4 py-2 mt-4">
                  Log Your First Trade
                </button>
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Pair</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Direction</th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-white/60 uppercase tracking-wider">Entry</th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-white/60 uppercase tracking-wider">Exit</th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-white/60 uppercase tracking-wider">P&L</th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-white/60 uppercase tracking-wider">Result</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">Setup</th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-white/60 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => {
                    const isPositive = t.pnl != null && t.pnl >= 0
                    return (
                      <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-medium text-white">{t.pair}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            {t.direction === 'Long' ? (
                              <TrendingUp className="h-3.5 w-3.5 text-[#0ecb81]" />
                            ) : (
                              <TrendingDown className="h-3.5 w-3.5 text-[#f6465d]" />
                            )}
                            <span className="text-sm text-white/80">{t.direction}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-white/80">{t.entry}</td>
                        <td className="py-3 px-4 text-right font-mono text-white/80">{t.exit ?? '\u2014'}</td>
                        <td className={`py-3 px-4 text-right font-mono font-semibold ${isPositive ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{t.pnl ?? '\u2014'}</td>
                        <td className="py-3 px-4 text-center">
                          <StatusBadge
                            label={t.result ?? '\u2014'}
                            variant={t.result === 'win' ? 'success' : t.result === 'loss' ? 'danger' : 'idle'}
                          />
                        </td>
                        <td className="py-3 px-4 text-sm text-white/60">{t.setup ?? '\u2014'}</td>
                        <td className="py-3 px-4 text-right text-sm text-white/60">
                          {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </DashboardCardBody>
      </DashboardCard>
      </>
      )}
    </div>
  )
}
