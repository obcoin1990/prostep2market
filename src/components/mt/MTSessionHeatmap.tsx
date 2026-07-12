'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SessionCell } from '@/lib/mt-analytics/compute'

interface MTSessionHeatmapProps {
  data: SessionCell[]
}

const DAYS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS  = Array.from({ length: 24 }, (_, i) => i)

function heatColor(profit: number, maxAbs: number): string {
  if (maxAbs === 0) return 'hsl(0,0%,94%)'
  const ratio  = Math.min(1, Math.abs(profit) / maxAbs)
  const alpha  = 0.15 + ratio * 0.7
  if (profit > 0) return `rgba(14,203,129,${alpha.toFixed(2)})`
  if (profit < 0) return `rgba(246,70,93,${alpha.toFixed(2)})`
  return 'hsl(0,0%,94%)'
}

export function MTSessionHeatmap({ data }: MTSessionHeatmapProps) {
  const cellMap = useMemo(() => {
    const m = new Map<string, SessionCell>()
    for (const c of data) m.set(`${c.hour}:${c.day}`, c)
    return m
  }, [data])

  const maxAbs = useMemo(
    () => Math.max(...data.map((c) => Math.abs(c.profit)), 1),
    [data]
  )

  if (data.length === 0) {
    return (
      <Card variant="light" className="border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#0A0F1C]">Session Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 py-8 text-center">No session data yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="light" className="border border-gray-200 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-[#0A0F1C]">Session Heatmap</CardTitle>
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-[rgba(14,203,129,0.7)]" /> Profit
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-[rgba(246,70,93,0.7)]" /> Loss
            </span>
          </div>
        </div>
        <p className="text-[11px] text-gray-400">UTC hours × weekday</p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-0">
          {/* Header row */}
          <div className="flex gap-0.5 mb-0.5 pl-7">
            {HOURS.map((h) => (
              <div key={h} className="flex-1 text-center text-[9px] text-gray-400">
                {h % 3 === 0 ? `${h}` : ''}
              </div>
            ))}
          </div>

          {/* Rows per day */}
          {DAYS.map((day, di) => (
            <div key={day} className="flex gap-0.5 mb-0.5 items-center">
              <div className="w-7 text-[10px] text-gray-500 flex-shrink-0 text-right pr-1">{day}</div>
              {HOURS.map((h) => {
                const cell = cellMap.get(`${h}:${di}`)
                const bg   = heatColor(cell?.profit ?? 0, maxAbs)
                return (
                  <div
                    key={h}
                    className="flex-1 h-5 rounded-sm cursor-default transition-opacity hover:opacity-80"
                    style={{ backgroundColor: bg }}
                    title={
                      cell
                        ? `${day} ${h}:00 UTC\nProfit: ${cell.profit.toFixed(2)}\nTrades: ${cell.trades}\nWin rate: ${cell.winRate}%`
                        : `${day} ${h}:00 — no trades`
                    }
                  />
                )
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
