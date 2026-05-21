import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

type Params = { params: Promise<{ id: string }> }

// ─── DELETE /api/admin/strategy-lab/[id] ─────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const { id } = await params
  const admin = createAdminClient()

  // Delete child simulation_results first to avoid FK violations
  const { error: simError } = await admin
    .from('simulation_results')
    .delete()
    .eq('strategy_id', id)

  if (simError) {
    return NextResponse.json({ error: simError.message }, { status: 500 })
  }

  // Delete the strategy
  const { error } = await admin.from('strategies').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
