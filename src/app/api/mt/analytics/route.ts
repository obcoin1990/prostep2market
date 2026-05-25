/**
 * GET /api/mt/analytics?connectionId=xxx
 *
 * Computes and returns comprehensive analytics from mt_closed_trades.
 * Computation is server-side; result is suitable for direct chart rendering.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { computeAnalytics } from '@/lib/mt-analytics/compute'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const connectionId = request.nextUrl.searchParams.get('connectionId') ?? undefined

  try {
    const analytics = await computeAnalytics({ userId: user.id, connectionId })
    return NextResponse.json({ analytics })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Analytics computation failed' },
      { status: 500 }
    )
  }
}
