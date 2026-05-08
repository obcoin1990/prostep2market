import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { tradeSchema } from '@/lib/validation'

/**
 * GET /api/trades - List trades with pagination and filters
 */
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const symbol = searchParams.get('symbol')
  const session = searchParams.get('session')
  const emotion = searchParams.get('emotion')
  const dateFrom = searchParams.get('dateFrom')
  const dateTo = searchParams.get('dateTo')
  const notes = searchParams.get('notes')
  const offset = (page - 1) * limit

  let query = supabase
    .from('trades')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('entry_time', { ascending: false })
    .range(offset, offset + limit - 1)

  if (symbol) query = query.eq('symbol', symbol)
  if (session) query = query.eq('session', session)
  if (emotion) query = query.eq('emotional_state', emotion)
  if (dateFrom) query = query.gte('entry_time', dateFrom)
  if (dateTo) query = query.lte('entry_time', dateTo)
  if (notes) query = query.ilike('notes', `%${notes}%`)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    trades: data,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil((count || 0) / limit)
    }
  })
}

/**
 * POST /api/trades - Create a new trade
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  // Validate with Zod
  const result = tradeSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 })
  }

  const trade = result.data
  
  // Calculate result and P&L if exit price exists
  let pnl: number | null = null
  let resultValue: 'win' | 'loss' | 'breakeven' | null = null
  
  if (trade.exitPrice) {
    const priceDiff = trade.exitPrice - trade.entryPrice
    const direction = trade.takeProfit > trade.stopLoss ? 1 : -1
    pnl = priceDiff * trade.lotSize * 100000 * direction
    
    if (pnl > 0) resultValue = 'win'
    else if (pnl < 0) resultValue = 'loss'
    else resultValue = 'breakeven'
  }

  // Auto-detect session from entryTime if not provided
  let session = trade.session
  if (!session && trade.entryTime) {
    const hour = new Date(trade.entryTime).getUTCHours()
    if (hour >= 0 && hour < 8) session = 'sydney'
    else if (hour >= 8 && hour < 13) session = 'london'
    else if (hour >= 13 && hour < 21) session = 'newyork'
    else session = 'asian'
  }

  const { data, error } = await supabase
    .from('trades')
    .insert({
      user_id: user.id,
      symbol: trade.symbol.toUpperCase(),
      entry_price: trade.entryPrice,
      exit_price: trade.exitPrice,
      stop_loss: trade.stopLoss,
      take_profit: trade.takeProfit,
      lot_size: trade.lotSize,
      entry_time: trade.entryTime,
      exit_time: trade.exitTime,
      session: session,
      result: resultValue,
      pnl: pnl,
      screenshot_url: trade.screenshotUrl,
      confidence_score: trade.confidenceScore,
      stress_score: trade.stressScore,
      emotional_state: trade.emotionalState,
      triggers: trade.triggers,
      pre_trade_plan_adherence: trade.preTradePlanAdherence,
      notes: trade.notes,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ trade: data })
}