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
  const {
    primary_color,
    secondary_color,
    accent_color,
    bg_color,
    dark_bg_color,
    logo_url,
    favicon_url,
    platform_name,
    tagline,
    custom_css,
  } = body

  const admin = createAdminClient()

  // Check if a row exists
  const { data: existing } = await admin
    .from('platform_branding')
    .select('id')
    .limit(1)
    .maybeSingle()

  const payload = {
    primary_color: primary_color ?? null,
    secondary_color: secondary_color ?? null,
    accent_color: accent_color ?? null,
    bg_color: bg_color ?? null,
    dark_bg_color: dark_bg_color ?? null,
    logo_url: logo_url ?? null,
    favicon_url: favicon_url ?? null,
    platform_name: platform_name ?? null,
    tagline: tagline ?? null,
    custom_css: custom_css ?? null,
    updated_at: new Date().toISOString(),
    updated_by: user.id,
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
