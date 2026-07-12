'use client'

import { Users, TrendingUp, Award, Clock, BarChart3, ArrowUpRight, Star, Mail } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'

const supabase = createClient()

const ROLE_COLORS: Record<string, string> = {
  owner: '#fcd535',
  admin: '#00B4D8',
  member: '#8A2BE2',
}

function getInitials(name: string | null): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getRoleColor(role: string): string {
  return ROLE_COLORS[role] ?? '#6b7280'
}

interface TeamMember {
  id: string
  owner_id: string
  user_id: string | null
  display_name: string
  email: string
  role: string
  avatar_url: string | null
  joined_at: string
  last_active_at: string | null
  created_at: string
}

export default function TeamDashboardPage() {
  const { data: members, loading } = useRealtimeData<TeamMember[]>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
      return data ?? []
    },
    [],
  )

  const memberCount = members?.length ?? 0

  const stats = [
    { label: 'Team Members', value: memberCount, icon: Users },
    { label: 'Admins', value: members?.filter((m) => m.role === 'admin').length ?? 0, icon: Award },
    { label: 'Members', value: members?.filter((m) => m.role === 'member').length ?? 0, icon: Mail },
    { label: 'Active Today', value: members?.filter((m) => {
      if (!m.last_active_at) return false
      const lastActive = new Date(m.last_active_at)
      const today = new Date()
      return lastActive.toDateString() === today.toDateString()
    }).length ?? 0, icon: Clock },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Team Overview"
        description="Monitor your team's trading performance and activity"
        icon={Users}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[88px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
          ))}
        </div>
      )}

      <DashboardCard>
        <DashboardCardHeader>
          <div className="flex items-center justify-between">
            <DashboardCardTitle>Team Members</DashboardCardTitle>
            <span className="text-xs text-white/60">{memberCount} members</span>
          </div>
        </DashboardCardHeader>
        <DashboardCardBody>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : memberCount === 0 ? (
            <EmptyState
              icon={<Users />}
              title="No team members yet"
              description="Invite team members to collaborate"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 font-medium text-[10px] text-white/60 uppercase tracking-wider">Member</th>
                    <th className="text-left py-3 font-medium text-[10px] text-white/60 uppercase tracking-wider">Profile</th>
                    <th className="text-left py-3 font-medium text-[10px] text-white/60 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {members!.map((m) => {
                    const color = getRoleColor(m.role)
                    const joinedDate = m.created_at ? new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'
                    return (
                      <tr key={m.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                              style={{ backgroundColor: color }}
                            >
                              {getInitials(m.display_name)}
                            </div>
                            <span className="text-sm font-medium text-white">{m.display_name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
                            style={{ backgroundColor: `${color}15`, color }}
                          >
                            {m.role}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-white/60">{joinedDate}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </DashboardCardBody>
      </DashboardCard>

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardTitle>Team Analytics</DashboardCardTitle>
        </DashboardCardHeader>
        <DashboardCardBody>
          <EmptyState
            icon={<BarChart3 />}
            title="Team analytics coming soon"
            description="Performance distribution and activity tracking will be available here"
          />
        </DashboardCardBody>
      </DashboardCard>
    </div>
  )
}
