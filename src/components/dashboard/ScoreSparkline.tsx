'use client'

/**
 * Score Sparkline Component
 * Renders a minimal line chart for 30-day score trend
 * EDGE-07
 */

import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import type { SparklineData } from '@/lib/edge-score'

interface ScoreSparklineProps {
  data: SparklineData[]
  width?: number
  height?: number
  color?: string
}

export function ScoreSparkline({
  data = [],
  width = 120,
  height = 40,
  color = '#6366F1' // indigo-500
}: ScoreSparklineProps) {
  // Handle empty data
  if (data.length === 0) {
    return (
      <div 
        style={{ width, height }} 
        className="flex items-center justify-center text-xs text-muted-foreground"
      >
        No trend data
      </div>
    )
  }

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line
          type="monotone"
          dataKey="score"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#6b7280' }}
          formatter={(value) => [`${value}`, 'Score']}
          labelFormatter={(label) => `Date: ${label}`}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}