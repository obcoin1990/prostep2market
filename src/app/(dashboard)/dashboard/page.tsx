import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TraderProfile } from '@/types/trader-dna'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

/**
 * Server-side Dashboard Page
 * Fetches initial data in parallel and passes to client components
 */
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch trader profile for personalization
  const { data: profileData } = await supabase
    .from('trader_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Build profile object if exists
  const profile: TraderProfile | null = profileData ? {
    type: profileData.profile_type,
    scores: {
      riskPersonality: profileData.risk_personality_score,
      emotionalStability: profileData.emotional_stability_score,
      decisionMaking: profileData.decision_making_score,
      tradingBehavior: profileData.trading_behavior_score,
      learningStyle: profileData.learning_style_score,
    },
    learningPath: profileData.learning_path,
    dashboardLayout: profileData.dashboard_layout,
    alertThresholds: profileData.alert_thresholds,
    recommendations: [],
  } : null

  // Get the base URL for API calls.
  // VERCEL_URL does NOT include a protocol; localhost needs an explicit port.
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`

  // Get session for auth header
  const { data: { session } } = await supabase.auth.getSession()
  const headers: Record<string, string> = {}
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  // Fetch initial dashboard data in parallel
  const dashboardDataPromise = Promise.all([
    fetch(`${baseUrl}/api/scores`, {
      headers,
    }).then(res => res.json()).catch(() => null),
    
    fetch(`${baseUrl}/api/scores/history?days=30`, {
      headers,
    }).then(res => res.json()).catch(() => null),
    
    fetch(`${baseUrl}/api/analytics/dashboard?days=7`, {
      headers,
    }).then(res => res.json()).catch(() => null),
    
    fetch(`${baseUrl}/api/leaderboard?period=monthly`, {
      headers,
    }).then(res => res.json()).catch(() => null),
  ])

  const [edgeScoreData, historyData, analyticsData, leaderboardData] = await dashboardDataPromise

  return (
    <DashboardContent
      profile={profile}
      user={{ id: user.id, email: user.email || '' }}
      initialData={{
        edgeScore: edgeScoreData,
        history: historyData,
        analytics: analyticsData,
        leaderboard: leaderboardData,
      }}
    />
  )
}

