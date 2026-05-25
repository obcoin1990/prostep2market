/**
 * POST /api/mt/connect
 * Body: { platform, brokerServer, accountNumber, investorPassword }
 *
 * 1. Validates the request
 * 2. Creates a MetaApi cloud terminal (investor password = read-only)
 * 3. Persists the connection row in mt_connections
 * 4. Returns the connection record (no password stored or echoed)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { provisionAccount } from '@/lib/metaapi/client'
import type { ConnectMTRequest, MTPlatform } from '@/types/mt-connection'

export async function POST(request: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // ── Validate body ─────────────────────────────────────────────────────────
  let body: ConnectMTRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { platform, brokerServer, accountNumber, investorPassword } = body

  if (!platform || !['mt4', 'mt5'].includes(platform)) {
    return NextResponse.json({ error: 'platform must be "mt4" or "mt5"' }, { status: 400 })
  }
  if (!brokerServer?.trim())     return NextResponse.json({ error: 'brokerServer is required' }, { status: 400 })
  if (!accountNumber?.trim())    return NextResponse.json({ error: 'accountNumber is required' }, { status: 400 })
  if (!investorPassword?.trim()) return NextResponse.json({ error: 'investorPassword is required' }, { status: 400 })

  const db = createAdminClient()

  // ── Check for existing active connection ──────────────────────────────────
  const { data: existing } = await db
    .from('mt_connections')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('broker_server', brokerServer.trim())
    .eq('account_number', accountNumber.trim())
    .neq('status', 'disconnected')
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: 'This account is already connected. Disconnect it first.' },
      { status: 409 }
    )
  }

  // ── Create placeholder row (pending) ──────────────────────────────────────
  const { data: conn, error: insertErr } = await db
    .from('mt_connections')
    .insert({
      user_id:        user.id,
      platform:       platform as MTPlatform,
      broker_server:  brokerServer.trim(),
      account_number: accountNumber.trim(),
      status:         'connecting',
    })
    .select()
    .single()

  if (insertErr || !conn) {
    return NextResponse.json({ error: insertErr?.message ?? 'DB insert failed' }, { status: 500 })
  }

  // ── Provision MetaApi terminal ─────────────────────────────────────────────
  try {
    const metaAccount = await provisionAccount({
      platform: platform as MTPlatform,
      server:   brokerServer.trim(),
      login:    accountNumber.trim(),
      password: investorPassword.trim(),
      name:     `ProStep-${user.id.slice(0, 8)}-${accountNumber}`,
    })

    await db
      .from('mt_connections')
      .update({
        metaapi_account_id: metaAccount.id,
        status: 'connecting',   // MetaApi deploys async; status will be updated on first sync
        updated_at: new Date().toISOString(),
      })
      .eq('id', conn.id)

    const { data: updated } = await db
      .from('mt_connections')
      .select('*')
      .eq('id', conn.id)
      .single()

    return NextResponse.json({ connection: updated })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'MetaApi provisioning failed'
    await db
      .from('mt_connections')
      .update({ status: 'error', sync_error: msg, updated_at: new Date().toISOString() })
      .eq('id', conn.id)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
