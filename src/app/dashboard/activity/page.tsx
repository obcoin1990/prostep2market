'use client'

import { Activity, Clock, Filter, ArrowUpRight, AlertTriangle, Target, User, Cable, BookOpen, Sparkles, Shield, Search, TrendingDown, RefreshCw } from 'lucide-react'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const FILTERS = ['All', 'Trades', 'Alerts', 'Education', 'Sync', 'Settings']

const activityIconMap: Record<string, { icon: any; color: string }> = {
  trade: { icon: Activity, color: '#0ecb81' },
  alert: { icon: AlertTriangle, color: '#FFC107' },
  score: { icon: Sparkles, color: '#00B4D8' },
  session: { icon: Clock, color: '#8A2BE2' },
  auth: { icon: User, color: '#fcd535' },
  sync: { icon: Cable, color: '#0ecb81' },
  education: { icon: BookOpen, color: '#fcd535' },
  strategy: { icon: Shield, color: '#00B4D8' },
  guardian: { icon: Shield, color: '#FFC107' },
  connection: { icon: Cable, color: '#0ecb81' },
  team: { icon: User, color: '#00B4D8' },
  report: { icon: Target, color: '#fcd535' },
  setting: { icon: Shield, color: '#8A2BE2' },
}

export default function ActivityPage() {
  const supabase = createClient()

  const { data: activities, loading, error, refetch } = useRealtimeData<any[]>(
    async () => {
      const res = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (res.error) throw res.error
      return (res.data ?? []).map((a: any) => {
        const meta = activityIconMap[a.type] ?? { icon: Activity, color: '#9ea3ad' }
        const date = new Date(a.created_at)
        const now = new Date()
        const isToday = date.toDateString() === now.toDateString()
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        const isYesterday = date.toDateString() === yesterday.toDateString()
        return {
          time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
              date: isToday ? 'Today' : isYesterday ? 'Yesterday' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              desc: a.description,
              type: a.type,
              icon: meta.icon,
              color: meta.color,
            }
          })
      },
    [],
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
          <div className="h-4 w-32 bg-[#2b3139] rounded animate-pulse" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#2b3139] animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 bg-[#2b3139] rounded animate-pulse" />
                <div className="h-2.5 w-1/3 bg-[#2b3139] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Activity Center" description="Complete history of your account activity and trading log" icon={Activity} />
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-[#f6465d]/10 p-3">
              <TrendingDown className="h-5 w-5 text-[#f6465d]" />
            </div>
            <p className="text-sm text-white/60">Failed to load activity</p>
            <p className="text-xs text-white/50">{error}</p>
            <Button variant="outline" size="sm" onClick={refetch}>
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
        title="Activity Center"
        description="Complete history of your account activity and trading log"
        icon={Activity}
        action={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/60" />
              <input
                type="text"
                placeholder="Search activity..."
                className="w-40 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 pl-8 text-xs text-white placeholder:text-white/50 outline-none focus:border-[#fcd535]/50"
              />
            </div>
            <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5 transition-colors">
              <Filter className="h-3.5 w-3.5 inline mr-1" />
              Filter
            </button>
          </div>
        }
      />

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              f === 'All' ? 'bg-[#fcd535]/15 text-[#fcd535]' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <DashboardCard padding="none">
        <DashboardCardBody>
          {!activities || activities.length === 0 ? (
            <EmptyState
              icon={<Activity className="w-8 h-8" />}
              title="No activity yet"
              description="Start trading to see your activity log here."
              action={
                <Link href="/journal/entry">
                  <Button size="sm">Log Your First Trade</Button>
                </Link>
              }
            />
          ) : (
            <div className="divide-y divide-white/5">
              {activities.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${a.color}15` }}>
                    <a.icon className="h-4 w-4" style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{a.desc}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">{a.type}</span>
                      <span className="text-white/50">·</span>
                      <span className="text-xs text-white/60">{a.time}</span>
                      <span className="text-white/50">·</span>
                      <span className="text-xs text-white/60">{a.date}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-white/50 mt-1.5" />
                </div>
              ))}
            </div>
          )}
        </DashboardCardBody>
      </DashboardCard>
    </div>
  )
}
