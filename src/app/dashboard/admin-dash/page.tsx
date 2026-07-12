import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { AdminDashboardClient } from './client'
import { demoTrades, demoAlerts } from '@/lib/demo/demo-data'

export default async function AdminDashboardPage() {
  // Check demo session first
  try {
    const c = await cookies()
    if (c.get('p2m_demo_session')?.value) {
      return (
        <AdminDashboardClient
          totalUsers={24}
          totalTrades={demoTrades.length}
          activeAlerts={demoAlerts.filter(a => !a.acknowledged).length}
          recentProfiles={[
            { id: 'user-001', profile_type: 'sniper', created_at: new Date().toISOString() },
            { id: 'user-002', profile_type: 'analyst', created_at: new Date(Date.now() - 86400000).toISOString() },
            { id: 'user-003', profile_type: 'warrior', created_at: new Date(Date.now() - 172800000).toISOString() },
            { id: 'user-004', profile_type: 'disciplinarian', created_at: new Date(Date.now() - 259200000).toISOString() },
            { id: 'user-005', profile_type: 'opportunist', created_at: new Date(Date.now() - 345600000).toISOString() },
          ]}
        />
      )
    }
  } catch {}

  // Real user — load from Supabase
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  let totalUsers = 0
  let totalTrades = 0
  let activeAlerts = 0
  let recentProfiles: any[] = []

  try {
    const [usersRes, profilesRes, tradesRes, alertsRes] = await Promise.all([
      supabase.from('trader_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('trader_profiles').select('*').limit(5).order('created_at', { ascending: false }),
      supabase.from('trades').select('*', { count: 'exact', head: true }),
      supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('acknowledged', false),
    ])
    totalUsers = usersRes.count ?? 0
    totalTrades = tradesRes.count ?? 0
    activeAlerts = alertsRes.count ?? 0
    recentProfiles = profilesRes.data ?? []
  } catch {}

  return (
    <AdminDashboardClient
      totalUsers={totalUsers}
      totalTrades={totalTrades}
      activeAlerts={activeAlerts}
      recentProfiles={recentProfiles}
    />
  )
}
