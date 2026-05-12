import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Fields callers are allowed to update on a trade
const ALLOWED_PATCH_FIELDS = new Set([
  'symbol', 'entry_time', 'exit_time', 'entry_price', 'exit_price',
  'lot_size', 'take_profit', 'stop_loss', 'emotional_state', 'notes',
  'strategy', 'setup_type', 'tags',
  // camelCase aliases accepted from clients
  'exitPrice', 'entryPrice', 'lotSize', 'takeProfit', 'stopLoss',
  'emotionalState', 'entryTime', 'exitTime',
])

/**
 * GET /api/trades/[id] - Get a single trade by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({ trade: data })
}

/**
 * PATCH /api/trades/[id] - Update a trade
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Body must be a JSON object' }, { status: 400 })
  }

  // Strip unknown / dangerous fields
  const sanitized: Record<string, unknown> = {}
  for (const key of Object.keys(body)) {
    if (ALLOWED_PATCH_FIELDS.has(key)) {
      sanitized[key] = body[key]
    }
  }

  if (Object.keys(sanitized).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  // Recalculate P&L and result if exitPrice changed
  const exitPrice = (sanitized.exitPrice ?? sanitized.exit_price) as number | undefined
  const entryPrice = (sanitized.entryPrice ?? sanitized.entry_price) as number | undefined
  const lotSize = (sanitized.lotSize ?? sanitized.lot_size) as number | undefined
  const takeProfit = (sanitized.takeProfit ?? sanitized.take_profit) as number | undefined
  const stopLoss = (sanitized.stopLoss ?? sanitized.stop_loss) as number | undefined

  if (exitPrice !== undefined && entryPrice !== undefined && lotSize !== undefined) {
    const priceDiff = exitPrice - entryPrice
    const direction = (takeProfit ?? 0) > (stopLoss ?? 0) ? 1 : -1
    const pnl = priceDiff * lotSize * 100000 * direction
    sanitized.pnl = pnl
    sanitized.result = pnl > 0 ? 'win' : pnl < 0 ? 'loss' : 'breakeven'
  }

  const { data, error } = await supabase
    .from('trades')
    .update(sanitized)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ trade: data })
}

/**
 * DELETE /api/trades/[id] - Delete a trade
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
