import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

// ─── GET /api/admin/notifications/logs ───────────────────────────────────────
// Query params: page (default 1), limit (default 50), status (optional filter)
export async function GET(req: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10)))
  const status = searchParams.get('status') ?? null
  const from = (page - 1) * limit
  const to = from + limit - 1

  const admin = createAdminClient()

  let query = admin
    .from('notification_logs')
    .select('*', { count: 'exact' })
    .order('sent_at', { ascending: false })
    .range(from, to)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    data: data ?? [],
    total: count ?? 0,
    page,
    limit,
    pages: Math.ceil((count ?? 0) / limit),
  })
}
