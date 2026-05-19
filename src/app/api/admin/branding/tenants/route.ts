import { NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('enterprise_tenants')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function POST(request: Request) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const body = await request.json()
  const {
    name,
    slug,
    domain,
    contact_email,
    plan,
    primary_color,
    secondary_color,
    accent_color,
    logo_url,
    platform_name,
    custom_css,
    max_users,
    notes,
    active,
  } = body

  if (!name || !slug) {
    return NextResponse.json({ error: 'name and slug are required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('enterprise_tenants')
    .insert({
      name,
      slug,
      domain: domain ?? null,
      contact_email: contact_email ?? null,
      plan: plan ?? 'enterprise',
      primary_color: primary_color ?? null,
      secondary_color: secondary_color ?? null,
      accent_color: accent_color ?? null,
      logo_url: logo_url ?? null,
      platform_name: platform_name ?? null,
      custom_css: custom_css ?? null,
      max_users: max_users ?? 100,  // NOT NULL DEFAULT 100 in schema
      notes: notes ?? null,
      active: active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data }, { status: 201 })
}
