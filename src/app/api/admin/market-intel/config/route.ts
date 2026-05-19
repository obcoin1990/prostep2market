import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminContext } from '@/lib/admin/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('market_intel_config')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true, data: data ?? null })
  } catch (err) {
    console.error('GET /api/admin/market-intel/config error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  try {
    const body = await request.json()
    const { provider, api_key, api_endpoint, refresh_interval_minutes, active } = body

    if (!provider) {
      return NextResponse.json({ error: 'provider is required' }, { status: 400 })
    }

    const admin = createAdminClient()
    const now = new Date().toISOString()

    // Check if a config row already exists
    const { data: existing } = await admin
      .from('market_intel_config')
      .select('id')
      .limit(1)
      .maybeSingle()

    let data, error

    if (existing?.id) {
      ;({ data, error } = await admin
        .from('market_intel_config')
        .update({ provider, api_key, api_endpoint, refresh_interval_minutes, active, updated_at: now })
        .eq('id', existing.id)
        .select()
        .single())
    } else {
      ;({ data, error } = await admin
        .from('market_intel_config')
        .insert([{ provider, api_key, api_endpoint, refresh_interval_minutes, active, updated_at: now }])
        .select()
        .single())
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('PUT /api/admin/market-intel/config error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
