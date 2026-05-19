// ─── Server component ────────────────────────────────────────────────────────
import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { UsersAdminClient } from './UsersAdminClient'

export interface TraderProfileRow {
  id: string
  profile_type: string | null
  admin_role: string | null
  risk_personality_score: number | null
  emotional_stability_score: number | null
  created_at: string
  // joined from auth.users via RPC / admin list — populated after enrichment
  email?: string
}

export default async function AdminUsersPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  // Fetch all trader profiles
  const { data: profiles, error } = await admin
    .from('trader_profiles')
    .select('id, profile_type, admin_role, risk_personality_score, emotional_stability_score, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
        Failed to load users: {error.message}
      </div>
    )
  }

  // Enrich with emails from auth.users (batched — admin API returns max 1000)
  let enriched: TraderProfileRow[] = profiles ?? []
  try {
    const { data: authList } = await admin.auth.admin.listUsers({ perPage: 1000 })
    const emailMap = new Map<string, string>(
      (authList?.users ?? []).map((u) => [u.id, u.email ?? ''])
    )
    enriched = enriched.map((p) => ({ ...p, email: emailMap.get(p.id) ?? '' }))
  } catch {
    // emails stay empty — non-fatal
  }

  return <UsersAdminClient initialUsers={enriched} />
}
