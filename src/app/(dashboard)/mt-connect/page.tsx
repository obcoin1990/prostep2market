'use client'

/**
 * /mt-connect  — MT4/MT5 live account connection page.
 *
 * Architecture:
 *  • Client-side component so we can run the 3-second auto-sync loop.
 *  • On mount: GET /api/mt/status to see if an account is already connected.
 *  • Auto-sync: setInterval every 3 s calls POST /api/mt/sync while connected.
 *  • On connect: form calls POST /api/mt/connect → state updates → sync starts.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { MTConnectForm } from '@/components/mt/MTConnectForm'
import { MTConnectionStatus } from '@/components/mt/MTConnectionStatus'
import { MTAccountStats } from '@/components/mt/MTAccountStats'
import { MTLiveTrades } from '@/components/mt/MTLiveTrades'
import type {
  MTAccountStats as MTAccountStatsType,
  MTConnection,
  MTOpenPosition,
} from '@/types/mt-connection'

const SYNC_INTERVAL_MS = 3000

export default function MTConnectPage() {
  const [connections, setConnections]   = useState<(MTConnection & { open_positions_count?: number })[]>([])
  const [stats, setStats]               = useState<Partial<MTAccountStatsType> | null>(null)
  const [positions, setPositions]       = useState<MTOpenPosition[]>([])
  const [syncing, setSyncing]           = useState(false)
  const [pageLoading, setPageLoading]   = useState(true)
  const syncTimerRef                    = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Load connection status on mount ────────────────────────────────────────
  const loadStatus = useCallback(async () => {
    const res = await fetch('/api/mt/status')
    const json = await res.json()
    setConnections(json.connections ?? [])
    setPageLoading(false)
  }, [])

  useEffect(() => { loadStatus() }, [loadStatus])

  // ── Active connection (the first connected/connecting one) ─────────────────
  const activeConn = connections.find((c) => ['connected', 'connecting'].includes(c.status))

  // ── Sync function ──────────────────────────────────────────────────────────
  const doSync = useCallback(async () => {
    if (!activeConn || syncing) return
    setSyncing(true)
    try {
      // 1. Trigger sync
      const syncRes = await fetch('/api/mt/sync', { method: 'POST' })
      if (!syncRes.ok) throw new Error('sync failed')

      // 2. Refresh connection list (updates last_sync_at)
      await loadStatus()

      // 3. Fetch latest stats
      const statsRes = await fetch('/api/mt/account-stats')
      const statsJson = await statsRes.json()
      setStats(statsJson.stats ?? null)

      // 4. Fetch open positions
      const tradesRes = await fetch('/api/mt/trades?type=open&limit=100')
      const tradesJson = await tradesRes.json()
      setPositions(tradesJson.trades ?? [])

    } catch {
      // Silently swallow individual sync errors — the connection card shows status
    } finally {
      setSyncing(false)
    }
  }, [activeConn, syncing, loadStatus])

  // ── Auto-sync loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (syncTimerRef.current) clearInterval(syncTimerRef.current)

    if (activeConn) {
      // Immediate first sync, then every SYNC_INTERVAL_MS
      doSync()
      syncTimerRef.current = setInterval(doSync, SYNC_INTERVAL_MS)
    }

    return () => {
      if (syncTimerRef.current) clearInterval(syncTimerRef.current)
    }
    // We intentionally omit doSync from deps to avoid restarting the timer on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConn?.id])

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleConnected = (conn: MTConnection) => {
    setConnections((prev) => [{ ...conn, open_positions_count: 0 }, ...prev])
  }

  const handleDisconnected = (id: string) => {
    setConnections((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: 'disconnected' as const } : c)
    )
    setStats(null)
    setPositions([])
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Page header ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0A0F1C]">MT4 / MT5 Live Connection</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Read-only account sync via MetaApi · data refreshes every 3 seconds
            </p>
          </div>
          {activeConn && (
            <button
              onClick={doSync}
              disabled={syncing}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing…' : 'Sync now'}
            </button>
          )}
        </div>

        {/* ── Initial loading skeleton ──────────────────────────────────── */}
        {pageLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        )}

        {!pageLoading && (
          <>
            {/* ── Account overview (shown once connected) ─────────────── */}
            {activeConn && (
              <MTAccountStats stats={stats} loading={syncing && !stats} />
            )}

            {/* ── Existing connections ─────────────────────────────────── */}
            {connections.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Your Connections
                </h2>
                {connections.map((c) => (
                  <MTConnectionStatus
                    key={c.id}
                    connection={c}
                    onDisconnected={handleDisconnected}
                    onSyncNow={doSync}
                    syncing={syncing && activeConn?.id === c.id}
                  />
                ))}
              </div>
            )}

            {/* ── Live positions ───────────────────────────────────────── */}
            {activeConn && (
              <MTLiveTrades
                positions={positions}
                loading={syncing && positions.length === 0}
                currency={stats?.currency ?? 'USD'}
              />
            )}

            {/* ── Connect form (always shown — user may add another) ────── */}
            <MTConnectForm onConnected={handleConnected} />

            {/* ── Info box ─────────────────────────────────────────────── */}
            <div className="p-4 rounded-xl bg-[#fffbeb] border border-yellow-200 text-sm text-yellow-800">
              <p className="font-semibold mb-1">Before you connect</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Use the <strong>investor (read-only) password</strong> — not your master password.</li>
                <li>Your broker server name must match exactly (check MT4/MT5 → File → Login).</li>
                <li>ProStep never stores your investor password after passing it to MetaApi.</li>
                <li>Run the SQL migration in Supabase before using this feature in production.</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
