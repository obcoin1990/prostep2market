import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10)))
  const offset = (page - 1) * limit

  const adminClient = createAdminClient()

  const { data: profiles, error, count } = await adminClient
    .from('trader_profiles')
    .select(
      'id, profile_type, risk_personality_score, emotional_stability_score, decision_making_score, trading_behavior_score, learning_style_score, learning_path, admin_role, created_at, completed_at',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, profiles: profiles ?? [], total: count ?? 0 })
}
