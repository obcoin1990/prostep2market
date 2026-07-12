import { AdminDashboardClient } from '@/app/dashboard/admin-dash/client'
import { demoTrades, demoAlerts } from '@/lib/demo/demo-data'

export default function DemoAdminDashboard() {
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
