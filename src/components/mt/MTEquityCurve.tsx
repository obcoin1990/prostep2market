'use client'

import React from 'react'
import {
  ResponsiveContainer, ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { EquityPoint } from '@/lib/mt-analytics/compute'

interface MTEquityCurveProps {
  data: EquityPoint[]
  currency?: string
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1e2329] border border-[#2b3139] rounded-lg p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-2">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <p key={p.name} style={{ color: p.color }} className="font-mono">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

export function MTEquityCurve({ data, currency = 'USD' }: MTEquityCurveProps) {
  if (data.length === 0) {
    return (
      <Card variant="light" className="border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#0A0F1C]">Equity Curve</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 py-8 text-center">No trade history yet.</p>
        </CardContent>
      </Card>
    )
  }

  // Colour the equity line: green above 0, red below
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.equity)), 1)

  return (
    <Card variant="light" className="border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-[#0A0F1C]">Equity Curve</CardTitle>
          <span className="text-xs text-gray-400">{currency} · {data.length} days</span>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#0ecb81" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ecb81" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f6465d" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f6465d" stopOpacity={0}    />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#eaecef" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#9E9E9E' }}
              tickFormatter={(v: string) => v.slice(5)}   // MM-DD
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="equity"
              tick={{ fontSize: 10, fill: '#9E9E9E' }}
              tickFormatter={(v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(0)}`}
              domain={[-maxAbs * 1.05, maxAbs * 1.05]}
            />
            <YAxis
              yAxisId="dd"
              orientation="right"
              tick={{ fontSize: 10, fill: '#f6465d' }}
              tickFormatter={(v: number) => `${v.toFixed(0)}`}
              domain={['dataMin', 0]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="equity" y={0} stroke="#9E9E9E" strokeDasharray="4 4" />

            <Area
              yAxisId="equity"
              type="monotone"
              dataKey="equity"
              name={`Equity (${currency})`}
              stroke="#0ecb81"
              fill="url(#equityGradient)"
              strokeWidth={2}
              dot={false}
            />
            <Area
              yAxisId="dd"
              type="monotone"
              dataKey="drawdown"
              name="Drawdown"
              stroke="#f6465d"
              fill="url(#drawdownGradient)"
              strokeWidth={1.5}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
