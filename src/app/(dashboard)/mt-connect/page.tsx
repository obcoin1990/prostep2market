'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RefreshCw, Plug, BarChart2 } from 'lucide-react'
import { MTConnectForm }        from '@/components/mt/MTConnectForm'
import { MTConnectionStatus }   from '@/components/mt/MTConnectionStatus'
import { MTAccountStats }       from '@/components/mt/MTAccountStats'
import { MTLiveTrades }         from '@/components/mt/MTLiveTrades'
import { MTAnalyticsDashboard } from '@/components/mt/MTAnalyticsDashboard'
import type {
  MTAccountStats as MTAccountStatsType,
  MTConnection,
  MTOpenPosition,
} from '@/types/mt-connection'

const SYNC_INTERVAL_MS = 5000   // 5-second sync (FX Blue compatible rate)

type PageTab = 'connection' | 'analytics'

export default function MTConnectPage() {
  const [pageTab, setPageTab]       = useState<PageTab>('connection')
  const [connections, setConnections] = useState<(MTConnection & { open_positions_count?: number })[]>([])
  const [stats, setStats]           = useState<Partial<MTAccountStatsType> | null>(null)
  const [positions, setPositions]   = useState<MTOpenPosition[]>([])
  const [syncing, setSyncing]       = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const syncTimerRef                = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Load status ──────────────────────────────────────────────────────────
  const loadStatus = useCallback(async () => {
    const res  = await fetch('/api/mt/status')
    const json = await res.json()
    setConnections(json.connections ?? [])
    setPageLoading(false)
  }, [])

  useEffect(() => { loadStatus() }, [loadStatus])

  const activeConn = connections.find((c) => ['connected', 'connecting'].includes(c.status))

  // ── Sync ─────────────────────────────────────────────────────────────────
  const doSync = useCallback(async () => {
    if (!activeConn || syncing) return
    setSyncing(true)
    try {
      const syncRes = await fetch('/api/mt/sync', { method: 'POST' })
      if (!syncRes.ok) return

      await loadStatus()

      const [statsJson, tradesJson] = await Promise.all([
        fetch('/api/mt/account-stats').then((r) => r.json()),
        fetch('/api/mt/trades?type=open&limit=100').then((r) => r.json()),
      ])
      setStats(statsJson.stats ?? null)
      setPositions(tradesJson.trades ?? [])
    } catch { /* silent */ } finally {
      setSyncing(false)
    }
  }, [activeConn, syncing, loadStatus])

  // ── Auto-sync loop ────────────────────────────────────────────────────────
  useEffect(() => {
    if (syncTimerRef.current) clearInterval(syncTimerRef.current)
    if (activeConn) {
      doSync()
      syncTimerRef.current = setInterval(doSync, SYNC_INTERVAL_MS)
    }
    return () => { if (syncTimerRef.current) clearInterval(syncTimerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConn?.id])

  const handleConnected    = (conn: MTConnection) => setConnections((prev) => [{ ...conn, open_positions_count: 0 }, ...prev])
  const handleDisconnected = (id: string) => {
    setConnections((prev) => prev.map((c) => c.id === id ? { ...c, status: 'disconnected' as const } : c))
    setStats(null)
    setPositions([])
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0A0F1C]">MT4 / MT5 Live Connection</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Read-only · MetaApi bridge · FX Blue compatible · syncs every {SYNC_INTERVAL_MS / 1000}s
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

        {/* ── Page tabs ──────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {([
            { id: 'connection', label: 'Connection', icon: Plug },
            { id: 'analytics',  label: 'Analytics',  icon: BarChart2 },
          ] as Array<{ id: PageTab; label: string; icon: React.ElementType }>).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setPageTab(id)}
              className={`flex items-center gap-1.5 py-1.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                pageTab === id
                  ? 'bg-white text-[#0A0F1C] shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {pageLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        )}

        {!pageLoading && pageTab === 'connection' && (
          <>
            {/* Account stats */}
            {activeConn && (
              <MTAccountStats stats={stats} loading={syncing && !stats} />
            )}

            {/* Connections */}
            {connections.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Connected Accounts
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

            {/* Live positions */}
            {activeConn && (
              <MTLiveTrades
                positions={positions}
                loading={syncing && positions.length === 0}
                currency={stats?.currency ?? 'USD'}
              />
            )}

            {/* Connect form */}
            <MTConnectForm onConnected={handleConnected} />

            {/* Info */}
            <div className="p-4 rounded-xl bg-[#fffbeb] border border-yellow-200 text-sm text-yellow-800 space-y-2">
              <p className="font-semibold">Before you connect</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Use the <strong>investor (read-only) password</strong> — never your master password.</li>
                <li>Broker server name must match exactly (MT4/MT5 → File → Login to find it).</li>
                <li>ProStep never stores your investor password after passing it to MetaApi.</li>
                <li>FX Blue users: link your FX Blue username below for additional analytics.</li>
                <li>Run the SQL migration in Supabase before using this feature in production.</li>
              </ul>
            </div>
          </>
        )}

        {!pageLoading && pageTab === 'analytics' && (
          <MTAnalyticsDashboard
            connectionId={activeConn?.id}
            currency={stats?.currency ?? 'USD'}
          />
        )}
      </div>
    </div>
  )
}
