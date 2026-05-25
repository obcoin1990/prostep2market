'use client'

import React from 'react'
import { Wallet, TrendingUp, BarChart2, Percent } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MTAccountStats } from '@/types/mt-connection'

interface MTAccountStatsProps {
  stats: Partial<MTAccountStats> | null
  loading?: boolean
}

function StatTile({
  icon: Icon,
  label,
  value,
  color = 'text-[#0A0F1C]',
  sub,
}: {
  icon: React.ElementType
  label: string
  value: string
  color?: string
  sub?: string
}) {
  return (
    <div className="flex flex-col gap-0.5 p-4 rounded-lg bg-gray-50 border border-gray-100">
      <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
    </div>
  )
}

function fmt(n: number | null | undefined, decimals = 2, fallback = '—'): string {
  if (n == null) return fallback
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export function MTAccountStats({ stats, loading }: MTAccountStatsProps) {
  const currency = stats?.currency ?? 'USD'

  if (loading) {
    return (
      <Card variant="light" className="border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#0A0F1C]">Account Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card variant="light" className="border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#0A0F1C]">Account Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 py-4 text-center">
            No data yet — sync your account to see stats.
          </p>
        </CardContent>
      </Card>
    )
  }

  const profitColor =
    (stats.profit ?? 0) > 0 ? 'text-[#0ecb81]' :
    (stats.profit ?? 0) < 0 ? 'text-[#f6465d]' : 'text-[#0A0F1C]'

  const marginColor =
    (stats.margin_level ?? 9999) < 120 ? 'text-[#f6465d]' :
    (stats.margin_level ?? 9999) < 200 ? 'text-orange-500' : 'text-[#0A0F1C]'

  return (
    <Card variant="light" className="border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-[#0A0F1C]">Account Overview</CardTitle>
          <span className="text-xs text-gray-400 font-mono">{currency}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile
            icon={Wallet}
            label="Balance"
            value={fmt(stats.balance)}
            sub={currency}
          />
          <StatTile
            icon={TrendingUp}
            label="Equity"
            value={fmt(stats.equity)}
            color={profitColor}
            sub={stats.profit != null ? `P&L: ${stats.profit > 0 ? '+' : ''}${fmt(stats.profit)}` : undefined}
          />
          <StatTile
            icon={BarChart2}
            label="Margin Used"
            value={fmt(stats.margin)}
            sub={stats.free_margin != null ? `Free: ${fmt(stats.free_margin)}` : undefined}
          />
          <StatTile
            icon={Percent}
            label="Margin Level"
            value={stats.margin_level != null ? `${fmt(stats.margin_level, 1)}%` : '—'}
            color={marginColor}
            sub={stats.leverage != null ? `1:${stats.leverage}` : undefined}
          />
        </div>
      </CardContent>
    </Card>
  )
}
