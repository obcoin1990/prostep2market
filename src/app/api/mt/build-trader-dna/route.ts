/**
 * POST /api/mt/build-trader-dna
 * Body (optional): { connectionId }
 *
 * Analyses closed trade history and upserts trader_profiles with
 * auto-computed scores (risk, emotional stability, decision making,
 * trading behavior, learning style, profile type, learning path).
 *
 * Called automatically after each sync; also callable on demand.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildTraderDNA } from '@/lib/trader-dna/auto-builder'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let connectionId: string | undefined
  try {
    const body = await request.json()
    connectionId = body?.connectionId
  } catch { /* optional */ }

  try {
    const scores = await buildTraderDNA({ userId: user.id, connectionId })
    return NextResponse.json({ success: true, scores })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'DNA build failed' },
      { status: 500 }
    )
  }
}
