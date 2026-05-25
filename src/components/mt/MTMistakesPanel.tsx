'use client'

import React from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TradePattern } from '@/lib/mt-analytics/compute'

interface MTMistakesPanelProps {
  patterns: TradePattern[]
}

const SEVERITY_CONFIG = {
  high:   { color: 'text-[#f6465d]', bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700' },
  medium: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
  low:    { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700' },
}

const PATTERN_LABELS: Record<string, string> = {
  scalping:     'High-Frequency Scalping',
  overtrading:  'Overtrading',
  revenge:      'Revenge Trading',
  large_loss:   'Oversized Losses',
  no_sl:        'Missing Stop-Loss',
  no_tp:        'Missing Take-Profit',
  late_session: 'Late Session Trading',
}

export function MTMistakesPanel({ patterns }: MTMistakesPanelProps) {
  const sorted = [...patterns].sort((a, b) => {
    const rank = { high: 0, medium: 1, low: 2 }
    return rank[a.severity] - rank[b.severity]
  })

  return (
    <Card variant="light" className="border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-[#0A0F1C]">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          Trade Mistakes & Patterns
          {sorted.length > 0 && (
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
              {sorted.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <div className="flex items-center gap-3 py-4 text-sm text-gray-500">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            No significant trading patterns detected.
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((p, i) => {
              const cfg = SEVERITY_CONFIG[p.severity]
              return (
                <div key={i} className={`p-3 rounded-lg border ${cfg.border} ${cfg.bg}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm font-semibold ${cfg.color}`}>
                        {PATTERN_LABELS[p.type] ?? p.type}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">{p.description}</p>
                    </div>
                    <span className={`flex-shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${cfg.badge}`}>
                      {p.severity}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
