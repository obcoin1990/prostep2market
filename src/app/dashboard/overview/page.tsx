'use client'

import { LayoutDashboard, TrendingUp, Target, Activity, Clock, AlertTriangle, BarChart3, Sparkles, ArrowRight, BookOpen, Cable, Users, Shield, Dna, Loader, RefreshCw } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

const QUICK_ACTIONS = [
  { label: 'Log Trade', href: '/journal/entry', icon: Activity, color: '#0ecb81' },
  { label: 'AI Analysis', href: '/analysis', icon: BarChart3, color: '#00B4D8' },
  { label: 'Risk Guardian', href: '/dashboard/risk-guardian', icon: Shield, color: '#FFC107' },
  { label: 'Trader DNA', href: '/dashboard/trader-dna', icon: Dna, color: '#8A2BE2' },
  { label: 'Education', href: '/dashboard/education', icon: BookOpen, color: '#fcd535' },
  { label: 'Team', href: '/dashboard/team', icon: Users, color: '#0ecb81' },
]

interface Trade {
  id: string
  created_at: string
  instrument: string
  direction: string
  entry_price: number
  exit_price: number | null
  size: number
  outcome: string | null
  pnl: number | null
  r_multiple: number | null
}

interface ActivityLog {
  id: string
  created_at: string
  type: string
  description: string
}

function formatTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const activityIcons: Record<string, { icon: typeof Activity; color: string }> = {
  trade: { icon: Activity, color: '#0ecb81' },
  alert: { icon: AlertTriangle, color: '#FFC107' },
  score: { icon: Sparkles, color: '#00B4D8' },
  achievement: { icon: Target, color: '#8A2BE2' },
  connection: { icon: Cable, color: '#0ecb81' },
}

function getActivityIcon(type: string) {
  return activityIcons[type] ?? { icon: Activity, color: '#9ea3ad' }
}

async function fetchRecentTrades(): Promise<Trade[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  if (error) throw new Error(error.message)
  return data ?? []
}

async function fetchTradeStats() {
  const supabase = createClient()
  const { data: trades, error } = await supabase
    .from('trades')
    .select('outcome, pnl, r_multiple')
  if (error) throw new Error(error.message)

  const total = trades?.length ?? 0
  const wins = trades?.filter(t => t.outcome === 'win').length ?? 0
  const winRate = total > 0 ? (wins / total) * 100 : 0
  const netPnl = trades?.reduce((sum, t) => sum + (t.pnl ?? 0), 0) ?? 0
  const netR = trades?.reduce((sum, t) => sum + (t.r_multiple ?? 0), 0) ?? 0

  return { total, winRate, netPnl, netR }
}

async function fetchActivityLogs(): Promise<ActivityLog[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  if (error) throw new Error(error.message)
  return data ?? []
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm space-y-4">
          <Skeleton className="h-4 w-32" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/4" />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm space-y-4">
          <Skeleton className="h-4 w-28" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  )
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-300">Failed to load dashboard data</p>
          <p className="text-xs text-red-400/80 mt-0.5 truncate">{message}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Retry
        </Button>
      </div>
    </div>
  )
}

export default function DashboardOverviewPage() {
  const {
    data: trades,
    loading: tradesLoading,
    error: tradesError,
    refetch: refetchTrades,
  } = useRealtimeData(fetchRecentTrades, [])

  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useRealtimeData(fetchTradeStats, [])

  const {
    data: activities,
    loading: activitiesLoading,
    error: activitiesError,
    refetch: refetchActivities,
  } = useRealtimeData(fetchActivityLogs, [])

  const loading = tradesLoading || statsLoading || activitiesLoading
  const error = tradesError || statsError || activitiesError

  if (loading) return <LoadingSkeleton />

  const quickStats = [
    { label: 'Total Trades', value: stats?.total ?? 0, icon: Activity, trend: { value: 0, positive: true } },
    { label: 'Win Rate', value: stats ? `${stats.winRate.toFixed(1)}%` : 'N/A', icon: Target, trend: { value: 0, positive: true } },
    { label: 'Net P&L', value: stats ? `${(stats.netR ?? 0) >= 0 ? '+' : ''}${(stats.netR ?? 0).toFixed(1)}R` : 'N/A', icon: TrendingUp, trend: { value: 0, positive: (stats?.netR ?? 0) >= 0 } },
    { label: 'Edge Score', value: '—', icon: Sparkles, trend: undefined },
    { label: 'Best Streak', value: '—', icon: Clock, trend: undefined },
    { label: 'Risk Level', value: '—', icon: AlertTriangle, trend: undefined },
  ]

  const recentTrades = (trades ?? []).map((t) => ({
    type: 'trade' as const,
    desc: `${t.direction === 'long' ? 'Bought' : 'Sold'} ${t.instrument} @ ${t.entry_price}`,
    time: formatTimeAgo(t.created_at),
    icon: Activity,
    color: t.direction === 'long' ? '#0ecb81' : '#f6465d',
  }))

  const activityItems = (activities ?? []).map((a) => {
    const meta = getActivityIcon(a.type)
    return {
      type: a.type,
      desc: a.description,
      time: formatTimeAgo(a.created_at),
      icon: meta.icon,
      color: meta.color,
    }
  })

  const timelineItems = activityItems.length > 0 ? activityItems : recentTrades

  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} onRetry={() => { refetchTrades(); refetchStats(); refetchActivities() }} />}

      <SectionHeader
        title="Dashboard Overview"
        description="Welcome back — here's your trading snapshot"
        icon={LayoutDashboard}
        action={<StatusBadge label="Live" variant="active" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {quickStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} trend={s.trend} variant="compact" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard className="lg:col-span-2">
          <DashboardCardHeader>
            <DashboardCardTitle>Recent Activity</DashboardCardTitle>
          </DashboardCardHeader>
          <DashboardCardBody>
            {timelineItems.length === 0 ? (
              <EmptyState
                icon={<Activity className="w-8 h-8" />}
                title="No activity yet"
                description="Start trading to see your recent activity here."
                variant="compact"
                action={
                  <Link href="/journal/entry">
                    <Button size="sm">Log Your First Trade</Button>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-1">
                {timelineItems.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/5 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${a.color}15` }}>
                      <a.icon className="h-4 w-4" style={{ color: a.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{a.desc}</p>
                      <p className="text-xs text-white/60">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>Quick Actions</DashboardCardTitle>
          </DashboardCardHeader>
          <DashboardCardBody>
            <div className="grid grid-cols-1 gap-2">
              {QUICK_ACTIONS.map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${a.color}15` }}>
                    <a.icon className="h-4 w-4" style={{ color: a.color }} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-white/80 group-hover:text-white">{a.label}</span>
                  <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-white/60" />
                </Link>
              ))}
            </div>
          </DashboardCardBody>
        </DashboardCard>
      </div>

      <div className="rounded-xl border border-[#fcd535]/20 bg-[#fcd535]/5 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fcd535]/15">
            <Sparkles className="h-5 w-5 text-[#fcd535]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">AI Insight</p>
            <p className="text-sm text-white/60 mt-0.5">Your best trading session is London Open with a 72% win rate. Consider focusing high-conviction setups during this window.</p>
          </div>
          <StatusBadge label="New" variant="warning" />
        </div>
      </div>
    </div>
  )
}
