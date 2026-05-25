'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { ShieldAlert, Zap, TrendingUp, GitBranch, CheckCircle2, Clock, ExternalLink, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { BehavioralFlag, FlagType } from '@/types/guardian'
import { toast } from 'sonner'

// ─── Config ───────────────────────────────────────────────────────────────────

const FLAG_META: Record<FlagType, {
  label: string
  icon: React.ElementType
  color: string
  bg: string
  border: string
  description: string
}> = {
  abusive_scalping: {
    label: 'High-Frequency Scalping',
    icon: Zap,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    description: 'Excessive number of trades closed in under the minimum duration threshold.',
  },
  arbitrage_behavior: {
    label: 'Arbitrage-Like Behavior',
    icon: TrendingUp,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    description: 'Pattern of very short trades, unusually high win rate, and low risk-reward ratios.',
  },
  hedging_behavior: {
    label: 'External Hedging',
    icon: GitBranch,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    description: 'Opposing positions opened on the same symbol within a short time window.',
  },
}

// ─── Detail pills ─────────────────────────────────────────────────────────────

function DetailPill({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-[11px] font-medium text-[#374151]">
      <span className="text-gray-400">{label}:</span>
      <span>{value}</span>
    </span>
  )
}

function FlagDetails({ flag }: { flag: BehavioralFlag }) {
  const d = flag.details
  const pills: Array<{ label: string; value: string | number }> = []

  if (flag.flagType === 'abusive_scalping') {
    if (d.scalpTradeCount != null)    pills.push({ label: 'Trades', value: d.scalpTradeCount })
    if (d.avgDurationSeconds != null) pills.push({ label: 'Avg duration', value: `${d.scalpMinDurationSeconds ?? d.avgDurationSeconds}s` })
  }
  if (flag.flagType === 'arbitrage_behavior') {
    if (d.avgDurationSeconds != null) pills.push({ label: 'Avg duration', value: `${d.avgDurationSeconds}s` })
    if (d.winRate != null)            pills.push({ label: 'Win rate', value: `${d.winRate.toFixed(1)}%` })
    if (d.avgRR != null)              pills.push({ label: 'Avg RR', value: d.avgRR.toFixed(2) })
  }
  if (flag.flagType === 'hedging_behavior') {
    if (d.hedgePairs?.length)         pills.push({ label: 'Pairs', value: d.hedgePairs.length })
  }
  if (flag.tradeIds.length > 0)       pills.push({ label: 'Trades linked', value: flag.tradeIds.length })

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {pills.map((p) => <DetailPill key={p.label} {...p} />)}
    </div>
  )
}

// ─── Single Flag Row ──────────────────────────────────────────────────────────

function FlagRow({
  flag,
  isAdmin,
  onCleared,
}: {
  flag: BehavioralFlag
  isAdmin?: boolean
  onCleared?: (id: string) => void
}) {
  const meta = FLAG_META[flag.flagType]
  const Icon = meta.icon
  const [clearing, setClearing] = useState(false)

  const handleClear = useCallback(async () => {
    if (!isAdmin || !onCleared) return
    setClearing(true)
    try {
      const res = await fetch(`/api/admin/abuse-flags/${flag.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
      })
      if (!res.ok) throw new Error('Failed to clear flag')
      onCleared(flag.id)
      toast.success('Flag cleared')
    } catch {
      toast.error('Could not clear flag')
    } finally {
      setClearing(false)
    }
  }, [flag.id, isAdmin, onCleared])

  const detectedAt = new Date(flag.detectedAt)
  const timeLabel  = detectedAt.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className={`rounded-lg border p-4 ${meta.border} ${meta.bg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-lg bg-white/70 flex-shrink-0 ${meta.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={`text-sm font-semibold ${meta.color}`}>{meta.label}</p>
              {!flag.isActive && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-100 text-green-700 uppercase">
                  Cleared
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{meta.description}</p>
            <FlagDetails flag={flag} />
            <div className="flex items-center gap-1 mt-2 text-[11px] text-gray-400">
              <Clock className="w-3 h-3" />
              <span>Detected {timeLabel}</span>
              {flag.clearedAt && (
                <span className="ml-2">
                  · Cleared {new Date(flag.clearedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {isAdmin && flag.isActive && onCleared && (
          <Button
            size="sm"
            variant="outline"
            className="flex-shrink-0 h-8 px-3 text-xs border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-300"
            onClick={handleClear}
            disabled={clearing}
          >
            <X className="w-3 h-3 mr-1" />
            {clearing ? '…' : 'Clear'}
          </Button>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface BehavioralFlagsCardProps {
  /** Pre-loaded flags (server-rendered path). If omitted, fetched client-side. */
  initialFlags?: BehavioralFlag[]
  /** User ID — used in the admin view header. */
  userId?: string
  /** When true, renders admin controls (clear buttons, user ID header). */
  isAdmin?: boolean
  /** Show cleared flags too */
  showAll?: boolean
}

export function BehavioralFlagsCard({
  initialFlags,
  userId,
  isAdmin = false,
  showAll = false,
}: BehavioralFlagsCardProps) {
  const [flags, setFlags] = useState<BehavioralFlag[]>(initialFlags ?? [])
  const [loading, setLoading] = useState(!initialFlags)

  useEffect(() => {
    if (initialFlags) return
    const endpoint = isAdmin && userId
      ? `/api/admin/abuse-flags?userId=${userId}&active=${!showAll}`
      : `/api/guardian/flags?active=${!showAll}`

    fetch(endpoint)
      .then(r => r.json())
      .then(json => setFlags(json.flags ?? []))
      .catch(() => {/* table may not exist yet pre-migration */})
      .finally(() => setLoading(false))
  }, [initialFlags, isAdmin, userId, showAll])

  const handleCleared = useCallback((id: string) => {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, isActive: false, clearedAt: new Date().toISOString() } : f))
  }, [])

  const activeFlags = flags.filter(f => f.isActive)
  const hasFlags    = flags.length > 0

  return (
    <Card variant="light" className="border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base text-[#0A0F1C]">
            <ShieldAlert className="w-4 h-4 text-[#E53935]" />
            Behavioral Risk Flags
            {activeFlags.length > 0 && (
              <span className="ml-1 text-xs font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                {activeFlags.length} active
              </span>
            )}
          </CardTitle>
          {isAdmin && userId && (
            <a
              href={`/api/admin/abuse-flags?userId=${userId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-[#E53935] flex items-center gap-1"
            >
              Export <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="py-6 text-center text-sm text-gray-400">Loading flags…</div>
        )}

        {!loading && !hasFlags && (
          <div className="flex items-center gap-3 py-4 text-sm text-gray-500">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span>No behavioral flags detected{!showAll ? ' (active)' : ''}.</span>
          </div>
        )}

        {!loading && hasFlags && (
          <div className="space-y-3">
            {flags.map(flag => (
              <FlagRow
                key={flag.id}
                flag={flag}
                isAdmin={isAdmin}
                onCleared={handleCleared}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
