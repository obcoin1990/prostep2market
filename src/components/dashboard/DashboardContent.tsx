'use client'

import { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import { TraderProfile } from '@/types/trader-dna'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useAlerts } from '@/hooks/useAlerts'
import { usePauseMode } from '@/hooks/usePauseMode'
import { useAlertSubscription } from '@/hooks/useAlertSubscription'
import { useLearningProgress } from '@/hooks/useLearningProgress'
import { useCertificates } from '@/hooks/useCertificates'
import { useOpenTrades } from '@/hooks/useOpenTrades'
import { useWatchlist } from '@/hooks/useWatchlist'
import { getDashboardTips } from '@/components/dashboard/personalized-layout'
import { DashboardGrid } from './DashboardGrid'
import { OnboardingBanner } from './OnboardingBanner'
import { DashboardTips } from './DashboardTips'
import { DateRangeFilter, type DateRangeType } from './DateRangeFilter'
import { OnboardingTour } from './OnboardingTour'
import { LearningProgressWidget } from './LearningProgressWidget'
import { CertificatesWidget } from './CertificatesWidget'
import { OpenTradesWidget } from './OpenTradesWidget'
import { WatchlistWidget } from './WatchlistWidget'

interface InitialData {
  edgeScore: any
  history: any
  analytics: any
  leaderboard: any
}

interface DashboardContentProps {
  profile: TraderProfile | null
  user: { id: string; email: string }
  initialData: InitialData
}

/**
 * Client-side Dashboard Content Component
 * Uses React Query hooks for real-time updates
 * and displays personalized widget layout
 */
export function DashboardContent({
  profile,
  user,
  initialData,
}: DashboardContentProps) {
  const [isHydrated, setIsHydrated] = useState(false)
  const [dismissedBanner, setDismissedBanner] = useState(false)
  const [dateRange, setDateRange] = useState<DateRangeType>('30days')
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)

  // Calculate days from date range
  const getDaysFromRange = (range: DateRangeType): number => {
    const rangeMap: Record<DateRangeType, number> = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      '6months': 180,
      '1year': 365,
      'custom': 30, // Default to 30 days for custom
    }
    return rangeMap[range]
  }

  // Fetch dashboard data (will override initial server-side data)
  const dashboardData = useDashboardData({
    days: getDaysFromRange(dateRange),
    leaderboardPeriod: 'monthly',
  })

  // Real-time alerts
  const { alerts, loading: alertsLoading } = useAlerts(user.id)

  // Pause mode state
  const { isPaused, pauseInfo } = usePauseMode(user.id)

  // Subscribe to real-time alerts
  useAlertSubscription(user.id)

  // ── New sections ───────────────────────────────────────────────────────────
  const learningProgress = useLearningProgress()
  const certificates     = useCertificates()
  const openTrades       = useOpenTrades()
  const watchlist        = useWatchlist()
  // ──────────────────────────────────────────────────────────────────────────

  // Hydration safety
  useEffect(() => {
    setIsHydrated(true)
    // Check if tour has been completed
    const tourCompleted = localStorage.getItem('dashboardTourCompleted')
    setIsOnboardingComplete(!!tourCompleted)
  }, [])

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 animate-spin" style={{ color: '#fcd535' }} />
      </div>
    )
  }

  // Get personalized tips
  const tips = getDashboardTips(profile)

  // Determine onboarding step for new users
  const getOnboardingStep = (): 'dna-assessment' | 'first-trade' | 'analysis' => {
    if (!profile) return 'dna-assessment'
    if (!dashboardData.edgeScore?.score) return 'first-trade'
    return 'analysis'
  }

  const handleDateRangeChange = (range: DateRangeType) => {
    setDateRange(range)
  }

  return (
    <div className="space-y-6">
      {/* Onboarding Tour */}
      <OnboardingTour
        profile={profile}
        isOnboardingComplete={isOnboardingComplete}
      />

      {/* Header section with user greeting and controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold" style={{ color: '#ffffff', letterSpacing: '-0.3px' }}>Dashboard</h1>
            <p style={{ color: '#707a8a', fontSize: '14px' }}>
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
            </p>
          </div>

          {/* Date Range Filter */}
          <div className="dashboard-header">
            <DateRangeFilter
              selectedRange={dateRange}
              onRangeChange={handleDateRangeChange}
            />
          </div>
        </div>
      </div>

      {/* Onboarding banner for new users (if not dismissed) */}
      {!profile && !dismissedBanner && (
        <div className="onboarding-banner animate-slide-in-up">
          <OnboardingBanner
            step={getOnboardingStep()}
            dismissible
            onDismiss={() => setDismissedBanner(true)}
          />
        </div>
      )}

      {/* Profile tips banner for returning users */}
      {profile && tips.length > 0 && !dismissedBanner && (
        <DashboardTips profile={profile} tips={tips} />
      )}

      {/* Dashboard Grid with all widgets */}
      <div className="dashboard-grid">
        <DashboardGrid
          profile={profile}
          userId={user.id}
          loading={dashboardData.isLoading}
          error={dashboardData.isError}
          edgeScore={dashboardData.edgeScore}
          edgeScoreHistory={dashboardData.edgeScoreHistory}
          analytics={dashboardData.analytics}
          leaderboard={dashboardData.leaderboard}
          guardianSettings={dashboardData.guardianSettings}
          alerts={alerts}
          alertsLoading={alertsLoading}
          isPaused={isPaused}
          pauseInfo={pauseInfo}
        />
      </div>

      {/* ── Second row: Learning, Certs, Trades, Strategies ── */}
      <div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: '#707a8a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Learning &amp; Trading Activity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <LearningProgressWidget
            enrollments={learningProgress.enrollments}
            isLoading={learningProgress.isLoading}
          />
          <CertificatesWidget
            certificates={certificates.certificates}
            isLoading={certificates.isLoading}
          />
          <OpenTradesWidget
            trades={openTrades.trades}
            openTrades={openTrades.openTrades}
            isLoading={openTrades.isLoading}
          />
          <WatchlistWidget
            strategies={watchlist.strategies}
            isLoading={watchlist.isLoading}
          />
        </div>
      </div>
    </div>
  )
}
