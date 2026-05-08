'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

// Sample data - will be replaced with real data in later phases
const mockTrendData = [
  { value: 65 },
  { value: 68 },
  { value: 64 },
  { value: 72 },
  { value: 75 },
  { value: 71 },
  { value: 78 },
]

const rankInfo = {
  Beginner: { color: 'bg-gray-500', next: 'Developing', points: 0 },
  Developing: { color: 'bg-blue-500', next: 'Consistent', points: 40 },
  Consistent: { color: 'bg-green-500', next: 'Advanced', points: 70 },
  Advanced: { color: 'bg-purple-500', next: 'Elite', points: 85 },
  Elite: { color: 'bg-yellow-500', next: null, points: 95 },
}

interface EdgeScoreCardProps {
  score?: number
  rank?: keyof typeof rankInfo
  trend?: 'up' | 'down' | 'flat'
}

export function EdgeScoreCard({
  score = 78,
  rank = 'Consistent',
  trend = 'up'
}: EdgeScoreCardProps) {
  const currentRank = rankInfo[rank]
  const nextRank = currentRank.next
  const pointsToNext = nextRank ? rankInfo[nextRank as keyof typeof rankInfo].points - score : 0

  const trendIcon = trend === 'up' ? <TrendingUp className="w-4 h-4" /> : trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />
  const trendColor = trend === 'up' ? 'text-[#2E7D32]' : trend === 'down' ? 'text-[#E53935]' : 'text-gray-500'

  const tips = [
    'Complete your Trader DNA assessment to get personalized tips',
    'Log at least 5 trades this week to improve your discipline score',
    'Review your journal entries for recurring patterns',
  ]

  return (
    <Card data-tour="edge-score">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">Edge Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#0B0B0B]">{score}</span>
            <span className="text-sm text-gray-500">/100</span>
          </div>
          <div className={`flex items-center gap-1 ${trendColor}`}>
            {trendIcon}
            <span className="text-sm font-medium">This week</span>
          </div>
        </div>

        {/* Sparkline */}
        <div className="h-16 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTrendData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E53935" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#E53935" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#E53935"
                fill="url(#colorScore)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Rank */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant={rank === 'Elite' ? 'success' : 'default'} className={currentRank.color + ' text-white'}>
            {rank}
          </Badge>
          {nextRank && (
            <span className="text-xs text-gray-500">
              {pointsToNext} pts to {nextRank}
            </span>
          )}
        </div>

        {/* Tips */}
        <div className="p-3 bg-[#F5F7FA] rounded-[6px]">
          <p className="text-xs font-medium text-[#2E7D32] mb-1">Quick Tip</p>
          <p className="text-xs text-gray-600">{tips[0]}</p>
        </div>
      </CardContent>
    </Card>
  )
}