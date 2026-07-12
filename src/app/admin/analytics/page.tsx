import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { BarChart3, TrendingUp, Users, Activity, Target, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminAnalyticsPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  // Fetch real counts from all relevant tables
  const [
    { count: totalUsers },
    { count: totalTrades },
    { count: totalEdgeScores },
    { count: totalSubscriptions },
    { count: totalAlerts },
    { data: recentProfiles },
    { data: allSubPlans },
    { data: allSubStatuses },
  ] = await Promise.all([
    admin.from('trader_profiles').select('*', { count: 'exact', head: true }),
    admin.from('trades').select('*', { count: 'exact', head: true }),
    admin.from('edge_scores').select('*', { count: 'exact', head: true }),
    admin.from('subscriptions').select('*', { count: 'exact', head: true }),
    admin.from('alerts').select('*', { count: 'exact', head: true }),
    admin.from('trader_profiles').select('created_at').order('created_at', { ascending: false }).limit(30),
    admin.from('subscriptions').select('plan'),
    admin.from('subscriptions').select('status'),
  ])

  // Compute new users in last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const newUsers30d = (recentProfiles ?? []).filter(
    (p: Record<string, unknown>) => p.created_at && p.created_at > thirtyDaysAgo
  ).length

  // Plan distribution
  const byPlan: Record<string, number> = {}
  for (const s of allSubPlans ?? []) {
    const plan = (s as Record<string, unknown>).plan ?? 'free'
    byPlan[plan as string] = (byPlan[plan as string] ?? 0) + 1
  }

  // Status distribution
  const byStatus: Record<string, number> = {}
  for (const s of allSubStatuses ?? []) {
    const status = (s as Record<string, unknown>).status ?? 'unknown'
    byStatus[status as string] = (byStatus[status as string] ?? 0) + 1
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Platform Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real-time metrics from platform data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: (totalUsers ?? 0).toLocaleString(), icon: Users, color: '#0284C7' },
          { label: 'New Users (30d)', value: newUsers30d.toLocaleString(), icon: TrendingUp, color: '#0ecb81' },
          { label: 'Total Trades', value: (totalTrades ?? 0).toLocaleString(), icon: Activity, color: '#8A2BE2' },
          { label: 'Active Alerts', value: (totalAlerts ?? 0).toLocaleString(), icon: Target, color: '#E53935' },
        ].map((s) => (
          <Card key={s.label} variant="light" className="border border-gray-200 shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-700 mt-1">{s.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: `${s.color}15` }}>
                  <div className="flex h-full w-full items-center justify-center">
                    <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="light" className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-700">Subscription Distribution</CardTitle>
            <p className="text-xs text-gray-400">Users by subscription plan</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(byPlan).length === 0 ? (
                <p className="text-sm text-gray-400">No subscriptions yet.</p>
              ) : (
                Object.entries(byPlan).map(([plan, count]) => (
                  <div key={plan} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{plan}</span>
                    <span className="text-sm font-semibold text-gray-700">{count}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card variant="light" className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-700">Subscription Status</CardTitle>
            <p className="text-xs text-gray-400">Active, trial, cancelled breakdown</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(byStatus).length === 0 ? (
                <p className="text-sm text-gray-400">No subscription data yet.</p>
              ) : (
                Object.entries(byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{status}</span>
                    <span className="text-sm font-semibold text-gray-700">{count}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="light" className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-700">Platform Overview</CardTitle>
          <p className="text-xs text-gray-400">Key metrics across the platform</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">{(totalUsers ?? 0).toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Registered Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">{(totalTrades ?? 0).toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Total Trades</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">{(totalEdgeScores ?? 0).toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Edge Score Records</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">{(totalSubscriptions ?? 0).toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Subscriptions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
