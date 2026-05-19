'use client'

/**
 * Rank Badge Component
 * Displays rank with color coding and icons
 * EDGE-08
 */

import { Sprout, TrendingUp, CheckCircle, Award, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Rank, RankConfig } from '@/lib/edge-score'
import { getRankConfig } from '@/lib/edge-score'

interface RankBadgeProps {
  rank: Rank
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const RANK_ICONS = {
  beginner: Sprout,
  developing: TrendingUp,
  consistent: CheckCircle,
  advanced: Award,
  elite: Crown,
} as const

const RANK_STYLES: Record<Rank, string> = {
  beginner: 'bg-[#2b3139] text-[#b7bdc6]',
  developing: 'bg-[#1a3a5c] text-[#4a90d9]',
  consistent: 'bg-[#0a2e1f] text-[#0ecb81]',
  advanced: 'bg-[#2d1a5c] text-[#a78bfa]',
  elite: 'bg-gradient-to-r from-[#fcd535] to-[#f0b90b] text-[#0b0e11]',
}

const SIZE_STYLES = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
  lg: 'text-base px-4 py-1.5 gap-2',
}

export function RankBadge({ rank, showLabel = true, size = 'md' }: RankBadgeProps) {
  const config = getRankConfig(rank)
  const Icon = RANK_ICONS[rank]

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        RANK_STYLES[rank],
        SIZE_STYLES[size]
      )}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} />
      {showLabel && <span>{config.label}</span>}
    </div>
  )
}

interface RankProgressProps {
  score: number
}

export function RankProgress({ score }: RankProgressProps) {
  const ranks: { rank: Rank; label: string; maxScore: number }[] = [
    { rank: 'beginner', label: 'Beginner', maxScore: 20 },
    { rank: 'developing', label: 'Developing', maxScore: 40 },
    { rank: 'consistent', label: 'Consistent', maxScore: 60 },
    { rank: 'advanced', label: 'Advanced', maxScore: 80 },
    { rank: 'elite', label: 'Elite', maxScore: 100 },
  ]

  // Find current rank and next rank
  let currentRankIndex = 0
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (score > ranks[i].maxScore - 20) {
      currentRankIndex = i
      break
    }
  }

  const current = ranks[currentRankIndex]
  const nextRank = currentRankIndex < ranks.length - 1 ? ranks[currentRankIndex + 1] : null
  const pointsToNext = nextRank ? nextRank.maxScore - score : 0

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Progress to {nextRank?.label || 'Max'}</span>
        {nextRank && <span className="font-medium">{pointsToNext} pts to {nextRank.label}</span>}
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#2b3139' }}>
        <div
          className={cn('h-full rounded-full transition-all', RANK_STYLES[current.rank])}
          style={{ width: `${(score / 100) * 100}%` }}
        />
      </div>
    </div>
  )
}