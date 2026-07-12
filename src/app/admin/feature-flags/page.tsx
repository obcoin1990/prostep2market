import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { Settings, ToggleLeft, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FeatureFlagToggle } from '@/components/admin/FeatureFlagToggle'

const FLAG_STATUSES = ['Release', 'Rollout', 'Beta', 'Alpha', 'Dev']

export default async function AdminFeatureFlagsPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  const { data: setting } = await admin
    .from('admin_settings')
    .select('value')
    .eq('key', 'feature_flags')
    .maybeSingle()

  const flags = (setting?.value ?? []) as Array<{
    name: string
    desc?: string
    status: string
    rollout: number
    environment?: string
  }>

  // Count by status
  const statusCounts: Record<string, number> = {}
  for (const f of flags) {
    statusCounts[f.status] = (statusCounts[f.status] ?? 0) + 1
  }

  const COLOR_MAP: Record<string, string> = {
    Release: '#0ecb81',
    Rollout: '#0284C7',
    Beta: '#8A2BE2',
    Alpha: '#FF8A65',
    Dev: '#FFC107',
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Feature Flags</h1>
          <p className="text-sm text-gray-500 mt-0.5">Toggle management, phased rollout, and A/B test configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {FLAG_STATUSES.map((status) => {
          const count = statusCounts[status] ?? 0
          return (
            <Card key={status} variant="light" className="border border-gray-200 shadow-sm">
              <CardContent className="pt-5 pb-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{status}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: COLOR_MAP[status] }}>{count}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card variant="light" className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-700">All Flags</CardTitle>
          <p className="text-xs text-gray-400">{flags.length} flags configured</p>
        </CardHeader>
        <CardContent>
          {flags.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No feature flags configured yet.</p>
          ) : (
            <div className="space-y-3">
              {flags.map((flag) => (
                <div key={flag.name} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                      <ToggleLeft className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-700 font-mono">#{flag.name}</p>
                      {flag.desc && <p className="text-xs text-gray-400">{flag.desc}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-700">{flag.rollout}%</p>
                      {flag.environment && <p className="text-[10px] text-gray-400">{flag.environment}</p>}
                    </div>
                    <Badge variant={flag.status === 'Release' ? 'success' : flag.status === 'Dev' ? 'default' : 'info'}>
                      {flag.status}
                    </Badge>
                    <FeatureFlagToggle
                      flagName={flag.name}
                      currentRollout={flag.rollout}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
