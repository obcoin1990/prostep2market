'use client'

import { Bell, AlertTriangle, Sparkles, Target, Users, Shield, TrendingUp, CheckCircle2, Settings, Clock, Mail } from 'lucide-react'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

interface NotificationLog {
  id: string
  template_key: string
  recipient_email: string
  recipient_user_id: string | null
  subject: string
  status: string
  resend_id: string | null
  sent_at: string
  error: string | null
}

const TEMPLATE_ICONS: Record<string, any> = {
  welcome: Sparkles,
  trade_synced: CheckCircle2,
  alert: AlertTriangle,
  risk_warning: Shield,
  achievement: Target,
  weekly_report: TrendingUp,
  team_invite: Users,
  edge_score: Sparkles,
}

const TEMPLATE_COLORS: Record<string, string> = {
  welcome: '#0ecb81',
  trade_synced: '#0ecb81',
  alert: '#f6465d',
  risk_warning: '#FFC107',
  achievement: '#8A2BE2',
  weekly_report: '#00B4D8',
  team_invite: '#0ecb81',
  edge_score: '#fcd535',
}

function getTemplateCategory(key: string): string {
  if (key.includes('alert') || key.includes('risk')) return 'alert'
  if (key.includes('score') || key.includes('achievement')) return 'score'
  if (key.includes('team')) return 'team'
  if (key.includes('report') || key.includes('weekly')) return 'report'
  if (key.includes('sync') || key.includes('trade')) return 'sync'
  return 'system'
}

export default function NotificationsPage() {
  const supabase = createClient()

  const { data: notifications, loading } = useRealtimeData<NotificationLog[]>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data } = await supabase
        .from('notification_logs')
        .select('*')
        .eq('recipient_user_id', user.id)
        .order('sent_at', { ascending: false })
        .limit(50)
      return data ?? []
    },
    [],
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Notifications" description="Stay updated with alerts, achievements, and platform activity" icon={Bell} />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      </div>
    )
  }

  const allNotifications = notifications ?? []

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Notifications"
        description="Stay updated with alerts, achievements, and platform activity"
        icon={Bell}
        action={
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5 transition-colors">
              <Settings className="h-3.5 w-3.5 inline mr-1" />
              Settings
            </button>
          </div>
        }
      />

      <DashboardCard padding="none">
        <DashboardCardBody>
          {allNotifications.length === 0 ? (
            <div className="p-8">
              <EmptyState title="No notifications" description="Notifications about alerts, achievements, and platform activity will appear here." />
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {allNotifications.map((n) => {
                const category = getTemplateCategory(n.template_key)
                const Icon = TEMPLATE_ICONS[n.template_key] ?? Mail
                const color = TEMPLATE_COLORS[n.template_key] ?? '#9ea3ad'
                const timeAgo = formatTimeAgo(n.sent_at)
                return (
                  <div
                    key={n.id}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}15` }}>
                        <Icon className="h-5 w-5" style={{ color }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white">{n.subject}</p>
                        <StatusBadge
                          label={n.status}
                          variant={n.status === 'sent' ? 'active' : n.status === 'failed' ? 'danger' : 'info'}
                        />
                      </div>
                      <p className="text-sm text-white/60 mt-0.5">
                        {n.template_key.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Clock className="h-3 w-3 text-white/50" />
                        <span className="text-xs text-white/60">{timeAgo}</span>
                        <span className="text-white/50">&middot;</span>
                        <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">{category}</span>
                        {n.error && (
                          <>
                            <span className="text-white/50">&middot;</span>
                            <span className="text-[10px] font-medium text-[#f6465d]">{n.error}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </DashboardCardBody>
      </DashboardCard>
    </div>
  )
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
