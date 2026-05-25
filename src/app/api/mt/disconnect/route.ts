/**
 * DELETE /api/mt/disconnect?connectionId=xxx
 *
 * Undeploys the MetaApi terminal and marks the connection as disconnected.
 * All historical trade data is preserved in the database.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { undeployAccount } from '@/lib/metaapi/client'

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const connectionId = request.nextUrl.searchParams.get('connectionId')
  if (!connectionId) {
    return NextResponse.json({ error: 'connectionId query param required' }, { status: 400 })
  }

  const db = createAdminClient()

  // Verify ownership
  const { data: conn } = await db
    .from('mt_connections')
    .select('id, user_id, metaapi_account_id, status')
    .eq('id', connectionId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!conn) {
    return NextResponse.json({ error: 'Connection not found' }, { status: 404 })
  }

  if (conn.status === 'disconnected') {
    return NextResponse.json({ message: 'Already disconnected' })
  }

  // Undeploy MetaApi terminal (best-effort — don't fail if already gone)
  if (conn.metaapi_account_id) {
    try {
      await undeployAccount(conn.metaapi_account_id)
    } catch {
      // Terminal might already be undeployed; proceed
    }
  }

  await db
    .from('mt_connections')
    .update({ status: 'disconnected', updated_at: new Date().toISOString() })
    .eq('id', connectionId)

  // Remove open positions (they're stale now)
  await db.from('mt_open_positions').delete().eq('connection_id', connectionId)

  return NextResponse.json({ success: true })
}
