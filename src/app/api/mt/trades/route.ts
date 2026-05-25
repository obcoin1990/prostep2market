/**
 * GET /api/mt/trades
 *
 * Query params:
 *   connectionId   (optional) filter by connection
 *   type           'open' | 'closed' (default 'open')
 *   limit          max rows (default 50, max 500)
 *   offset         pagination offset (default 0)
 *   symbol         filter by symbol
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sp           = request.nextUrl.searchParams
  const connectionId = sp.get('connectionId')
  const type         = sp.get('type') ?? 'open'
  const limit        = Math.min(500, parseInt(sp.get('limit') ?? '50', 10))
  const offset       = parseInt(sp.get('offset') ?? '0', 10)
  const symbol       = sp.get('symbol')

  const db = createAdminClient()

  if (type === 'open') {
    let q = db
      .from('mt_open_positions')
      .select('*')
      .eq('user_id', user.id)
      .order('open_time', { ascending: false })
      .range(offset, offset + limit - 1)

    if (connectionId) q = q.eq('connection_id', connectionId) as typeof q
    if (symbol)        q = q.eq('symbol', symbol.toUpperCase()) as typeof q

    const { data, error } = await q
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ trades: data ?? [] })
  }

  // Closed trades
  let q = db
    .from('mt_closed_trades')
    .select('*')
    .eq('user_id', user.id)
    .order('close_time', { ascending: false })
    .range(offset, offset + limit - 1)

  if (connectionId) q = q.eq('connection_id', connectionId) as typeof q
  if (symbol)        q = q.eq('symbol', symbol.toUpperCase()) as typeof q

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ trades: data ?? [] })
}
