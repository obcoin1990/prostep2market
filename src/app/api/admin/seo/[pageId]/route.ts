import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

type Params = { params: Promise<{ pageId: string }> }

// ─── GET /api/admin/seo/[pageId] ─────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const admin = createAdminClient()
  const { pageId } = await params
  const { data, error } = await admin
    .from('seo_settings')
    .select('*')
    .eq('id', pageId)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ success: true, data })
}

// ─── PATCH /api/admin/seo/[pageId] ───────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result
  const { user } = result

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const allowed = ['page_path', 'title', 'description', 'keywords', 'og_title', 'og_description', 'og_image', 'canonical_url', 'no_index']
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  }
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  const admin = createAdminClient()
  const { pageId } = await params
  const { data, error } = await admin
    .from('seo_settings')
    .update(updates)
    .eq('id', pageId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

// ─── DELETE /api/admin/seo/[pageId] ──────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const admin = createAdminClient()
  const { pageId } = await params
  const { error } = await admin.from('seo_settings').delete().eq('id', pageId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
