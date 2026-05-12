'use client'

import { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import { TraderProfile } from '@/types/trader-dna'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useAlerts } from '@/hooks/useAlerts'
import { usePauseMode } from '@/hooks/usePauseMode'
import { useAlertSubscription } from '@/hooks/useAlertSubscription'
import { getDashboardTips } from '@/components/dashboard/personalized-layout'
import { DashboardGrid } from './DashboardGrid'
import { OnboardingBanner } from './OnboardingBanner'
import { DashboardTips } from './DashboardTips'
import { DateRangeFilter, type DateRangeType } from './DateRangeFilter'
import { OnboardingTour } from './OnboardingTour'

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
        <Loader className="w-8 h-8 text-[#00B4D8] animate-spin" />
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
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#0A0F1C]">Dashboard</h1>
            <p className="text-[rgba(10,15,28,0.6)]">
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
    </div>
  )
}
