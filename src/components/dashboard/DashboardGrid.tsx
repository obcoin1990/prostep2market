'use client'

import { TraderProfile } from '@/types/trader-dna'
import { Alert } from '@/types/guardian'
import { EdgeScoreCard } from './EdgeScoreCard'
import { TradeStatsWidget } from './TradeStatsWidget'
import { AIAertsWidget } from './AIAertsWidget'
import { SessionHeatmap } from './SessionHeatmap'
import { InsightsPanel } from './InsightsPanel'
import { RankBadge } from './RankBadge'
import { QuickActions } from './QuickActions'
import { ScoreSparkline } from './ScoreSparkline'
import { ScoreBreakdown } from './ScoreBreakdown'
import { PauseOverlay } from './PauseOverlay'
import {
  NoAlertsEmptyState,
  NoScoreEmptyState,
  NoInsightsEmptyState,
  NoLeaderboardRankEmptyState,
} from './EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import type {
  EdgeScoreData,
  EdgeScoreHistory,
  DashboardAnalytics,
  LeaderboardData,
  GuardianSettings,
} from '@/hooks/useDashboardData'

interface DashboardGridProps {
  profile: TraderProfile | null
  userId: string
  loading: boolean
  error: boolean
  edgeScore: EdgeScoreData | undefined
  edgeScoreHistory: EdgeScoreHistory | undefined
  analytics: DashboardAnalytics | undefined
  leaderboard: LeaderboardData | undefined
  guardianSettings: GuardianSettings | undefined
  alerts: Alert[]
  alertsLoading: boolean
  isPaused: boolean
  pauseInfo: any
}

/**
 * Widget configuration - determines grid layout and visibility
 */
interface WidgetConfig {
  id: string
  name: string
  colSpan: {
    mobile: number
    tablet: number
    desktop: number
  }
  priority: number // Lower = higher priority (shown first)
}

const WIDGET_CONFIGS: Record<string, WidgetConfig> = {
  edgeScore: {
    id: 'edgeScore',
    name: 'Edge Score Card',
    colSpan: { mobile: 1, tablet: 1, desktop: 1 },
    priority: 1,
  },
  scoreBreakdown: {
    id: 'scoreBreakdown',
    name: 'Score Breakdown',
    colSpan: { mobile: 1, tablet: 1, desktop: 1 },
    priority: 2,
  },
  tradeStats: {
    id: 'tradeStats',
    name: 'Trade Statistics',
    colSpan: { mobile: 1, tablet: 2, desktop: 2 },
    priority: 3,
  },
  alerts: {
    id: 'alerts',
    name: 'AI Alerts',
    colSpan: { mobile: 1, tablet: 1, desktop: 1 },
    priority: 4,
  },
  heatmap: {
    id: 'heatmap',
    name: 'Session Heatmap',
    colSpan: { mobile: 1, tablet: 2, desktop: 2 },
    priority: 5,
  },
  insights: {
    id: 'insights',
    name: 'AI Insights',
    colSpan: { mobile: 1, tablet: 1, desktop: 1 },
    priority: 6,
  },
  leaderboard: {
    id: 'leaderboard',
    name: 'Leaderboard Rank',
    colSpan: { mobile: 1, tablet: 1, desktop: 1 },
    priority: 7,
  },
  quickActions: {
    id: 'quickActions',
    name: 'Quick Actions',
    colSpan: { mobile: 1, tablet: 1, desktop: 1 },
    priority: 8,
  },
  sparkline: {
    id: 'sparkline',
    name: 'Score History',
    colSpan: { mobile: 1, tablet: 2, desktop: 1 },
    priority: 9,
  },
}

/**
 * Get widget layout based on trader profile type
 */
function getWidgetLayout(profile: TraderProfile | null): string[] {
  // Base widgets that always show
  const baseWidgets = ['edgeScore', 'alerts', 'quickActions']

  if (!profile) {
    // New users get basic set
    return [...baseWidgets, 'tradeStats', 'insights']
  }

  // Profile-specific widget ordering
  const profileOrdering: Record<string, string[]> = {
    sniper: ['edgeScore', 'scoreBreakdown', 'alerts', 'tradeStats', 'insights', 'quickActions'],
    analyst: ['edgeScore', 'scoreBreakdown', 'tradeStats', 'sparkline', 'heatmap', 'alerts'],
    warrior: ['edgeScore', 'alerts', 'quickActions', 'tradeStats', 'leaderboard', 'insights'],
    disciplinarian: ['scoreBreakdown', 'edgeScore', 'tradeStats', 'sparkline', 'alerts', 'quickActions'],
    opportunist: ['edgeScore', 'alerts', 'tradeStats', 'insights', 'quickActions', 'leaderboard'],
  }

  return profileOrdering[profile.type] || baseWidgets
}

/**
 * Widget skeleton loading component with animated placeholders
 */
function WidgetSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4 animate-pulse">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-10 w-1/2" />
          </div>
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Dashboard Grid Component
 * Assembles all dashboard widgets with proper layout and data
 */
export function DashboardGrid({
  profile,
  userId,
  loading,
  error,
  edgeScore,
  edgeScoreHistory,
  analytics,
  leaderboard,
  guardianSettings,
  alerts,
  alertsLoading,
  isPaused,
  pauseInfo,
}: DashboardGridProps) {
  const widgetOrder = getWidgetLayout(profile)

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-sm text-red-800 font-medium">
          Failed to load dashboard widgets. Please refresh the page.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Pause Overlay - shown when pause mode is active */}
      {isPaused && pauseInfo && (
        <div className="animate-fade-in">
          <PauseOverlay userId={userId} />
        </div>
      )}

      {/* Main grid of widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 animate-fade-in">
        {widgetOrder.map((widgetId) => {
          const config = WIDGET_CONFIGS[widgetId]
          if (!config) return null

          // Build column span classes based on config
          const getColSpanClass = (tablet: number, desktop: number) => {
            let classes = 'col-span-1'
            if (tablet === 2) classes += ' sm:col-span-2'
            if (tablet === 1) classes += ' sm:col-span-1'
            if (desktop === 2) classes += ' lg:col-span-2'
            if (desktop === 1) classes += ' lg:col-span-1'
            return classes
          }

          const colSpanClass = getColSpanClass(config.colSpan.tablet, config.colSpan.desktop)

          // Render widget based on ID
          return (
            <div key={widgetId} className={colSpanClass}>
              {/* Edge Score Card */}
              {widgetId === 'edgeScore' && (
                <div className="edge-score-card">
                  {loading ? (
                    <WidgetSkeleton />
                  ) : (
                    <EdgeScoreCard userId={userId} />
                  )}
                </div>
              )}

              {/* Score Breakdown */}
              {widgetId === 'scoreBreakdown' && edgeScore?.score && (
                <Card>
                  <CardContent className="pt-6">
                    <ScoreBreakdown
                      scores={{
                        disciplineScore: edgeScore.score.disciplineScore,
                        riskScore: edgeScore.score.riskScore,
                        emotionalStabilityScore: edgeScore.score.emotionalStabilityScore,
                        consistencyScore: edgeScore.score.consistencyScore,
                        strategyAdherenceScore: edgeScore.score.strategyAdherenceScore,
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Trade Statistics Widget */}
              {widgetId === 'tradeStats' && analytics && (
                <div className="trade-stats-widget">
                  <Card>
                    <CardContent className="pt-6">
                      <TradeStatsWidget
                        pairStats={(analytics.tradeStats.pairs as any) || []}
                        timeStats={(analytics.tradeStats.times as any) || []}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* AI Alerts Widget */}
              {widgetId === 'alerts' && (
                <div className="ai-alerts-widget">
                  <Card>
                    <CardContent className="pt-6">
                      {alerts.length === 0 ? (
                        <NoAlertsEmptyState />
                      ) : (
                        <AIAertsWidget alerts={alerts.slice(0, 5)} />
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Session Heatmap */}
              {widgetId === 'heatmap' && analytics && (
                <Card>
                  <CardContent className="pt-6">
                    <SessionHeatmap data={(analytics.heatmap || []) as any} />
                  </CardContent>
                </Card>
              )}

              {/* AI Insights Panel */}
              {widgetId === 'insights' && analytics && (
                <Card>
                  <CardContent className="pt-6">
                    {(!analytics.insights || analytics.insights.length === 0) ? (
                      <NoInsightsEmptyState />
                    ) : (
                      <InsightsPanel insights={(analytics.insights || []) as any} />
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Leaderboard Rank Badge */}
              {widgetId === 'leaderboard' && leaderboard && (
                <Card>
                  <CardContent className="pt-6 flex items-center justify-center min-h-[200px]">
                    {leaderboard.userRank ? (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Your Leaderboard Position</p>
                        <p className="text-4xl font-bold text-[#00B4D8] mb-2">#{leaderboard.userRank.rank}</p>
                        <p className="text-sm text-gray-600">Score: {leaderboard.userRank.score.toFixed(1)}</p>
                      </div>
                    ) : (
                      <NoLeaderboardRankEmptyState />
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              {widgetId === 'quickActions' && (
                <QuickActions userId={userId} />
              )}

              {/* Score Sparkline */}
              {widgetId === 'sparkline' && edgeScoreHistory && (
                <Card>
                  <CardContent className="pt-6">
                    <ScoreSparkline
                      data={edgeScoreHistory.sparklineData || []}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {!loading && widgetOrder.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-500">No widgets to display</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
