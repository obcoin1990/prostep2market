import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

type Params = { params: Promise<{ id: string }> }

// ─── GET /api/admin/users/[id] ────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const admin = createAdminClient()
  const { id } = await params

  const [authResult, profileResult] = await Promise.all([
    admin.auth.admin.getUserById(id),
    admin.from('trader_profiles').select('*').eq('id', id).single(),
  ])

  if (authResult.error) {
    return NextResponse.json({ error: authResult.error.message }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    user: authResult.data.user,
    profile: profileResult.data ?? null,
  })
}

// ─── PATCH /api/admin/users/[id] ─────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const { id } = await params
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const admin = createAdminClient()
  const allowedProfileFields = ['admin_role', 'learning_path', 'profile_type']
  const profileUpdates: Record<string, unknown> = {}
  for (const key of allowedProfileFields) {
    if (key in body) profileUpdates[key] = body[key]
  }

  const updates: Array<PromiseLike<unknown>> = []

  if (Object.keys(profileUpdates).length > 0) {
    updates.push(
      admin
        .from('trader_profiles')
        .update({ ...profileUpdates, updated_at: new Date().toISOString() })
        .eq('id', id)
    )
  }

  if (typeof body.banned === 'boolean') {
    updates.push(
      admin.auth.admin.updateUserById(id, { ban_duration: body.banned ? '87600h' : 'none' })
    )
  }

  const results = await Promise.all(updates)
  const failed = results.filter((r: any) => r?.error)
  if (failed.length > 0) {
    const messages = failed.map((r: any) => r.error?.message ?? 'Unknown error').join('; ')
    return NextResponse.json({ error: `Update failed: ${messages}` }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

// ─── PUT /api/admin/users/[id] — alias kept for backward-compat ──────────────
export { PATCH as PUT }
export async function DELETE(_req: NextRequest, { params }: Params) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const { id } = await params
  const admin = createAdminClient()

  const { error } = await admin.auth.admin.deleteUser(id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
