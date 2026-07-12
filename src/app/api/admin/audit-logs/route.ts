import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const ctx = await getAdminContext()
  if (ctx instanceof NextResponse) return ctx

  const admin = createAdminClient()
  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get('page') ?? '1', 10)
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10), 200)
  const category = url.searchParams.get('category')
  const search = url.searchParams.get('search')

  let query = admin
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }
  if (search) {
    query = query.or(`action.ilike.%${search}%,target.ilike.%${search}%,actor_email.ilike.%${search}%`)
  }

  const { data, count, error } = await query

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

export async function POST(req: NextRequest) {
  const ctx = await getAdminContext()
  if (ctx instanceof NextResponse) return ctx

  const body = await req.json()
  const { action, target, detail, category, metadata } = body

  if (!action) {
    return NextResponse.json({ error: 'action is required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('audit_logs')
    .insert({
      actor_id: ctx.user.id,
      actor_email: ctx.user.email ?? null,
      action,
      target: target ?? null,
      detail: detail ?? null,
      category: category ?? 'System',
      metadata: metadata ?? {},
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data }, { status: 201 })
}
