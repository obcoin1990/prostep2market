'use client'

/**
 * Leaderboard Component
 * Displays top traders with privacy controls
 * EDGE-10
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { RankBadge } from '@/components/dashboard/RankBadge'
import type { Rank } from '@/lib/edge-score'

interface LeaderboardEntry {
  rank: number
  userId: string
  displayName: string
  compositeScore: number
  rankLabel: string
  isCurrentUser: boolean
  visibility: string
  avatarUrl: string | null
}

interface UserRank {
  rank: number
  score: number
}

interface LeaderboardProps {
  className?: string
}

export function Leaderboard({ className }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<UserRank | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all-time'>('monthly')

  // Fetch leaderboard data
  useEffect(() => {
    fetchLeaderboard(period)
  }, [period])

  const fetchLeaderboard = async (period: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/leaderboard?period=${period}`)
      if (!response.ok) throw new Error('Failed to fetch leaderboard')
      
      const data = await response.json()
      setEntries(data.entries || [])
      setUserRank(data.userRank)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-gray-500">Leaderboard</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span title="Your score is anonymized">🔒 Privacy mode</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Period tabs */}
        <Tabs 
          value={period} 
          onValueChange={(v) => setPeriod(v as typeof period)}
          className="mb-4"
        >
          <TabsList className="h-8 w-full grid grid-cols-3">
            <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
            <TabsTrigger value="all-time" className="text-xs">All-time</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Empty state */}
        {entries.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No traders in this period yet.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Be the first to log your trades!
            </p>
          </div>
        )}

        {/* Leaderboard table */}
        {entries.length > 0 && (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 px-2 py-1 text-xs font-medium text-gray-500">
              <div className="col-span-1">#</div>
              <div className="col-span-7">Trader</div>
              <div className="col-span-2 text-right">Score</div>
              <div className="col-span-2 text-right">Rank</div>
            </div>

            {/* Entries */}
            {entries.map((entry) => (
              <div
                key={entry.userId}
                className={cn(
                  'grid grid-cols-12 gap-2 px-2 py-2 rounded-lg items-center transition-colors',
                  entry.isCurrentUser
                    ? 'bg-indigo-50 border border-indigo-200'
                    : 'hover:bg-gray-50'
                )}
              >
                {/* Rank */}
                <div className="col-span-1 flex items-center">
                  {entry.rank <= 3 ? (
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      entry.rank === 2 ? 'bg-gray-200 text-gray-700' :
                      'bg-amber-100 text-amber-700'
                    )}>
                      {entry.rank}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">{entry.rank}</span>
                  )}
                </div>

                {/* Trader name */}
                <div className="col-span-7 flex items-center gap-2">
                  {entry.avatarUrl ? (
                    <img 
                      src={entry.avatarUrl} 
                      alt="" 
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                      {entry.displayName.slice(-2)}
                    </div>
                  )}
                  <span className={cn(
                    'text-sm truncate',
                    entry.isCurrentUser ? 'font-medium text-indigo-700' : 'text-gray-700'
                  )}>
                    {entry.displayName}
                    {entry.isCurrentUser && (
                      <span className="ml-1 text-xs text-indigo-500">(you)</span>
                    )}
                  </span>
                </div>

                {/* Score */}
                <div className="col-span-2 text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {entry.compositeScore}
                  </span>
                </div>

                {/* Rank badge */}
                <div className="col-span-2 flex justify-end">
                  <Badge variant="outline" className="text-xs">
                    {entry.rankLabel.split(' ')[0]}
                  </Badge>
                </div>
              </div>
            ))}

            {/* User's rank if not in top */}
            {userRank && !entries.some(e => e.isCurrentUser) && (
              <>
                <div className="border-t my-2" />
                <div className="grid grid-cols-12 gap-2 px-2 py-2 bg-gray-50 rounded-lg items-center">
                  <div className="col-span-1">
                    <span className="text-sm font-medium text-gray-500">{userRank.rank}</span>
                  </div>
                  <div className="col-span-7 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs text-white">
                      *
                    </div>
                    <span className="text-sm font-medium text-indigo-700">Your Rank</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-medium text-gray-900">{userRank.score}</span>
                  </div>
                  <div className="col-span-2" />
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}