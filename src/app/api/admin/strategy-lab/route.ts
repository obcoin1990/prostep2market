import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminContext } from '@/lib/admin/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
    const userId = searchParams.get('userId')
    const from = (page - 1) * limit
    const to = from + limit - 1

    const admin = createAdminClient()

    let query = admin
      .from('strategies')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (userId) query = query.eq('user_id', userId)

    const { data: strategies, error, count } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    const strategyIds = (strategies ?? []).map((s) => s.id)

    // Simulation counts per strategy
    let simCounts: Record<string, number> = {}
    if (strategyIds.length > 0) {
      const { data: sims } = await admin
        .from('simulation_results')
        .select('strategy_id')
        .in('strategy_id', strategyIds)
      for (const s of sims ?? []) {
        simCounts[s.strategy_id] = (simCounts[s.strategy_id] ?? 0) + 1
      }
    }

    // Get user emails via auth admin
    const userIds = [...new Set((strategies ?? []).map((s) => s.user_id))]
    const emailMap: Record<string, string> = {}
    for (const uid of userIds) {
      try {
        const { data: userData } = await admin.auth.admin.getUserById(uid)
        if (userData?.user?.email) emailMap[uid] = userData.user.email
      } catch {
        emailMap[uid] = uid
      }
    }

    const enriched = (strategies ?? []).map((s) => ({
      ...s,
      owner_email: emailMap[s.user_id] ?? s.user_id,
      simulation_count: simCounts[s.id] ?? 0,
      entry_rules_count: Array.isArray(s.entry_rules)
        ? s.entry_rules.length
        : typeof s.entry_rules === 'object' && s.entry_rules
        ? Object.keys(s.entry_rules).length
        : 0,
      exit_rules_count: Array.isArray(s.exit_rules)
        ? s.exit_rules.length
        : typeof s.exit_rules === 'object' && s.exit_rules
        ? Object.keys(s.exit_rules).length
        : 0,
      risk_rules_count: Array.isArray(s.risk_rules)
        ? s.risk_rules.length
        : typeof s.risk_rules === 'object' && s.risk_rules
        ? Object.keys(s.risk_rules).length
        : 0,
    }))

    return NextResponse.json({ success: true, strategies: enriched, total: count ?? 0 })
  } catch (err) {
    console.error('GET /api/admin/strategy-lab error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
