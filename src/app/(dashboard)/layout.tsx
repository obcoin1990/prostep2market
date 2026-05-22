import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayoutClient } from '@/components/dashboard/DashboardLayoutClient'
import { getAdminUser } from '@/lib/admin/auth'

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

  // super_admin users belong at /admin, not /dashboard
  const adminUser = await getAdminUser()
  if (adminUser) {
    redirect('/admin')
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
    <DashboardLayoutClient
      profile={profile}
      userEmail={user.email ?? null}
      userAvatarUrl={user.user_metadata?.avatar_url ?? null}
      userFullName={user.user_metadata?.full_name ?? user.user_metadata?.name ?? null}
    >
      {children}
    </DashboardLayoutClient>
  )
}