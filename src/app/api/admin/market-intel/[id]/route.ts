import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

type Params = { params: Promise<{ id: string }> }

// ─── GET /api/admin/market-intel/[id] ────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const admin = createAdminClient()
  const { id } = await params
  const { data, error } = await admin
    .from('market_intel_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ success: true, data })
}

// ─── PATCH /api/admin/market-intel/[id] ──────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const allowed = ['title', 'content', 'category', 'currency_pairs', 'impact', 'source', 'external_url', 'published']
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }
  if ('published' in body && body.published && !('published_at' in body)) {
    updates['published_at'] = new Date().toISOString()
  }

  const admin = createAdminClient()
  const { id } = await params
  const { data, error } = await admin
    .from('market_intel_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

// ─── DELETE /api/admin/market-intel/[id] ─────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const admin = createAdminClient()
  const { id } = await params
  const { error } = await admin.from('market_intel_posts').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
