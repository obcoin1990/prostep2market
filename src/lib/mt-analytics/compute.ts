/**
 * Server-side analytics engine for MT closed trades stored in mt_closed_trades.
 * All computation happens here; the API route just calls computeAnalytics().
 */

import { createAdminClient } from '@/lib/supabase/admin'
import type { MTClosedTrade } from '@/types/mt-connection'

// ─── Output types ─────────────────────────────────────────────────────────────

export interface EquityPoint {
  date: string          // ISO date string
  equity: number        // running cumulative P&L
  drawdown: number      // drawdown from peak (negative number or 0)
  trades: number        // trades closed on this date
}

export interface SessionCell {
  hour: number          // 0–23 UTC
  day: number           // 0 = Mon … 6 = Sun
  profit: number
  trades: number
  winRate: number       // 0–100
}

export interface SymbolStat {
  symbol: string
  trades: number
  wins: number
  winRate: number       // 0–100
  profit: number
  avgDurationSeconds: number | null
  avgRR: number | null
}

export interface PerformanceMetrics {
  totalTrades: number
  winRate: number           // 0–100
  profitFactor: number      // gross profit / |gross loss|; Infinity if no losses
  netProfit: number
  avgWin: number
  avgLoss: number           // positive number
  avgRR: number | null
  maxDrawdown: number       // positive number = max peak-to-trough
  maxDrawdownPct: number    // as % of peak equity
  sharpeRatio: number | null
  avgDurationMinutes: number | null
  longestWinStreak: number
  longestLossStreak: number
  bestTrade: number
  worstTrade: number
  totalVolume: number       // sum of lots
  tradedSymbols: number
  avgTradesPerDay: number
}

export interface TradePattern {
  type: 'scalping' | 'overtrading' | 'revenge' | 'large_loss' | 'no_sl' | 'no_tp' | 'late_session'
  count: number
  description: string
  severity: 'low' | 'medium' | 'high'
}

export interface AnalyticsResult {
  metrics: PerformanceMetrics
  equityCurve: EquityPoint[]
  sessionHeatmap: SessionCell[]
  symbolStats: SymbolStat[]
  patterns: TradePattern[]
  generatedAt: string
  tradeCount: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isoDate(ts: string | null): string {
  if (!ts) return ''
  return ts.slice(0, 10)  // 'YYYY-MM-DD'
}

function dayOfWeek(ts: string | null): number {
  if (!ts) return 0
  const d = new Date(ts)
  // getDay(): 0=Sun…6=Sat → remap to 0=Mon…6=Sun
  return (d.getUTCDay() + 6) % 7
}

function hourOfDay(ts: string | null): number {
  if (!ts) return 0
  return new Date(ts).getUTCHours()
}

/** Annualised Sharpe from array of daily returns. */
function sharpe(dailyReturns: number[]): number | null {
  if (dailyReturns.length < 5) return null
  const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length
  const variance = dailyReturns.reduce((a, b) => a + (b - mean) ** 2, 0) / dailyReturns.length
  const std = Math.sqrt(variance)
  if (std === 0) return null
  return parseFloat(((mean / std) * Math.sqrt(252)).toFixed(2))
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function computeAnalytics(opts: {
  userId: string
  connectionId?: string
  maxTrades?: number
}): Promise<AnalyticsResult> {
  const db = createAdminClient()

  // Fetch closed trades (up to maxTrades, newest first then reversed for chronology)
  let q = db
    .from('mt_closed_trades')
    .select('*')
    .eq('user_id', opts.userId)
    .order('close_time', { ascending: false })
    .limit(opts.maxTrades ?? 2000)

  if (opts.connectionId) q = q.eq('connection_id', opts.connectionId) as typeof q

  const { data: rawTrades } = await q
  const trades: MTClosedTrade[] = (rawTrades ?? []).reverse()   // chronological

  const now = new Date().toISOString()

  if (trades.length === 0) {
    return {
      metrics: emptyMetrics(),
      equityCurve: [],
      sessionHeatmap: [],
      symbolStats: [],
      patterns: [],
      generatedAt: now,
      tradeCount: 0,
    }
  }

  // ── Core metrics ────────────────────────────────────────────────────────────

  let grossProfit = 0
  let grossLoss   = 0
  let sumWin      = 0
  let sumLoss     = 0
  let wins        = 0
  let losses      = 0
  let sumDuration = 0
  let durationCount = 0
  let sumRR       = 0
  let rrCount     = 0
  let totalVolume = 0
  let bestTrade   = -Infinity
  let worstTrade  = Infinity
  const symbols   = new Set<string>()

  for (const t of trades) {
    const p = t.profit ?? 0
    const c = (t.commission ?? 0) + (t.swap ?? 0)
    const net = p + c

    if (net > 0) { wins++; grossProfit += net; sumWin += net }
    else if (net < 0) { losses++; grossLoss += Math.abs(net); sumLoss += Math.abs(net) }

    if (net > bestTrade)  bestTrade  = net
    if (net < worstTrade) worstTrade = net

    if (t.duration_seconds != null) {
      sumDuration += t.duration_seconds
      durationCount++
    }

    // RR: avgWin / avgLoss ratio per trade if we have both sides
    if (net > 0 && t.stop_loss != null && t.open_price != null) {
      const risk = Math.abs(t.open_price - t.stop_loss) * (t.volume ?? 1)
      if (risk > 0) { sumRR += net / risk; rrCount++ }
    }

    totalVolume += t.volume ?? 0
    symbols.add(t.symbol)
  }

  const totalTrades    = trades.length
  const winRate        = totalTrades > 0 ? (wins / totalTrades) * 100 : 0
  const profitFactor   = grossLoss > 0 ? parseFloat((grossProfit / grossLoss).toFixed(2)) : Infinity
  const netProfit      = grossProfit - grossLoss
  const avgWin         = wins   > 0 ? sumWin   / wins   : 0
  const avgLoss        = losses > 0 ? sumLoss   / losses : 0
  const avgRR          = rrCount > 0 ? parseFloat((sumRR / rrCount).toFixed(2)) : null
  const avgDurMins     = durationCount > 0 ? Math.round(sumDuration / durationCount / 60) : null

  // ── Win/loss streaks ────────────────────────────────────────────────────────
  let longestWinStreak = 0, longestLossStreak = 0
  let curWin = 0, curLoss = 0
  for (const t of trades) {
    const p = (t.profit ?? 0) + (t.commission ?? 0) + (t.swap ?? 0)
    if (p > 0) { curWin++; curLoss = 0 }
    else        { curLoss++; curWin = 0 }
    if (curWin  > longestWinStreak)  longestWinStreak  = curWin
    if (curLoss > longestLossStreak) longestLossStreak = curLoss
  }

  // ── Equity curve + drawdown ─────────────────────────────────────────────────
  const dailyMap = new Map<string, { profit: number; trades: number }>()
  for (const t of trades) {
    const d = isoDate(t.close_time)
    if (!d) continue
    const prev = dailyMap.get(d) ?? { profit: 0, trades: 0 }
    prev.profit += (t.profit ?? 0) + (t.commission ?? 0) + (t.swap ?? 0)
    prev.trades++
    dailyMap.set(d, prev)
  }

  const dailyReturns: number[] = []
  const equityCurve: EquityPoint[] = []
  let running = 0
  let peak    = 0
  let maxDD   = 0
  let maxDDPct = 0

  for (const [date, day] of [...dailyMap.entries()].sort()) {
    running += day.profit
    if (running > peak) peak = running
    const dd = peak > 0 ? running - peak : 0
    const ddPct = peak > 0 ? (dd / peak) * 100 : 0
    if (dd < maxDD) { maxDD = dd; maxDDPct = ddPct }
    dailyReturns.push(day.profit)
    equityCurve.push({
      date,
      equity:   parseFloat(running.toFixed(2)),
      drawdown: parseFloat(dd.toFixed(2)),
      trades:   day.trades,
    })
  }

  // Trading days span
  const firstDate = equityCurve[0]?.date
  const lastDate  = equityCurve[equityCurve.length - 1]?.date
  let tradingDays = 1
  if (firstDate && lastDate) {
    tradingDays = Math.max(1,
      (new Date(lastDate).getTime() - new Date(firstDate).getTime()) / 86400000 + 1
    )
  }

  // ── Session heatmap (hour × weekday) ────────────────────────────────────────
  const heatMap = new Map<string, { profit: number; trades: number; wins: number }>()
  for (const t of trades) {
    const h = hourOfDay(t.close_time)
    const d = dayOfWeek(t.close_time)
    const key = `${h}:${d}`
    const prev = heatMap.get(key) ?? { profit: 0, trades: 0, wins: 0 }
    const p = (t.profit ?? 0) + (t.commission ?? 0) + (t.swap ?? 0)
    prev.profit += p
    prev.trades++
    if (p > 0) prev.wins++
    heatMap.set(key, prev)
  }

  const sessionHeatmap: SessionCell[] = []
  for (const [key, v] of heatMap) {
    const [hs, ds] = key.split(':')
    sessionHeatmap.push({
      hour:    parseInt(hs),
      day:     parseInt(ds),
      profit:  parseFloat(v.profit.toFixed(2)),
      trades:  v.trades,
      winRate: v.trades > 0 ? parseFloat(((v.wins / v.trades) * 100).toFixed(1)) : 0,
    })
  }

  // ── Symbol breakdown ─────────────────────────────────────────────────────────
  const symMap = new Map<string, {
    wins: number; trades: number; profit: number
    durSum: number; durCount: number
    rrSum: number; rrCount: number
  }>()

  for (const t of trades) {
    const sym = t.symbol
    const prev = symMap.get(sym) ?? { wins: 0, trades: 0, profit: 0, durSum: 0, durCount: 0, rrSum: 0, rrCount: 0 }
    const p = (t.profit ?? 0) + (t.commission ?? 0) + (t.swap ?? 0)
    prev.trades++
    prev.profit += p
    if (p > 0) prev.wins++
    if (t.duration_seconds != null) { prev.durSum += t.duration_seconds; prev.durCount++ }
    symMap.set(sym, prev)
  }

  const symbolStats: SymbolStat[] = [...symMap.entries()]
    .map(([symbol, v]) => ({
      symbol,
      trades:              v.trades,
      wins:                v.wins,
      winRate:             parseFloat(((v.wins / v.trades) * 100).toFixed(1)),
      profit:              parseFloat(v.profit.toFixed(2)),
      avgDurationSeconds:  v.durCount > 0 ? Math.round(v.durSum / v.durCount) : null,
      avgRR:               v.rrCount  > 0 ? parseFloat((v.rrSum / v.rrCount).toFixed(2)) : null,
    }))
    .sort((a, b) => b.trades - a.trades)

  // ── Trade patterns (mistakes / highlights) ──────────────────────────────────
  const patterns: TradePattern[] = []

  const scalpCount = trades.filter((t) => (t.duration_seconds ?? Infinity) < 60).length
  if (scalpCount > 0) patterns.push({
    type: 'scalping', count: scalpCount,
    description: `${scalpCount} trade${scalpCount > 1 ? 's' : ''} closed under 60 seconds`,
    severity: scalpCount > 5 ? 'high' : 'medium',
  })

  const noSL = trades.filter((t) => t.stop_loss == null || t.stop_loss === 0).length
  if (noSL > 0) patterns.push({
    type: 'no_sl', count: noSL,
    description: `${noSL} trade${noSL > 1 ? 's' : ''} opened without a stop-loss`,
    severity: noSL > 3 ? 'high' : 'medium',
  })

  const noTP = trades.filter((t) => t.take_profit == null || t.take_profit === 0).length
  if (noTP > 0) patterns.push({
    type: 'no_tp', count: noTP,
    description: `${noTP} trade${noTP > 1 ? 's' : ''} without a take-profit`,
    severity: 'low',
  })

  // Large loss: any single loss > 2× average loss
  if (avgLoss > 0) {
    const largeLosses = trades.filter((t) => {
      const p = (t.profit ?? 0) + (t.commission ?? 0) + (t.swap ?? 0)
      return p < -(avgLoss * 2)
    }).length
    if (largeLosses > 0) patterns.push({
      type: 'large_loss', count: largeLosses,
      description: `${largeLosses} loss${largeLosses > 1 ? 'es' : ''} larger than 2× average loss`,
      severity: 'high',
    })
  }

  // Overtrading: >20 trades in a single day
  for (const [date, day] of dailyMap) {
    if (day.trades > 20) {
      patterns.push({
        type: 'overtrading', count: day.trades,
        description: `${day.trades} trades on ${date} — possible overtrading`,
        severity: 'high',
      })
      break // only flag once
    }
  }

  return {
    metrics: {
      totalTrades,
      winRate:              parseFloat(winRate.toFixed(1)),
      profitFactor,
      netProfit:            parseFloat(netProfit.toFixed(2)),
      avgWin:               parseFloat(avgWin.toFixed(2)),
      avgLoss:              parseFloat(avgLoss.toFixed(2)),
      avgRR,
      maxDrawdown:          parseFloat(Math.abs(maxDD).toFixed(2)),
      maxDrawdownPct:       parseFloat(Math.abs(maxDDPct).toFixed(1)),
      sharpeRatio:          sharpe(dailyReturns),
      avgDurationMinutes:   avgDurMins,
      longestWinStreak,
      longestLossStreak,
      bestTrade:            bestTrade === -Infinity ? 0 : parseFloat(bestTrade.toFixed(2)),
      worstTrade:           worstTrade === Infinity ? 0 : parseFloat(worstTrade.toFixed(2)),
      totalVolume:          parseFloat(totalVolume.toFixed(2)),
      tradedSymbols:        symbols.size,
      avgTradesPerDay:      parseFloat((totalTrades / tradingDays).toFixed(1)),
    },
    equityCurve,
    sessionHeatmap,
    symbolStats,
    patterns,
    generatedAt: now,
    tradeCount: totalTrades,
  }
}

function emptyMetrics(): PerformanceMetrics {
  return {
    totalTrades: 0, winRate: 0, profitFactor: 0, netProfit: 0,
    avgWin: 0, avgLoss: 0, avgRR: null, maxDrawdown: 0, maxDrawdownPct: 0,
    sharpeRatio: null, avgDurationMinutes: null, longestWinStreak: 0,
    longestLossStreak: 0, bestTrade: 0, worstTrade: 0, totalVolume: 0,
    tradedSymbols: 0, avgTradesPerDay: 0,
  }
}
