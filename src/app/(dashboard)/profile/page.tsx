import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TraderProfilePageClient } from './page.client';

export default async function TraderDNAProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get trader profile from database
  const { data: profileData } = await supabase
    .from('trader_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // If no profile exists, redirect to assessment
  if (!profileData) {
    redirect('/trader-dna');
  }

  // Build profile object from database
  const profile = {
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
  };

  return <TraderProfilePageClient profile={profile} />;
}