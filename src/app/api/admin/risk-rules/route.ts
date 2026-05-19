import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

const SETTING_KEY = 'risk_guardian_defaults'

export async function GET(_request: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const adminClient = createAdminClient()

  const { data, error } = await adminClient
    .from('admin_settings')
    .select('key, value, updated_at, updated_by')
    .eq('key', SETTING_KEY)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Row not found — return empty/default
      return NextResponse.json({ success: true, setting: null })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, setting: data })
}

export async function PUT(request: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result
  const { user } = result

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Validate expected fields
  const numericFields: Record<string, { min: number; max: number }> = {
    max_session_duration: { min: 30, max: 480 },
    max_trades_per_session: { min: 5, max: 200 },
    max_trades_per_window: { min: 1, max: 50 },
    exposure_multiplier: { min: 1.0, max: 3.0 },
    emotional_instability_threshold: { min: 1, max: 10 },
  }

  for (const [field, { min, max }] of Object.entries(numericFields)) {
    if (field in body) {
      const n = Number(body[field])
      if (isNaN(n) || n < min || n > max) {
        return NextResponse.json(
          { error: `${field} must be a number between ${min} and ${max}` },
          { status: 400 }
        )
      }
      body[field] = n
    }
  }

  const boolFields = ['fatigue_warning_enabled', 'revenge_trading_alert_enabled']
  for (const field of boolFields) {
    if (field in body && typeof body[field] !== 'boolean') {
      return NextResponse.json({ error: `${field} must be a boolean` }, { status: 400 })
    }
  }

  const adminClient = createAdminClient()

  const { data, error } = await adminClient
    .from('admin_settings')
    .upsert(
      {
        key: SETTING_KEY,
        value: body,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      },
      { onConflict: 'key' }
    )
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, setting: data })
}
