/**
 * Orchestrates a full MetaApi sync for one MT connection:
 *   1. Fetch account info → write mt_account_stats snapshot
 *   2. Fetch open positions → upsert mt_open_positions (delete stale)
 *   3. Fetch recent history → insert new mt_closed_trades
 *   4. Update mt_connections.last_sync_at / status
 */

import {
  getAccountInformation,
  getHistoryDeals,
  getPositions,
} from './client'
import { createAdminClient } from '@/lib/supabase/admin'
import type {
  MetaApiDeal,
  MetaApiPosition,
  MTPlatform,
  SyncResult,
} from '@/types/mt-connection'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function positionOrderType(type: string): 'buy' | 'sell' {
  return type.toLowerCase().includes('sell') ? 'sell' : 'buy'
}

function dealOrderType(type: string): 'buy' | 'sell' {
  return type.toLowerCase().includes('sell') ? 'sell' : 'buy'
}

/** Duration in whole seconds between two ISO timestamp strings. */
function durationSeconds(open?: string | null, close?: string | null): number | null {
  if (!open || !close) return null
  const diff = (new Date(close).getTime() - new Date(open).getTime()) / 1000
  return Math.max(0, Math.round(diff))
}

/** Only deal types that represent actual trades (not deposits/withdrawals). */
const TRADE_DEAL_TYPES = new Set([
  'DEAL_TYPE_BUY',
  'DEAL_TYPE_SELL',
  'DEAL_TYPE_BUY_CANCELED',
  'DEAL_TYPE_SELL_CANCELED',
])

// ─── Main sync function ───────────────────────────────────────────────────────

export async function syncMTConnection(opts: {
  connectionId: string
  userId: string
  metaapiAccountId: string
  platform: MTPlatform
  /** Fetch history back this many days (default 30). */
  historyDays?: number
}): Promise<SyncResult> {
  const { connectionId, userId, metaapiAccountId, platform } = opts
  const historyDays = opts.historyDays ?? 30
  const db = createAdminClient()
  const now = new Date()

  // ── 1. Account information ────────────────────────────────────────────────

  const info = await getAccountInformation(metaapiAccountId)

  const statsRow = {
    connection_id: connectionId,
    user_id:       userId,
    balance:       info.balance      ?? null,
    equity:        info.equity       ?? null,
    margin:        info.margin       ?? null,
    free_margin:   info.freeMargin   ?? null,
    margin_level:  info.marginLevel  ?? null,
    profit:        info.profit       ?? null,
    currency:      info.currency     ?? null,
    leverage:      info.leverage     ?? null,
    snapshot_at:   now.toISOString(),
  }

  await db.from('mt_account_stats').insert(statsRow)

  // ── 2. Open positions ─────────────────────────────────────────────────────

  let rawPositions: MetaApiPosition[] = []
  try {
    rawPositions = await getPositions(metaapiAccountId)
  } catch {
    // Terminal might not yet have positions or be briefly unavailable
  }

  const positionRows = rawPositions.map((p) => ({
    connection_id: connectionId,
    user_id:       userId,
    position_id:   String(p.id),
    symbol:        p.symbol,
    platform,
    order_type:    positionOrderType(p.type),
    volume:        p.volume,
    open_price:    p.openPrice    ?? null,
    current_price: p.currentPrice ?? null,
    stop_loss:     p.stopLoss     ?? null,
    take_profit:   p.takeProfit   ?? null,
    profit:        p.profit       ?? null,
    swap:          p.swap         ?? null,
    commission:    p.commission   ?? null,
    magic_number:  p.magic        ?? null,
    comment:       p.comment      ?? null,
    open_time:     p.time         ?? null,
    last_updated:  now.toISOString(),
  }))

  // Upsert current positions
  if (positionRows.length > 0) {
    await db.from('mt_open_positions').upsert(positionRows, {
      onConflict: 'connection_id,position_id',
    })
  }

  // Remove positions that are no longer open (closed since last sync)
  const currentIds = rawPositions.map((p) => String(p.id))
  if (currentIds.length > 0) {
    await db
      .from('mt_open_positions')
      .delete()
      .eq('connection_id', connectionId)
      .not('position_id', 'in', `(${currentIds.map((id) => `'${id}'`).join(',')})`)
  } else {
    // All positions closed
    await db.from('mt_open_positions').delete().eq('connection_id', connectionId)
  }

  // ── 3. Closed trade history ───────────────────────────────────────────────

  const fromDate = new Date(now.getTime() - historyDays * 24 * 60 * 60 * 1000)
  let rawDeals: MetaApiDeal[] = []
  try {
    rawDeals = await getHistoryDeals(metaapiAccountId, fromDate, now)
  } catch {
    // History may be temporarily unavailable
  }

  // We only care about trade deals (buy/sell entries and exits)
  const tradeDeals = rawDeals.filter(
    (d) => d.symbol && TRADE_DEAL_TYPES.has(d.type)
  )

  // Build a map of positionId → entry deal for pairing open/close times
  const entryMap = new Map<string, MetaApiDeal>()
  for (const d of tradeDeals) {
    if (d.entryType === 'DEAL_ENTRY_IN' && d.positionId) {
      entryMap.set(d.positionId, d)
    }
  }

  const closedRows = tradeDeals
    .filter((d) => d.entryType === 'DEAL_ENTRY_OUT' && d.symbol)
    .map((d) => {
      const entry = d.positionId ? entryMap.get(d.positionId) : undefined
      return {
        connection_id:    connectionId,
        user_id:          userId,
        deal_id:          String(d.id),
        position_id:      d.positionId ?? null,
        symbol:           d.symbol!,
        platform,
        order_type:       dealOrderType(d.type),
        volume:           d.volume      ?? null,
        open_price:       entry?.price  ?? null,
        close_price:      d.price       ?? null,
        stop_loss:        null,          // MetaApi deals don't carry SL/TP
        take_profit:      null,
        profit:           d.profit      ?? null,
        swap:             d.swap        ?? null,
        commission:       d.commission  ?? null,
        magic_number:     d.magic       ?? null,
        comment:          d.comment     ?? null,
        open_time:        entry?.time   ?? null,
        close_time:       d.time        ?? null,
        duration_seconds: durationSeconds(entry?.time, d.time),
        synced_at:        now.toISOString(),
      }
    })

  let closedCount = 0
  if (closedRows.length > 0) {
    const { error } = await db
      .from('mt_closed_trades')
      .upsert(closedRows, { onConflict: 'connection_id,deal_id', ignoreDuplicates: true })
    if (!error) closedCount = closedRows.length
  }

  // ── 4. Update connection status ───────────────────────────────────────────

  await db
    .from('mt_connections')
    .update({ status: 'connected', last_sync_at: now.toISOString(), sync_error: null, updated_at: now.toISOString() })
    .eq('id', connectionId)

  return {
    connectionId,
    accountStats:  statsRow,
    openPositions: positionRows.length,
    closedTrades:  closedCount,
    syncedAt:      now.toISOString(),
  }
}
