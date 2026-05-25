'use client'

import React from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SymbolStat } from '@/lib/mt-analytics/compute'

interface MTSymbolBreakdownProps {
  data: SymbolStat[]
  currency?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProfitTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const stat: SymbolStat = payload[0]?.payload
  return (
    <div className="bg-[#1e2329] border border-[#2b3139] rounded-lg p-3 text-xs shadow-xl">
      <p className="text-gray-300 font-semibold mb-1">{label}</p>
      <p className="text-gray-400">Trades: <span className="text-white">{stat.trades}</span></p>
      <p className="text-gray-400">Win rate: <span className="text-white">{stat.winRate.toFixed(1)}%</span></p>
      <p className="text-gray-400">Net P&L: <span className={stat.profit >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}>
        {stat.profit >= 0 ? '+' : ''}{stat.profit.toFixed(2)}
      </span></p>
      {stat.avgDurationSeconds != null && (
        <p className="text-gray-400">Avg dur: <span className="text-white">{Math.round(stat.avgDurationSeconds / 60)}m</span></p>
      )}
    </div>
  )
}

export function MTSymbolBreakdown({ data, currency = 'USD' }: MTSymbolBreakdownProps) {
  const top = data.slice(0, 15)

  if (data.length === 0) {
    return (
      <Card variant="light" className="border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#0A0F1C]">Symbol Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 py-8 text-center">No symbol data yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="light" className="border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-[#0A0F1C]">Symbol Breakdown</CardTitle>
          <span className="text-xs text-gray-400">{data.length} symbol{data.length !== 1 ? 's' : ''} · {currency}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Net P&L bar chart */}
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={top} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eaecef" />
            <XAxis dataKey="symbol" tick={{ fontSize: 9, fill: '#9E9E9E' }} />
            <YAxis tick={{ fontSize: 9, fill: '#9E9E9E' }} tickFormatter={(v: number) => `${v.toFixed(0)}`} />
            <Tooltip content={<ProfitTooltip />} />
            <Bar dataKey="profit" name={`P&L (${currency})`} radius={[3, 3, 0, 0]}>
              {top.map((s, i) => (
                <Cell key={i} fill={s.profit >= 0 ? '#0ecb81' : '#f6465d'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Win rate table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                {['Symbol', 'Trades', 'Win %', 'Net P&L', 'Avg Dur'].map((h) => (
                  <th key={h} className="text-left py-1.5 px-2 text-gray-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {top.map((s) => (
                <tr key={s.symbol} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-1.5 px-2 font-semibold text-gray-800">{s.symbol}</td>
                  <td className="py-1.5 px-2 text-gray-600">{s.trades}</td>
                  <td className="py-1.5 px-2">
                    <span className={s.winRate >= 50 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}>
                      {s.winRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className={`py-1.5 px-2 font-mono ${s.profit >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                    {s.profit >= 0 ? '+' : ''}{s.profit.toFixed(2)}
                  </td>
                  <td className="py-1.5 px-2 text-gray-500">
                    {s.avgDurationSeconds != null ? `${Math.round(s.avgDurationSeconds / 60)}m` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
