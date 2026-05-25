/**
 * GET /api/mt/account-stats?connectionId=xxx
 *
 * Returns the latest account stats snapshot for the given connection.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const connectionId = request.nextUrl.searchParams.get('connectionId')
  const db = createAdminClient()

  // Build query — if no connectionId, use the user's latest active connection
  let conn: { id: string } | null = null

  if (connectionId) {
    const { data } = await db
      .from('mt_connections')
      .select('id')
      .eq('id', connectionId)
      .eq('user_id', user.id)
      .maybeSingle()
    conn = data
  } else {
    const { data } = await db
      .from('mt_connections')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['connected', 'connecting'])
      .order('last_sync_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    conn = data
  }

  if (!conn) return NextResponse.json({ stats: null })

  const { data: stats } = await db
    .from('mt_account_stats')
    .select('*')
    .eq('connection_id', conn.id)
    .order('snapshot_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return NextResponse.json({ stats: stats ?? null })
}
