/**
 * GET /api/mt/fxblue?username=xxx
 *
 * Pulls public statistics from an FX Blue shared profile.
 * The FX Blue account must have public sharing enabled.
 *
 * Also accepts: ?include=openpos,trades to fetch positions/history too.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getFXBlueStats, getFXBlueOpenPositions, getFXBlueTrades } from '@/lib/fxblue/client'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const username = request.nextUrl.searchParams.get('username')
  if (!username?.trim()) {
    return NextResponse.json({ error: 'username query param required' }, { status: 400 })
  }

  const include = (request.nextUrl.searchParams.get('include') ?? '').split(',')

  try {
    const stats = await getFXBlueStats(username.trim())

    const [openPositions, trades] = await Promise.all([
      include.includes('openpos') ? getFXBlueOpenPositions(username.trim()) : Promise.resolve(undefined),
      include.includes('trades')  ? getFXBlueTrades(username.trim())        : Promise.resolve(undefined),
    ])

    return NextResponse.json({
      source:   'fxblue',
      username: username.trim(),
      stats,
      ...(openPositions !== undefined && { openPositions }),
      ...(trades        !== undefined && { trades }),
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'FX Blue fetch failed'
    // 502 = upstream error (FX Blue unreachable or account not public)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
