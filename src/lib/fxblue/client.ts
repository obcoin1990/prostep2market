/**
 * FX Blue public statistics client.
 *
 * FX Blue allows traders to share their MT4/MT5 trading statistics publicly.
 * When sharing is enabled, stats are accessible at:
 *   https://www.fxblue.com/users/{username}/system/stats
 *
 * This is SUPPLEMENTARY to the MetaApi direct connection — it provides
 * richer historical stats for users who have an FX Blue public profile.
 *
 * The user's FX Blue username is stored in mt_connections.fxblue_username.
 */

const FXBLUE_BASE = 'https://www.fxblue.com/users'

export interface FXBlueStats {
  // Core metrics returned by FX Blue
  balance?: number
  equity?: number
  profit?: number
  deposits?: number
  withdrawals?: number
  trades?: number
  lots?: number
  pips?: number
  wonTrades?: number
  lostTrades?: number
  winRate?: number           // percentage 0–100
  profitFactor?: number
  averageWin?: number
  averageLoss?: number
  bestTrade?: number
  worstTrade?: number
  maxDrawdownPct?: number
  maxDrawdownValue?: number
  averageDuration?: number   // seconds
  longestWinStreak?: number
  longestLossStreak?: number
  sharpeRatio?: number
  currency?: string
  accountName?: string
  broker?: string
  platform?: string          // 'MT4' | 'MT5'
  startDate?: string
  lastUpdate?: string
  // Raw — anything else FX Blue sends
  raw?: Record<string, unknown>
}

export interface FXBlueOpenPosition {
  ticket: string
  symbol: string
  type: string              // 'buy' | 'sell'
  lots: number
  openPrice: number
  currentPrice?: number
  stopLoss?: number
  takeProfit?: number
  profit?: number
  openTime?: string
  magic?: number
  comment?: string
}

export interface FXBlueTrade {
  ticket: string
  symbol: string
  type: string
  lots: number
  openPrice: number
  closePrice: number
  stopLoss?: number
  takeProfit?: number
  profit: number
  swap?: number
  commission?: number
  openTime: string
  closeTime: string
  durationSeconds?: number
  pips?: number
  magic?: number
  comment?: string
}

// ─── Internal fetch helper ────────────────────────────────────────────────────

async function fxbFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'ProStep2Market/1.0',
      Accept: 'application/json, text/javascript, */*',
    },
    next: { revalidate: 0 },   // always fresh in Next.js cache
  })

  if (!res.ok) {
    throw new Error(`FX Blue fetch failed: ${res.status} ${url}`)
  }

  const text = await res.text()

  // FX Blue returns JSON-like data; some endpoints return JSONP
  // Try parsing as JSON first
  try {
    return JSON.parse(text) as T
  } catch {
    // Try stripping JSONP wrapper: "callback({...})"
    const match = text.match(/^[^(]+\((.+)\)\s*;?\s*$/)
    if (match) return JSON.parse(match[1]) as T
    throw new Error('FX Blue returned unparseable response')
  }
}

// ─── Public API functions ─────────────────────────────────────────────────────

/**
 * Fetch general account statistics from FX Blue public sharing.
 * The account must have public sharing enabled on fxblue.com.
 */
export async function getFXBlueStats(username: string): Promise<FXBlueStats> {
  const url = `${FXBLUE_BASE}/${encodeURIComponent(username)}/system/stats`
  const raw = await fxbFetch<Record<string, unknown>>(url)

  // FX Blue field name normalisation (they use various naming conventions)
  return {
    balance:           toNum(raw.balance ?? raw.Balance),
    equity:            toNum(raw.equity  ?? raw.Equity),
    profit:            toNum(raw.profit  ?? raw.Profit ?? raw.gain),
    deposits:          toNum(raw.deposits),
    withdrawals:       toNum(raw.withdrawals),
    trades:            toNum(raw.trades  ?? raw.numTrades),
    lots:              toNum(raw.lots),
    wonTrades:         toNum(raw.wonTrades ?? raw.winTrades),
    lostTrades:        toNum(raw.lostTrades ?? raw.lossTrades),
    winRate:           toNum(raw.winRate ?? raw.pctWon),
    profitFactor:      toNum(raw.profitFactor),
    averageWin:        toNum(raw.averageWin),
    averageLoss:       toNum(raw.averageLoss),
    bestTrade:         toNum(raw.bestTrade),
    worstTrade:        toNum(raw.worstTrade),
    maxDrawdownPct:    toNum(raw.maxDrawdownPct ?? raw.maxDD),
    maxDrawdownValue:  toNum(raw.maxDrawdownValue),
    averageDuration:   toNum(raw.averageDuration ?? raw.avgDuration),
    longestWinStreak:  toNum(raw.longestWinStreak ?? raw.maxConsecWins),
    longestLossStreak: toNum(raw.longestLossStreak ?? raw.maxConsecLosses),
    sharpeRatio:       toNum(raw.sharpeRatio ?? raw.sharpe),
    currency:          toStr(raw.currency ?? raw.Currency),
    accountName:       toStr(raw.accountName ?? raw.name),
    broker:            toStr(raw.broker),
    platform:          toStr(raw.platform),
    startDate:         toStr(raw.startDate ?? raw.fromDate),
    lastUpdate:        toStr(raw.lastUpdate ?? raw.updateTime),
    raw,
  }
}

/**
 * Fetch current open positions from FX Blue.
 */
export async function getFXBlueOpenPositions(username: string): Promise<FXBlueOpenPosition[]> {
  const url = `${FXBLUE_BASE}/${encodeURIComponent(username)}/system/openpos`
  try {
    const raw = await fxbFetch<unknown[]>(url)
    return (Array.isArray(raw) ? raw : []).map(normalisePosition)
  } catch {
    return []
  }
}

/**
 * Fetch recent trade history from FX Blue.
 * FX Blue may paginate or limit history; we take what they give.
 */
export async function getFXBlueTrades(username: string): Promise<FXBlueTrade[]> {
  const url = `${FXBLUE_BASE}/${encodeURIComponent(username)}/system/trades`
  try {
    const raw = await fxbFetch<unknown[]>(url)
    return (Array.isArray(raw) ? raw : []).map(normaliseTrade)
  } catch {
    return []
  }
}

// ─── Normalisers ──────────────────────────────────────────────────────────────

function toNum(v: unknown): number | undefined {
  const n = parseFloat(String(v))
  return isNaN(n) ? undefined : n
}

function toStr(v: unknown): string | undefined {
  return v != null ? String(v) : undefined
}

function normalisePosition(r: unknown): FXBlueOpenPosition {
  const v = r as Record<string, unknown>
  return {
    ticket:       toStr(v.ticket ?? v.id) ?? '',
    symbol:       toStr(v.symbol) ?? '',
    type:         (toStr(v.type) ?? 'buy').toLowerCase(),
    lots:         toNum(v.lots ?? v.volume) ?? 0,
    openPrice:    toNum(v.openPrice ?? v.open) ?? 0,
    currentPrice: toNum(v.currentPrice ?? v.price),
    stopLoss:     toNum(v.stopLoss ?? v.sl),
    takeProfit:   toNum(v.takeProfit ?? v.tp),
    profit:       toNum(v.profit),
    openTime:     toStr(v.openTime ?? v.time),
    magic:        toNum(v.magic),
    comment:      toStr(v.comment),
  }
}

function normaliseTrade(r: unknown): FXBlueTrade {
  const v = r as Record<string, unknown>
  const openTs  = toStr(v.openTime  ?? v.opentime  ?? v.open_time)
  const closeTs = toStr(v.closeTime ?? v.closetime ?? v.close_time)
  let dur = toNum(v.duration ?? v.durationSeconds)
  if (dur == null && openTs && closeTs) {
    dur = Math.round((new Date(closeTs).getTime() - new Date(openTs).getTime()) / 1000)
  }
  return {
    ticket:          toStr(v.ticket ?? v.id) ?? '',
    symbol:          toStr(v.symbol) ?? '',
    type:            (toStr(v.type) ?? 'buy').toLowerCase(),
    lots:            toNum(v.lots ?? v.volume) ?? 0,
    openPrice:       toNum(v.openPrice ?? v.open) ?? 0,
    closePrice:      toNum(v.closePrice ?? v.close) ?? 0,
    stopLoss:        toNum(v.stopLoss ?? v.sl),
    takeProfit:      toNum(v.takeProfit ?? v.tp),
    profit:          toNum(v.profit) ?? 0,
    swap:            toNum(v.swap),
    commission:      toNum(v.commission),
    openTime:        openTs ?? '',
    closeTime:       closeTs ?? '',
    durationSeconds: dur,
    pips:            toNum(v.pips),
    magic:           toNum(v.magic),
    comment:         toStr(v.comment),
  }
}
