'use client'

import React from 'react'
import { TrendingUp, TrendingDown, Target, Clock, BarChart2, Zap, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PerformanceMetrics } from '@/lib/mt-analytics/compute'

interface MTPerformanceMetricsProps {
  metrics: PerformanceMetrics
  currency?: string
  loading?: boolean
}

function MetricTile({
  icon: Icon,
  label,
  value,
  sub,
  good,
}: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  good?: boolean | null  // null = neutral
}) {
  const valueColor =
    good === true  ? 'text-[#0ecb81]' :
    good === false ? 'text-[#f6465d]' : 'text-[#0A0F1C]'

  return (
    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className={`text-xl font-bold font-mono ${valueColor}`}>{value}</p>
      {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
    </div>
  )
}

function fmt(n: number, d = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
}

export function MTPerformanceMetrics({ metrics: m, currency = 'USD', loading }: MTPerformanceMetricsProps) {
  if (loading) {
    return (
      <Card variant="light" className="border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#0A0F1C]">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (m.totalTrades === 0) {
    return (
      <Card variant="light" className="border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#0A0F1C]">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 py-6 text-center">No closed trades found.</p>
        </CardContent>
      </Card>
    )
  }

  const pfStr = m.profitFactor === Infinity ? '∞' : fmt(m.profitFactor)

  return (
    <Card variant="light" className="border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-[#0A0F1C]">Performance Metrics</CardTitle>
          <span className="text-xs text-gray-400">{m.totalTrades} closed trades · {currency}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricTile
            icon={Target}
            label="Win Rate"
            value={`${m.winRate.toFixed(1)}%`}
            sub={`${Math.round(m.winRate / 100 * m.totalTrades)} wins`}
            good={m.winRate >= 50}
          />
          <MetricTile
            icon={BarChart2}
            label="Profit Factor"
            value={pfStr}
            sub={`Avg win: ${fmt(m.avgWin)}`}
            good={m.profitFactor >= 1.5}
          />
          <MetricTile
            icon={m.netProfit >= 0 ? TrendingUp : TrendingDown}
            label="Net Profit"
            value={`${m.netProfit >= 0 ? '+' : ''}${fmt(m.netProfit)}`}
            sub={currency}
            good={m.netProfit > 0}
          />
          <MetricTile
            icon={TrendingDown}
            label="Max Drawdown"
            value={`${fmt(m.maxDrawdown)}`}
            sub={`${m.maxDrawdownPct.toFixed(1)}% of peak`}
            good={m.maxDrawdownPct <= 10}
          />
          <MetricTile
            icon={Clock}
            label="Avg Duration"
            value={m.avgDurationMinutes != null ? `${m.avgDurationMinutes}m` : '—'}
            sub="per trade"
            good={null}
          />
          <MetricTile
            icon={Zap}
            label="Avg RR"
            value={m.avgRR != null ? `${m.avgRR}:1` : '—'}
            sub="risk:reward"
            good={m.avgRR != null ? m.avgRR >= 1.5 : null}
          />
          <MetricTile
            icon={Award}
            label="Win Streak"
            value={`${m.longestWinStreak}`}
            sub={`Loss streak: ${m.longestLossStreak}`}
            good={m.longestWinStreak > m.longestLossStreak}
          />
          <MetricTile
            icon={BarChart2}
            label="Sharpe Ratio"
            value={m.sharpeRatio != null ? `${m.sharpeRatio}` : '—'}
            sub="annualised"
            good={m.sharpeRatio != null ? m.sharpeRatio >= 1 : null}
          />
        </div>

        {/* Secondary stats strip */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-xs text-gray-500 border-t border-gray-100 pt-4">
          <span>Best trade: <span className="font-mono text-[#0ecb81]">+{fmt(m.bestTrade)}</span></span>
          <span>Worst trade: <span className="font-mono text-[#f6465d]">{fmt(m.worstTrade)}</span></span>
          <span>Total volume: <span className="font-mono text-gray-700">{fmt(m.totalVolume)} lots</span></span>
          <span>Avg/day: <span className="font-mono text-gray-700">{m.avgTradesPerDay} trades</span></span>
        </div>
      </CardContent>
    </Card>
  )
}
