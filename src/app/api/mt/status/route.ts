/**
 * GET /api/mt/status
 *
 * Returns all MT connections for the logged-in user,
 * plus the latest open positions count for each.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(_request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createAdminClient()

  const { data: connections } = await db
    .from('mt_connections')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (!connections || connections.length === 0) {
    return NextResponse.json({ connections: [] })
  }

  // Augment each connection with open position count
  const enriched = await Promise.all(
    connections.map(async (c) => {
      const { count } = await db
        .from('mt_open_positions')
        .select('id', { count: 'exact', head: true })
        .eq('connection_id', c.id)
      return { ...c, open_positions_count: count ?? 0 }
    })
  )

  return NextResponse.json({ connections: enriched })
}
