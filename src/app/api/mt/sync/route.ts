/**
 * POST /api/mt/sync
 * Body (optional): { connectionId }  — if omitted, syncs the user's first active connection.
 *
 * 1. Fetches account info, open positions, and recent history from MetaApi
 * 2. Persists everything to Supabase
 * 3. Triggers Risk Guardian alert check on the synced trades
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { syncMTConnection } from '@/lib/metaapi/sync'
import type { MTPlatform } from '@/types/mt-connection'

export async function POST(request: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // ── Resolve connection ─────────────────────────────────────────────────────
  let connectionId: string | undefined
  try {
    const body = await request.json()
    connectionId = body?.connectionId
  } catch { /* body optional */ }

  const db = createAdminClient()

  let query = db
    .from('mt_connections')
    .select('id, metaapi_account_id, platform, status')
    .eq('user_id', user.id)
    .eq('status', 'connected')

  if (connectionId) query = query.eq('id', connectionId) as typeof query

  // Also allow syncing while still 'connecting' (first sync transitions to 'connected')
  const { data: conns } = await db
    .from('mt_connections')
    .select('id, metaapi_account_id, platform, status')
    .eq('user_id', user.id)
    .in('status', ['connected', 'connecting'])
    .order('created_at', { ascending: false })
    .limit(connectionId ? 1 : 1)

  if (connectionId) {
    const match = conns?.find((c) => c.id === connectionId)
    if (!match) return NextResponse.json({ error: 'Connection not found or not active' }, { status: 404 })
  }

  const conn = conns?.[0]
  if (!conn) return NextResponse.json({ error: 'No active MT connection found' }, { status: 404 })

  if (!conn.metaapi_account_id) {
    return NextResponse.json({ error: 'MetaApi account ID not yet assigned' }, { status: 409 })
  }

  // ── Sync ──────────────────────────────────────────────────────────────────
  try {
    const result = await syncMTConnection({
      connectionId:      conn.id,
      userId:            user.id,
      metaapiAccountId:  conn.metaapi_account_id,
      platform:          conn.platform as MTPlatform,
    })

    // ── Trigger Risk Guardian ────────────────────────────────────────────────
    // Fire-and-forget: don't let a guardian error fail the sync response
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${request.headers.get('host')}`
    const cookie  = request.headers.get('cookie') ?? ''

    fetch(`${baseUrl}/api/alerts/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
    }).catch(() => { /* ignore */ })

    // ── Auto-build Trader DNA ────────────────────────────────────────────────
    fetch(`${baseUrl}/api/mt/build-trader-dna`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ connectionId: conn.id }),
    }).catch(() => { /* ignore */ })

    return NextResponse.json({ success: true, result })

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Sync failed'

    await db
      .from('mt_connections')
      .update({ status: 'error', sync_error: msg, updated_at: new Date().toISOString() })
      .eq('id', conn.id)

    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
