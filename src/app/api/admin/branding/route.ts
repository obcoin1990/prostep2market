import { NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('platform_branding')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function PUT(request: Request) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result
  const { user } = result

  const body = await request.json()

  const admin = createAdminClient()

  // Check if a row exists
  const { data: existing } = await admin
    .from('platform_branding')
    .select('id')
    .limit(1)
    .maybeSingle()

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  }

  // NOT NULL columns — fall back to DB defaults rather than nulling them out
  const notNullDefaults: Record<string, string> = {
    primary_color: '#E53935',
    secondary_color: '#0A0F1C',
    accent_color: '#00B4D8',
    bg_color: '#F5F7FA',
    dark_bg_color: '#0A0F1C',
    platform_name: 'ProStep2Market',
  }
  for (const [key, fallback] of Object.entries(notNullDefaults)) {
    payload[key] = body[key] ?? fallback
  }

  // Nullable columns — only include when explicitly sent in the request
  for (const key of ['logo_url', 'favicon_url', 'tagline', 'custom_css']) {
    if (key in body) payload[key] = body[key] ?? null
  }

  let data, error
  if (existing?.id) {
    ;({ data, error } = await admin
      .from('platform_branding')
      .update(payload)
      .eq('id', existing.id)
      .select()
      .single())
  } else {
    ;({ data, error } = await admin
      .from('platform_branding')
      .insert(payload)
      .select()
      .single())
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}
