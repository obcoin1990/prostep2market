import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  const adminClient = createAdminClient()

  if (key) {
    const { data, error } = await adminClient
      .from('admin_settings')
      .select('key, value, updated_at, updated_by')
      .eq('key', key)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.code === 'PGRST116' ? 404 : 500 })
    }

    return NextResponse.json({ success: true, setting: data })
  }

  const { data, error } = await adminClient
    .from('admin_settings')
    .select('key, value, updated_at, updated_by')
    .order('key', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, settings: data ?? [] })
}

// Keys that may be written via this generic endpoint.
// Any other key is rejected to prevent overwriting unrelated settings.
const ALLOWED_SETTINGS_KEYS = ['ai_engine', 'feature_flags', 'security_settings', 'permission_matrix', 'system_health'] as const
type AllowedKey = (typeof ALLOWED_SETTINGS_KEYS)[number]

export async function PUT(request: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result
  const { user } = result

  let body: { key: string; value: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.key || typeof body.key !== 'string') {
    return NextResponse.json({ error: 'key is required and must be a string' }, { status: 400 })
  }
  if (body.value === undefined) {
    return NextResponse.json({ error: 'value is required' }, { status: 400 })
  }

  // Key allowlist — prevents overwriting arbitrary admin_settings rows
  if (!ALLOWED_SETTINGS_KEYS.includes(body.key as AllowedKey)) {
    return NextResponse.json(
      { error: `Invalid key. Allowed keys: ${ALLOWED_SETTINGS_KEYS.join(', ')}` },
      { status: 400 }
    )
  }

  // Per-key value validation
  if (body.key === 'ai_engine' && typeof body.value === 'object' && body.value !== null) {
    const v = body.value as Record<string, unknown>
    if (typeof v.temperature === 'number' && (v.temperature < 0 || v.temperature > 2)) {
      return NextResponse.json({ error: 'temperature must be between 0 and 2' }, { status: 400 })
    }
    if (typeof v.max_tokens === 'number' && (v.max_tokens < 100 || v.max_tokens > 16000)) {
      return NextResponse.json({ error: 'max_tokens must be between 100 and 16000' }, { status: 400 })
    }
  }

  const adminClient = createAdminClient()

  const { data, error } = await adminClient
    .from('admin_settings')
    .upsert(
      {
        key: body.key,
        value: body.value,
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
