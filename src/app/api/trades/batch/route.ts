import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { tradeSchema } from '@/lib/validation'

// Helper: Calculate trade result and P&L
function calculateTradeResult(trade: {
  entryPrice: number
  exitPrice?: number | null
  stopLoss: number
  takeProfit: number
  lotSize: number
}) {
  if (!trade.exitPrice) {
    return { pnl: null, result: null }
  }

  const priceDiff = trade.exitPrice - trade.entryPrice
  const direction = trade.takeProfit > trade.stopLoss ? 1 : -1
  const pnl = priceDiff * trade.lotSize * 100000 * direction
  
  const result = pnl > 0 ? 'win' : pnl < 0 ? 'loss' : 'breakeven'
  return { pnl, result }
}

// Helper: Detect session from entry time
function detectSession(entryTime: string): string {
  const hour = new Date(entryTime).getUTCHours()
  if (hour >= 0 && hour < 8) return 'sydney'
  if (hour >= 8 && hour < 13) return 'london'
  if (hour >= 13 && hour < 21) return 'newyork'
  return 'asian'
}

/**
 * POST /api/trades/batch - Batch import trades
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: 'Expected array of trades' }, { status: 400 })
  }

  const valid: any[] = []
  const validationErrors: any[] = []

  for (let i = 0; i < body.length; i++) {
    const row = body[i]
    
    // Map CSV row to trade format
    const trade = {
      symbol: row.symbol?.toUpperCase(),
      entryPrice: parseFloat(row.entry_price),
      exitPrice: row.exit_price ? parseFloat(row.exit_price) : undefined,
      stopLoss: parseFloat(row.stop_loss),
      takeProfit: parseFloat(row.take_profit),
      lotSize: parseFloat(row.lot_size),
      entryTime: row.entry_time,
      exitTime: row.exit_time || undefined,
      session: row.session || undefined,
    }

    // Validate with Zod
    const result = tradeSchema.safeParse(trade)
    
    if (result.success) {
      const data = result.data
      const { pnl, result: resultValue } = calculateTradeResult({
        entryPrice: data.entryPrice,
        exitPrice: data.exitPrice,
        stopLoss: data.stopLoss,
        takeProfit: data.takeProfit,
        lotSize: data.lotSize,
      })

      valid.push({
        user_id: user.id,
        symbol: data.symbol.toUpperCase(),
        entry_price: data.entryPrice,
        exit_price: data.exitPrice,
        stop_loss: data.stopLoss,
        take_profit: data.takeProfit,
        lot_size: data.lotSize,
        entry_time: data.entryTime,
        exit_time: data.exitTime,
        session: data.session || detectSession(data.entryTime),
        result: resultValue,
        pnl: pnl,
      })
    } else {
      validationErrors.push({
        row: i + 1,
        issues: result.error.issues.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      })
    }
  }

  if (valid.length === 0) {
    return NextResponse.json({
      error: 'No valid trades',
      imported: 0,
      failed: validationErrors.length,
      errors: validationErrors,
    }, { status: 400 })
  }

  // Batch insert to database
  const { data, error } = await supabase
    .from('trades')
    .insert(valid)
    .select('id, symbol, entry_price, exit_price')

  if (error) {
    return NextResponse.json({
      error: error.message,
      imported: 0,
      failed: validationErrors.length + valid.length,
      errors: [...validationErrors, { row: 'batch', issues: [{ message: error.message }] }],
    }, { status: 500 })
  }

  return NextResponse.json({
    imported: data?.length || valid.length,
    failed: validationErrors.length,
    errors: validationErrors.slice(0, 20), // Return first 20 errors
  })
}