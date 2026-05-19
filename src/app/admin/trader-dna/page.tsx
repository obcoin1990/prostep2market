import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { TraderDNAClient } from './TraderDNAClient'

export interface TraderProfile {
  id: string
  profile_type: string | null
  risk_personality_score: number | null
  emotional_stability_score: number | null
  decision_making_score: number | null
  trading_behavior_score: number | null
  learning_style_score: number | null
  learning_path: string | null
  admin_role: string | null
  created_at: string | null
  completed_at: string | null
  email?: string
}

export default async function TraderDNAPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const adminClient = createAdminClient()

  const { data: profiles, error } = await adminClient
    .from('trader_profiles')
    .select(
      'id, profile_type, risk_personality_score, emotional_stability_score, decision_making_score, trading_behavior_score, learning_style_score, learning_path, admin_role, created_at, completed_at'
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch trader_profiles:', error)
  }

  // Build userId → email map via auth.admin.listUsers
  const emailMap: Record<string, string> = {}
  try {
    let page = 1
    const perPage = 1000
    while (true) {
      const { data: usersPage, error: usersError } =
        await adminClient.auth.admin.listUsers({ page, perPage })
      if (usersError || !usersPage?.users?.length) break
      for (const u of usersPage.users) {
        if (u.email) emailMap[u.id] = u.email
      }
      if (usersPage.users.length < perPage) break
      page++
    }
  } catch (e) {
    console.error('Failed to list auth users:', e)
  }

  const enriched: TraderProfile[] = (profiles ?? []).map((p) => ({
    ...p,
    email: emailMap[p.id] ?? undefined,
  }))

  return <TraderDNAClient profiles={enriched} />
}
