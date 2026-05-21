import { NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

function maskSecretKey(key: string | null): string | null {
  if (!key) return null
  if (key.length <= 4) return '****'
  return '****' + key.slice(-4)
}

export async function GET() {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('payment_gateways')
    .select('*')
    .order('provider', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const masked = (data ?? []).map((row) => ({
    ...row,
    secret_key: maskSecretKey(row.secret_key),
    webhook_secret: maskSecretKey(row.webhook_secret),
  }))

  return NextResponse.json({ success: true, data: masked })
}

export async function PUT(request: Request) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const body = await request.json()
  const { provider, public_key, secret_key, webhook_url, webhook_secret, test_mode, active, extra_config } = body

  if (!provider) {
    return NextResponse.json({ error: 'provider is required' }, { status: 400 })
  }

  const admin = createAdminClient()

  // If setting active=true, deactivate all others first
  if (active === true) {
    await admin
      .from('payment_gateways')
      .update({ active: false })
      .neq('provider', provider)
  }

  // Build update payload — only include secret fields if they aren't masked placeholders
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (public_key !== undefined) updates.public_key = public_key
  if (webhook_url !== undefined) updates.webhook_url = webhook_url
  if (test_mode !== undefined) updates.test_mode = test_mode
  if (active !== undefined) updates.active = active
  if (extra_config !== undefined) updates.extra_config = extra_config
  // Only update secrets if they are non-empty and not masked placeholder values (WR-12)
  // The client sends back '****xxxx' for masked keys — reject those as-is.
  if (secret_key !== undefined && String(secret_key).trim() !== '' && !String(secret_key).startsWith('****')) {
    updates.secret_key = secret_key
  }
  if (webhook_secret !== undefined && String(webhook_secret).trim() !== '' && !String(webhook_secret).startsWith('****')) {
    updates.webhook_secret = webhook_secret
  }

  // Upsert — insert if not exists
  const { data: existing } = await admin
    .from('payment_gateways')
    .select('id')
    .eq('provider', provider)
    .maybeSingle()

  let data, error
  if (existing?.id) {
    ;({ data, error } = await admin
      .from('payment_gateways')
      .update(updates)
      .eq('provider', provider)
      .select()
      .single())
  } else {
    ;({ data, error } = await admin
      .from('payment_gateways')
      .insert({ provider, ...updates })
      .select()
      .single())
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const responseData = {
    ...data,
    secret_key: maskSecretKey(data.secret_key),
    webhook_secret: maskSecretKey(data.webhook_secret),
  }

  return NextResponse.json({ success: true, data: responseData })
}
