'use client'

import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MTOpenPosition } from '@/types/mt-connection'

interface MTLiveTradesProps {
  positions: MTOpenPosition[]
  loading?: boolean
  currency?: string
}

function ProfitBadge({ profit }: { profit: number | null }) {
  if (profit == null) return <span className="text-gray-400 text-xs">—</span>
  const color = profit > 0 ? 'text-[#0ecb81]' : profit < 0 ? 'text-[#f6465d]' : 'text-gray-400'
  return <span className={`font-mono font-semibold text-sm ${color}`}>{profit > 0 ? '+' : ''}{profit.toFixed(2)}</span>
}

function DirectionIcon({ type }: { type: 'buy' | 'sell' }) {
  if (type === 'buy')  return <TrendingUp  className="w-3.5 h-3.5 text-[#0ecb81]" />
  if (type === 'sell') return <TrendingDown className="w-3.5 h-3.5 text-[#f6465d]" />
  return <Minus className="w-3.5 h-3.5 text-gray-400" />
}

function formatDuration(openTime: string | null): string {
  if (!openTime) return '—'
  const s = Math.floor((Date.now() - new Date(openTime).getTime()) / 1000)
  if (s < 60)    return `${s}s`
  if (s < 3600)  return `${Math.floor(s / 60)}m ${s % 60}s`
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return `${h}h ${m}m`
}

export function MTLiveTrades({ positions, loading, currency = 'USD' }: MTLiveTradesProps) {
  const totalProfit = positions.reduce((sum, p) => sum + (p.profit ?? 0), 0)

  return (
    <Card variant="light" className="border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base text-[#0A0F1C]">
            <span className="w-2 h-2 rounded-full bg-[#0ecb81] animate-pulse" />
            Live Positions
            {positions.length > 0 && (
              <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {positions.length}
              </span>
            )}
          </CardTitle>
          {positions.length > 0 && (
            <div className="text-sm font-semibold font-mono">
              <ProfitBadge profit={totalProfit} />
              <span className="text-xs text-gray-400 ml-1">{currency}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && positions.length === 0 && (
          <div className="py-6 text-center text-sm text-gray-400">
            No open positions
          </div>
        )}

        {!loading && positions.length > 0 && (
          <div className="space-y-2">
            {positions.map((pos) => (
              <div
                key={pos.position_id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {/* Symbol + direction */}
                <div className="flex items-center gap-2 min-w-0">
                  <DirectionIcon type={pos.order_type} />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#0A0F1C]">{pos.symbol}</p>
                    <p className="text-[11px] text-gray-400">
                      {pos.volume} lots · {pos.platform.toUpperCase()} · {formatDuration(pos.open_time)}
                    </p>
                  </div>
                </div>

                {/* Prices */}
                <div className="hidden sm:flex flex-col items-end text-[11px] text-gray-500">
                  <span>Open: <span className="font-mono text-gray-700">{pos.open_price?.toFixed(5) ?? '—'}</span></span>
                  <span>Now:  <span className="font-mono text-gray-700">{pos.current_price?.toFixed(5) ?? '—'}</span></span>
                </div>

                {/* SL / TP */}
                <div className="hidden md:flex flex-col items-end text-[11px] text-gray-500">
                  <span>SL: <span className="font-mono text-gray-700">{pos.stop_loss?.toFixed(5) ?? '—'}</span></span>
                  <span>TP: <span className="font-mono text-gray-700">{pos.take_profit?.toFixed(5) ?? '—'}</span></span>
                </div>

                {/* Profit */}
                <div className="text-right flex-shrink-0">
                  <ProfitBadge profit={pos.profit} />
                  {pos.magic_number ? (
                    <p className="text-[10px] text-gray-400">#{pos.magic_number}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
