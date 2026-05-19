import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

type Params = { params: Promise<{ subId: string }> }

// ─── GET /api/admin/billing/[subId] ──────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const admin = createAdminClient()
  const { subId } = await params
  const { data, error } = await admin
    .from('subscriptions')
    .select('*')
    .eq('id', subId)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ success: true, data })
}

// ─── PATCH /api/admin/billing/[subId] ────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Note: `trial_ends_at` does not exist in the subscriptions schema — removed
  const allowed = ['plan', 'status', 'current_period_end', 'cancel_at_period_end']
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  const admin = createAdminClient()
  const { subId } = await params
  const { data, error } = await admin
    .from('subscriptions')
    .update(updates)
    .eq('id', subId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

// ─── DELETE /api/admin/billing/[subId] ───────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const admin = createAdminClient()
  const { subId } = await params
  // Cancel instead of hard-delete: set status=cancelled
  const { error } = await admin
    .from('subscriptions')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', subId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
