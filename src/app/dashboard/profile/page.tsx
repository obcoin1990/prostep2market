'use client'

import { User, Mail, Calendar, Shield, Globe, Bell, Lock, Key, Camera } from 'lucide-react'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import Link from 'next/link'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const supabase = createClient()

  const { data: user, loading: userLoading } = useRealtimeData<{ email: string; created_at: string }>(
    async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) throw new Error('Not authenticated')
      return { email: user.email ?? '', created_at: user.created_at }
    },
    [],
  )

  const { data: profile, loading: profileLoading } = useRealtimeData<{ full_name: string; timezone: string; account_size: number } | null>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      const { data } = await supabase.from('user_profiles').select('*').eq('id', user.id).single()
      return data
    },
    [],
  )

  const { data: connections, loading: connLoading } = useRealtimeData<{ provider: string; status: string }[]>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data } = await supabase.from('mt_connections').select('broker_server, status').eq('user_id', user.id)
      return (data ?? []).map((c: any) => ({
        provider: c.broker_server ?? 'Unknown',
        status: c.status === 'connected' ? 'Connected' : 'Disconnected',
      }))
    },
    [],
  )

  const loading = userLoading || profileLoading
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Trader'
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'

  const accountDetails = [
    { label: 'Full Name', value: displayName, icon: User },
    { label: 'Email', value: user?.email ?? '—', icon: Mail },
    { label: 'Member Since', value: memberSince, icon: Calendar },
    { label: 'Timezone', value: profile?.timezone ?? 'UTC', icon: Globe },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Profile & Account" description="Manage your personal information and preferences" icon={User} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard><DashboardCardHeader><Skeleton className="h-40 w-full" /></DashboardCardHeader></DashboardCard>
          <DashboardCard className="lg:col-span-2"><DashboardCardHeader><Skeleton className="h-60 w-full" /></DashboardCardHeader></DashboardCard>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Profile & Account"
        description="Manage your personal information and preferences"
        icon={User}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard className="lg:col-span-1">
          <DashboardCardHeader>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fcd535]/20 text-[#fcd535] text-2xl font-bold">
                  {initials}
                </div>
                <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#2b3139] border border-white/10 hover:bg-white/10 transition-colors">
                  <Camera className="h-3.5 w-3.5 text-white/70" />
                </button>
              </div>
              <p className="text-lg font-semibold text-white">{displayName}</p>
              <p className="text-sm text-white/50">{user?.email}</p>
              <div className="mt-3">
                <StatusBadge label="Verified Account" variant="success" />
              </div>
            </div>
          </DashboardCardHeader>
        </DashboardCard>

        <DashboardCard className="lg:col-span-2">
          <DashboardCardHeader>
            <DashboardCardTitle>Account Details</DashboardCardTitle>
          </DashboardCardHeader>
          <DashboardCardBody>
            <div className="space-y-3">
              {accountDetails.map((d) => (
                <div key={d.label} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <d.icon className="h-4 w-4 text-white/60" />
                    <span className="text-sm text-white/60">{d.label}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{d.value}</span>
                </div>
              ))}
            </div>
          </DashboardCardBody>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <DashboardCardHeader className="flex items-center justify-between">
            <DashboardCardTitle>Linked Accounts</DashboardCardTitle>
            <Link href="/dashboard/connections" className="text-xs text-[#fcd535] hover:underline">Manage</Link>
          </DashboardCardHeader>
          <DashboardCardBody>
            {connLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : connections && connections.length > 0 ? (
              <div className="space-y-2">
                {connections.map((a) => (
                  <div key={a.provider} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
                    <span className="text-sm text-white">{a.provider}</span>
                    <span className="text-xs font-medium" style={{ color: a.status === 'Connected' ? '#0ecb81' : '#9ea3ad' }}>{a.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No linked accounts" description="Connect your broker to start tracking performance." />
            )}
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader className="flex items-center justify-between">
            <DashboardCardTitle>Quick Links</DashboardCardTitle>
          </DashboardCardHeader>
          <DashboardCardBody>
            <div className="space-y-2">
              <Link href="/dashboard/settings/security" className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 hover:bg-white/5 transition-colors">
                <Lock className="h-4 w-4 text-[#00B4D8]" />
                <span className="text-sm text-white">Security</span>
                <span className="ml-auto text-xs text-white/50">Password & 2FA</span>
              </Link>
              <Link href="/dashboard/settings/notifications" className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 hover:bg-white/5 transition-colors">
                <Bell className="h-4 w-4 text-[#fcd535]" />
                <span className="text-sm text-white">Notifications</span>
                <span className="ml-auto text-xs text-white/50">Alert preferences</span>
              </Link>
              <Link href="/dashboard/settings/api-keys" className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 hover:bg-white/5 transition-colors">
                <Key className="h-4 w-4 text-[#f6465d]" />
                <span className="text-sm text-white">API Keys</span>
                <span className="ml-auto text-xs text-white/50">Manage integrations</span>
              </Link>
            </div>
          </DashboardCardBody>
        </DashboardCard>
      </div>
    </div>
  )
}
