import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

// ─── GET /api/admin/enterprise ───────────────────────────────────────────────
export async function GET(_req: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const admin = createAdminClient()

  const { data: tenants, error } = await admin
    .from('enterprise_tenants')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Count enterprise users per tenant via subscriptions
  const { data: subs } = await admin
    .from('subscriptions')
    .select('user_id, plan, status')
    .in('plan', ['enterprise', 'white_label'])

  // Build domain → user count map (plan matching is approximate — tenant domain not on subscription)
  // Instead we count all enterprise plan subscriptions globally and attach per plan slug
  const planCounts: Record<string, number> = {}
  for (const sub of subs ?? []) {
    const key = sub.plan ?? 'enterprise'
    planCounts[key] = (planCounts[key] ?? 0) + 1
  }

  const tenantsWithCounts = (tenants ?? []).map((t) => ({
    ...t,
    user_count: planCounts[t.plan] ?? 0,
  }))

  return NextResponse.json({ success: true, data: tenantsWithCounts })
}

// ─── POST /api/admin/enterprise ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  let body: {
    name: string
    slug: string
    domain?: string
    contact_email?: string
    plan?: string
    max_users?: number
    notes?: string
    primary_color?: string
    secondary_color?: string
    accent_color?: string
    logo_url?: string
    platform_name?: string
    custom_css?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { name, slug } = body
  if (!name || !slug) {
    return NextResponse.json({ error: 'name and slug are required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const now = new Date().toISOString()

  const { data, error } = await admin
    .from('enterprise_tenants')
    .insert({
      name,
      slug,
      domain: body.domain ?? null,
      contact_email: body.contact_email ?? null,
      plan: body.plan ?? 'enterprise',
      max_users: body.max_users ?? 100,
      notes: body.notes ?? null,
      primary_color: body.primary_color ?? '#E53935',
      secondary_color: body.secondary_color ?? null,
      accent_color: body.accent_color ?? null,
      logo_url: body.logo_url ?? null,
      platform_name: body.platform_name ?? null,
      custom_css: body.custom_css ?? null,
      active: true,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, data }, { status: 201 })
}
