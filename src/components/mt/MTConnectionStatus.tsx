'use client'

import React from 'react'
import {
  Wifi, WifiOff, Loader2, AlertCircle, Unplug, Clock, CheckCircle2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { MTConnection } from '@/types/mt-connection'

interface MTConnectionStatusProps {
  connection: MTConnection & { open_positions_count?: number }
  onDisconnected: (id: string) => void
  onSyncNow: () => void
  syncing?: boolean
}

const STATUS_CONFIG = {
  connected: {
    icon: Wifi,
    label: 'Connected',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  connecting: {
    icon: Loader2,
    label: 'Connecting…',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  pending: {
    icon: Loader2,
    label: 'Pending',
    color: 'text-gray-500',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  },
  error: {
    icon: AlertCircle,
    label: 'Error',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  disconnected: {
    icon: WifiOff,
    label: 'Disconnected',
    color: 'text-gray-400',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    dot: 'bg-gray-300',
  },
}

function timeAgo(iso: string | null): string {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60)  return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  return `${Math.floor(s / 3600)}h ago`
}

export function MTConnectionStatus({
  connection: conn,
  onDisconnected,
  onSyncNow,
  syncing = false,
}: MTConnectionStatusProps) {
  const cfg = STATUS_CONFIG[conn.status] ?? STATUS_CONFIG.error
  const Icon = cfg.icon
  const isSpinning = ['connecting', 'pending'].includes(conn.status) || syncing

  const handleDisconnect = async () => {
    if (!confirm(`Disconnect ${conn.platform.toUpperCase()} account ${conn.account_number}?`)) return
    try {
      const res = await fetch(`/api/mt/disconnect?connectionId=${conn.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Account disconnected')
      onDisconnected(conn.id)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Disconnect failed')
    }
  }

  return (
    <Card variant="light" className={`border ${cfg.border}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-sm text-[#0A0F1C]">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot} ${isSpinning ? 'animate-pulse' : ''}`} />
            <span className="font-mono text-xs text-gray-500">
              {conn.platform.toUpperCase()} · {conn.account_number}
            </span>
          </CardTitle>
          <span className={`flex items-center gap-1 text-xs font-semibold ${cfg.color}`}>
            <Icon className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
            {cfg.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {/* Details row */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-gray-400">Broker server</p>
            <p className="font-medium text-gray-700 truncate">{conn.broker_server}</p>
          </div>
          <div>
            <p className="text-gray-400">Open positions</p>
            <p className="font-medium text-gray-700">{conn.open_positions_count ?? 0}</p>
          </div>
          <div>
            <p className="text-gray-400">Last sync</p>
            <p className="font-medium text-gray-700 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(conn.last_sync_at)}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Connected</p>
            <p className="font-medium text-gray-700">
              {new Date(conn.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {conn.sync_error && (
          <div className="p-2 rounded bg-red-50 border border-red-100 text-xs text-red-600">
            {conn.sync_error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs h-8"
            onClick={onSyncNow}
            disabled={syncing || conn.status === 'disconnected'}
          >
            {syncing
              ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Syncing…</>
              : <><CheckCircle2 className="w-3 h-3 mr-1" /> Sync Now</>
            }
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs h-8 text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleDisconnect}
            disabled={conn.status === 'disconnected'}
          >
            <Unplug className="w-3 h-3 mr-1" /> Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
