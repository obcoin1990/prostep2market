import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

type Params = { params: Promise<{ userId: string }> }

// ─── GET /api/admin/trader-dna/[userId] ──────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const admin = createAdminClient()
  const { userId } = await params
  const { data, error } = await admin
    .from('trader_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ success: true, profile: data })
}

// ─── PATCH /api/admin/trader-dna/[userId] ────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const allowed = [
    'profile_type',
    'risk_personality_score',
    'emotional_stability_score',
    'decision_making_score',
    'trading_behavior_score',
    'learning_style_score',
    'learning_path',
    'admin_role',
  ]

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  const admin = createAdminClient()
  const { userId } = await params
  const { data, error } = await admin
    .from('trader_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, profile: data })
}
