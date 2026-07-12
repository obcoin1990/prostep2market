'use client'

import { FileText, Download, Calendar, Clock, BarChart3, TrendingUp, TrendingDown, Target, Users, Shield, ArrowRight, CheckCircle2, Loader2, Mail, RefreshCw } from 'lucide-react'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

interface ReportTemplate {
  name: string
  desc: string
  icon: any
  color: string
}

interface RecentReport {
  name: string
  date: string
  type: string
  size: string
  status: 'Ready'
}

interface ScheduledReport {
  name: string
  frequency: string
  type: string
  icon: any
  color: string
  active: boolean
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  { name: 'Monthly Performance Report', desc: 'Complete monthly P&L, win rate, risk metrics, and Edge Score trend', icon: BarChart3, color: '#0ecb81' },
  { name: 'Trader DNA Assessment', desc: 'Psychological profile, behavioral patterns, and improvement roadmap', icon: Target, color: '#8A2BE2' },
  { name: 'Risk Guardian Report', desc: 'Risk violations, alert history, pause events, and compliance score', icon: Shield, color: '#FFC107' },
  { name: 'Education Progress', desc: 'Course completions, quiz scores, certifications, and learning velocity', icon: TrendingUp, color: '#00B4D8' },
  { name: 'Team Performance Summary', desc: 'Comparative team analytics, leaderboard ranking, and collaborative metrics', icon: Users, color: '#fcd535' },
]

export default function ReportsPage() {
  const supabase = createClient()

  const { data: recentReports, loading: reportsLoading, error: reportsError, refetch: refetchReports } = useRealtimeData<{ name: string; date: string; type: string; size: string; status: 'Ready' }[]>(
    async () => {
      const res = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      if (res.error) throw res.error
      return (res.data ?? []).map((r: any) => ({
        name: r.name,
        date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: r.format ?? 'PDF',
        size: r.size ?? '—',
        status: 'Ready' as const,
      }))
    },
    [],
  )

  const { data: scheduledReports, loading: schedLoading, error: schedError, refetch: refetchSched } = useRealtimeData<{ name: string; frequency: string; type: string; icon: any; color: string; active: boolean }[]>(
    async () => {
      const res = await supabase
        .from('scheduled_reports')
        .select('*')
        .order('created_at', { ascending: false })
      if (res.error) throw res.error
      return (res.data ?? []).map((r: any) => ({
        name: r.name,
        frequency: r.frequency,
        type: r.delivery_type ?? 'PDF',
        icon: Mail,
        color: '#0ecb81',
        active: r.active ?? true,
      }))
    },
    [],
  )

  const loading = reportsLoading || schedLoading
  const error = reportsError || schedError

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
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
          <div className="h-4 w-36 bg-[#2b3139] rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 bg-[#2b3139] rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Reports & Export" description="Generate, schedule, and download trading reports" icon={FileText} />
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-[#f6465d]/10 p-3">
              <TrendingDown className="h-5 w-5 text-[#f6465d]" />
            </div>
            <p className="text-sm text-white/60">Failed to load reports</p>
            <p className="text-xs text-white/50">{error}</p>
            <Button variant="outline" size="sm" onClick={() => { refetchReports(); refetchSched() }}>
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
        title="Reports & Export"
        description="Generate, schedule, and download trading reports"
        icon={FileText}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Reports Generated</p>
          <p className="text-2xl font-bold text-white mt-1">{recentReports?.length ?? 0}</p>
          <p className="text-xs text-[#0ecb81] mt-1">↑ {recentReports?.length ?? 0} total</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Active Schedules</p>
          <p className="text-2xl font-bold text-white mt-1">{scheduledReports?.filter(s => s.active).length ?? 0}</p>
          <p className="text-xs text-white/60 mt-1">Next: Mon 9:00 AM</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Export Formats</p>
          <p className="text-2xl font-bold text-white mt-1">4</p>
          <p className="text-xs text-white/60 mt-1">PDF, CSV, Excel, JSON</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Data Range</p>
          <p className="text-2xl font-bold text-white mt-1">6 mo</p>
          <p className="text-xs text-white/60 mt-1">Jan 1 – Jun 30, 2026</p>
        </div>
      </div>

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardTitle>Report Templates</DashboardCardTitle>
          <p className="text-xs text-white/60 mt-0.5">Choose a template to generate a custom report</p>
        </DashboardCardHeader>
        <DashboardCardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REPORT_TEMPLATES.map((t) => (
              <button key={t.name} className="group text-left rounded-lg border border-white/10 p-4 hover:bg-white/5 hover:border-white/20 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${t.color}15` }}>
                    <t.icon className="h-4 w-4" style={{ color: t.color }} />
                  </div>
                  <span className="text-sm font-semibold text-white group-hover:text-[#fcd535] transition-colors">{t.name}</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{t.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-[#fcd535] opacity-0 group-hover:opacity-100 transition-opacity">
                  Generate <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>
        </DashboardCardBody>
      </DashboardCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <DashboardCardHeader className="flex items-center justify-between">
            <DashboardCardTitle>Recent Reports</DashboardCardTitle>
            <button className="text-xs text-[#fcd535] hover:underline">View All</button>
          </DashboardCardHeader>
          <DashboardCardBody>
            {!recentReports || recentReports.length === 0 ? (
              <EmptyState icon={<FileText className="w-6 h-6" />} title="No reports yet" description="Generate your first report from a template above." variant="compact" />
            ) : (
              <div className="space-y-2">
                {recentReports.map((r) => (
                  <div key={r.name} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <FileText className="h-4 w-4 text-white/60 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{r.name}</p>
                        <p className="text-xs text-white/60">{r.date} · {r.type} · {r.size}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/60 hover:bg-white/5 transition-colors shrink-0">
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader className="flex items-center justify-between">
            <DashboardCardTitle>Scheduled Reports</DashboardCardTitle>
            <button className="text-xs text-[#fcd535] hover:underline">+ Add Schedule</button>
          </DashboardCardHeader>
          <DashboardCardBody>
            {!scheduledReports || scheduledReports.length === 0 ? (
              <EmptyState icon={<Calendar className="w-6 h-6" />} title="No scheduled reports" description="Schedule a report to receive it automatically." variant="compact" />
            ) : (
              <div className="space-y-2">
                {scheduledReports.map((s) => (
                  <div key={s.name} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${s.color}15` }}>
                        <s.icon className="h-4 w-4" style={{ color: s.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{s.name}</p>
                        <p className="text-xs text-white/60">{s.frequency} · {s.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${s.active ? 'bg-[#0ecb81]' : 'bg-white/20'}`} />
                      <span className={`text-xs ${s.active ? 'text-[#0ecb81]' : 'text-white/50'}`}>{s.active ? 'Active' : 'Paused'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>
      </div>
    </div>
  )
}
