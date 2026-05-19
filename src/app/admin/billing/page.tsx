import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { BillingManagerClient } from './BillingManagerClient'

export interface SubscriptionRow {
  id: string
  user_id: string
  user_email?: string
  plan: string | null
  status: string | null
  provider: string | null
  provider_subscription_id: string | null
  provider_customer_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean | null
  amount_cents: number | null
  currency: string | null
  enterprise_tenant_id: string | null
  created_at: string
  updated_at: string | null
}

export interface BillingStats {
  byPlan: Record<string, number>
  byStatus: Record<string, number>
}

export default async function AdminBillingPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  // Fetch subscriptions (first page)
  const { data: subscriptions, count, error } = await admin
    .from('subscriptions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(0, 19)

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
        Failed to load subscriptions: {error.message}
      </div>
    )
  }

  // Enrich with emails
  const userIds = [...new Set((subscriptions ?? []).map((s) => s.user_id).filter(Boolean))]
  const emailMap: Record<string, string> = {}
  try {
    const { data: authList } = await admin.auth.admin.listUsers({ perPage: 1000 })
    for (const u of authList?.users ?? []) {
      if (userIds.includes(u.id)) emailMap[u.id] = u.email ?? ''
    }
  } catch {
    // non-fatal
  }

  const enriched = (subscriptions ?? []).map((s) => ({
    ...s,
    user_email: emailMap[s.user_id] ?? s.user_id,
  })) as SubscriptionRow[]

  // Stats
  const { data: allSubs } = await admin.from('subscriptions').select('plan, status')
  const byPlan: Record<string, number> = {}
  const byStatus: Record<string, number> = {}
  for (const s of allSubs ?? []) {
    if (s.plan) byPlan[s.plan] = (byPlan[s.plan] ?? 0) + 1
    if (s.status) byStatus[s.status] = (byStatus[s.status] ?? 0) + 1
  }

  return (
    <BillingManagerClient
      initialSubscriptions={enriched}
      initialTotal={count ?? 0}
      initialStats={{ byPlan, byStatus }}
    />
  )
}
