import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { EnterpriseManagerClient } from './EnterpriseManagerClient'

export interface EnterpriseTenant {
  id: string
  name: string
  slug: string
  domain: string | null
  contact_email: string | null
  plan: string
  primary_color: string | null
  secondary_color: string | null
  accent_color: string | null
  logo_url: string | null
  platform_name: string | null
  custom_css: string | null
  max_users: number
  active: boolean
  notes: string | null
  created_at: string
  updated_at: string
  user_count: number
}

export default async function EnterpriseManagerPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  const { data: tenants, error } = await admin
    .from('enterprise_tenants')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
        Failed to load tenants: {error.message}
      </div>
    )
  }

  // Count enterprise / white_label subscriptions per plan for approximate user counts
  const { data: subs } = await admin
    .from('subscriptions')
    .select('user_id, plan, status')
    .in('plan', ['enterprise', 'white_label'])

  const planCounts: Record<string, number> = {}
  for (const sub of subs ?? []) {
    const key = sub.plan ?? 'enterprise'
    planCounts[key] = (planCounts[key] ?? 0) + 1
  }

  const enriched: EnterpriseTenant[] = (tenants ?? []).map((t) => ({
    ...t,
    user_count: planCounts[t.plan] ?? 0,
  }))

  return <EnterpriseManagerClient initialTenants={enriched} />
}
