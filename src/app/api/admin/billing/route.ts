import { NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
  const planFilter = searchParams.get('plan') ?? ''
  const statusFilter = searchParams.get('status') ?? ''
  const search = searchParams.get('search') ?? ''

  const admin = createAdminClient()

  // Build full email → id map by paginating through all auth users
  async function buildEmailMap(): Promise<Record<string, string>> {
    const map: Record<string, string> = {}
    let p = 1
    while (true) {
      const { data: page, error } = await admin.auth.admin.listUsers({ page: p, perPage: 1000 })
      if (error || !page?.users?.length) break
      for (const u of page.users) {
        if (u.email) map[u.id] = u.email
      }
      if (page.users.length < 1000) break
      p++
    }
    return map
  }

  // If search by email, find user IDs first
  let filteredUserIds: string[] | null = null
  if (search) {
    try {
      const emailMap = await buildEmailMap()
      const matched = Object.entries(emailMap).filter(([, email]) =>
        email.toLowerCase().includes(search.toLowerCase())
      )
      filteredUserIds = matched.map(([id]) => id)
    } catch {
      filteredUserIds = []
    }
  }

  let query = admin.from('subscriptions').select('*', { count: 'exact' })

  if (planFilter && planFilter !== 'all') query = query.eq('plan', planFilter)
  if (statusFilter && statusFilter !== 'all') query = query.eq('status', statusFilter)
  if (filteredUserIds !== null) {
    if (filteredUserIds.length === 0) {
      return NextResponse.json({ success: true, subscriptions: [], total: 0, stats: { byPlan: {}, byStatus: {} } })
    }
    query = query.in('user_id', filteredUserIds)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data: subscriptions, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Build email map for this page
  const userIds = [...new Set((subscriptions ?? []).map((s) => s.user_id).filter(Boolean))]
  const emailMap: Record<string, string> = {}
  if (userIds.length > 0) {
    try {
      let p = 1
      while (true) {
        const { data: authPage, error } = await admin.auth.admin.listUsers({ page: p, perPage: 1000 })
        if (error || !authPage?.users?.length) break
        for (const u of authPage.users) {
          if (userIds.includes(u.id)) emailMap[u.id] = u.email ?? ''
        }
        // Stop early if we've found all the IDs we need
        if (Object.keys(emailMap).length === userIds.length) break
        if (authPage.users.length < 1000) break
        p++
      }
    } catch {
      // non-fatal — emails will fall back to user_id
    }
  }

  const enriched = (subscriptions ?? []).map((s) => ({
    ...s,
    user_email: emailMap[s.user_id] ?? s.user_id,
  }))

  // Stats — always across all subscriptions (no filter)
  const { data: allSubs } = await admin.from('subscriptions').select('plan, status')
  const byPlan: Record<string, number> = {}
  const byStatus: Record<string, number> = {}
  for (const s of allSubs ?? []) {
    if (s.plan) byPlan[s.plan] = (byPlan[s.plan] ?? 0) + 1
    if (s.status) byStatus[s.status] = (byStatus[s.status] ?? 0) + 1
  }

  return NextResponse.json({
    success: true,
    subscriptions: enriched,
    total: count ?? 0,
    stats: { byPlan, byStatus },
  })
}
