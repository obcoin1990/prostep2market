'use client'

/**
 * Edge Score Card Component
 * Main dashboard widget for Edge Score display
 * DASH-01, EDGE-06, EDGE-07, EDGE-08, EDGE-09
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown, Minus, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { ScoreSparkline } from './ScoreSparkline'
import { RankBadge, RankProgress } from './RankBadge'
import { ScoreBreakdown, MiniBreakdown } from './ScoreBreakdown'
import { generateQuickTips, getRankImprovementTip, type EdgeScoreBreakdown, type SparklineData, type Rank } from '@/lib/edge-score'

interface ScoreData {
  disciplineScore: number
  riskScore: number
  emotionalStabilityScore: number
  consistencyScore: number
  strategyAdherenceScore: number
  compositeScore: number
  rank: Rank
  date: string
}

interface Tip {
  level: 'critical' | 'improvement' | 'good' | 'strong' | 'elite'
  message: string
  category: string
}

interface EdgeScoreCardProps {
  userId?: string
  className?: string
}

export function EdgeScoreCard({ userId, className }: EdgeScoreCardProps) {
  const [score, setScore] = useState<ScoreData | null>(null)
  const [history, setHistory] = useState<SparklineData[]>([])
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  // Fetch score data on mount
  useEffect(() => {
    fetchScore()
    fetchHistory()
  }, [])

  const fetchScore = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/scores')
      if (!response.ok) throw new Error('Failed to fetch score')
      
      const data = await response.json()
      
      if (data.isNewUser) {
        setIsNewUser(true)
        // Generate placeholder tips for new users
        setTips([{
          level: 'improvement',
          message: 'Start logging trades to see your Edge Score. The more data you provide, the more accurate your scores will be.',
          category: 'discipline',
        }])
      } else if (data.score) {
        setScore(data.score)
        setTips(data.tips || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/scores/history?days=30')
      if (!response.ok) throw new Error('Failed to fetch history')
      
      const data = await response.json()
      setHistory(data.sparklineData || [])
    } catch (err) {
      // History fetch failure is not critical
      console.error('History fetch error:', err)
    }
  }

  const triggerRecalculation = async () => {
    try {
      setIsCalculating(true)
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: 30 }),
      })
      
      if (!response.ok) throw new Error('Failed to calculate score')
      
      const data = await response.json()
      if (data.score) {
        setScore(data.score)
        setTips(data.tips || [])
        
        // Refresh history
        await fetchHistory()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed')
    } finally {
      setIsCalculating(false)
    }
  }

  // Calculate trend direction from history
  const getTrend = () => {
    if (history.length < 2) return 'flat' as const
    const recent = history.slice(-7)
    const first = recent[0]?.score || 0
    const last = recent[recent.length - 1]?.score || 0
    if (last > first + 2) return 'up' as const
    if (last < first - 2) return 'down' as const
    return 'flat' as const
  }

  const trend = getTrend()
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'

  // Loading state
  if (loading) {
    return (
      <Card className={className} data-tour="edge-score">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium text-gray-500">Edge Score</CardTitle>
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-10 w-28" />
            </div>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-8 w-32" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // New user state
  if (isNewUser || !score) {
    return (
      <Card className={className} data-tour="edge-score">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Edge Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 space-y-4">
            <div className="text-5xl font-bold text-gray-300">—</div>
            <p className="text-sm text-muted-foreground">
              Start logging trades to see your Edge Score
            </p>
            <Button onClick={triggerRecalculation} disabled={isCalculating}>
              {isCalculating ? 'Calculating...' : 'Calculate Score'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate breakdown scores without composite
  const breakdownScores = {
    disciplineScore: score.disciplineScore,
    riskScore: score.riskScore,
    emotionalStabilityScore: score.emotionalStabilityScore,
    consistencyScore: score.consistencyScore,
    strategyAdherenceScore: score.strategyAdherenceScore,
  }

  // Get quick tips - need full breakdown including compositeScore
  const quickTips = generateQuickTips({
    disciplineScore: score.disciplineScore,
    riskScore: score.riskScore,
    emotionalStabilityScore: score.emotionalStabilityScore,
    consistencyScore: score.consistencyScore,
    strategyAdherenceScore: score.strategyAdherenceScore,
    compositeScore: score.compositeScore,
  })
  const rankTip = getRankImprovementTip({
    disciplineScore: score.disciplineScore,
    riskScore: score.riskScore,
    emotionalStabilityScore: score.emotionalStabilityScore,
    consistencyScore: score.consistencyScore,
    strategyAdherenceScore: score.strategyAdherenceScore,
    compositeScore: score.compositeScore,
  })

  return (
    <Card className={className} data-tour="edge-score">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-gray-500">Edge Score</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={triggerRecalculation}
            disabled={isCalculating}
            className="h-8"
          >
            <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Main score display */}
        <div className="flex items-end justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">{score.compositeScore}</span>
            <span className="text-sm text-gray-500">/100</span>
          </div>
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              {trend === 'flat' ? 'Stable' : trend === 'up' ? 'Trending up' : 'Trending down'}
            </span>
          </div>
        </div>

        {/* Sparkline */}
        <div className="h-16 mb-4">
          <ScoreSparkline data={history} width={280} height={60} />
        </div>

        {/* Rank and progress */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <RankBadge rank={score.rank} size="md" />
            <span className="text-xs text-gray-500">
              {score.date && new Date(score.date).toLocaleDateString()}
            </span>
          </div>
          <RankProgress score={score.compositeScore} />
        </div>

        {/* Score breakdown (expandable) */}
        <div className="border-t pt-3 mt-3">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-2"
          >
            <span>Score Breakdown</span>
            {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showBreakdown && (
            <div className="pt-2">
              <ScoreBreakdown scores={breakdownScores} />
            </div>
          )}
        </div>

        {/* Quick tips */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-2">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Quick Tips
          </p>
          {tips.slice(0, 2).map((tip, index) => (
            <p key={index} className="text-xs text-gray-600 flex items-start gap-2">
              <span className="text-green-600 mt-0.5">→</span>
              {tip.message}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}