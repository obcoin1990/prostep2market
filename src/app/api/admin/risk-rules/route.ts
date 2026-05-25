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

  // ── Validate numeric fields ────────────────────────────────────────────────
  const numericFields: Record<string, { min: number; max: number }> = {
    // Existing
    max_session_duration:            { min: 30,   max: 480  },
    max_trades_per_session:          { min: 5,    max: 200  },
    max_trades_per_window:           { min: 1,    max: 50   },
    exposure_multiplier:             { min: 1.0,  max: 3.0  },
    emotional_instability_threshold: { min: 1,    max: 10   },

    // Scalping
    scalping_min_duration_seconds:   { min: 5,    max: 300  },
    scalping_max_trades_per_day:     { min: 1,    max: 100  },

    // Arbitrage
    arbitrage_max_avg_duration_seconds: { min: 5, max: 300  },
    arbitrage_min_win_rate:             { min: 50, max: 100 },
    arbitrage_max_rr:                   { min: 0.1, max: 2.0 },

    // Hedging
    hedging_time_window_seconds:     { min: 30,  max: 3600  },
    hedging_lot_size_tolerance:      { min: 0.01, max: 0.5  },
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

  // ── Validate boolean fields ────────────────────────────────────────────────
  const boolFields = [
    'fatigue_warning_enabled',
    'revenge_trading_alert_enabled',
    // Abuse-detection toggles
    'scalping_enabled',
    'arbitrage_enabled',
    'hedging_enabled',
  ]
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
