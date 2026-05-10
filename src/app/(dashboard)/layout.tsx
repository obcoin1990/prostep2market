import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayoutClient } from '@/components/dashboard/DashboardLayoutClient'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get trader profile for personalization
  const { data: profileData } = await supabase
    .from('trader_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Build profile object if exists
  const profile = profileData ? {
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

  return (
    <DashboardLayoutClient profile={profile}>
      {children}
    </DashboardLayoutClient>
  )
}