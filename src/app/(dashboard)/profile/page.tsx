import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TraderProfilePageClient } from './page.client';

const VALID_PROFILE_TYPES = ['sniper', 'analyst', 'warrior', 'disciplinarian', 'opportunist'] as const;
type ProfileType = typeof VALID_PROFILE_TYPES[number];

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

  // Guard: profile_type must be a known valid type
  if (!profileData.profile_type || !VALID_PROFILE_TYPES.includes(profileData.profile_type)) {
    redirect('/trader-dna');
  }

  // Build profile object from database — coerce nullable scores to 0
  const profile = {
    type: profileData.profile_type as ProfileType,
    scores: {
      riskPersonality: profileData.risk_personality_score ?? 0,
      emotionalStability: profileData.emotional_stability_score ?? 0,
      decisionMaking: profileData.decision_making_score ?? 0,
      tradingBehavior: profileData.trading_behavior_score ?? 0,
      learningStyle: profileData.learning_style_score ?? 0,
    },
    learningPath: profileData.learning_path ?? null,
    dashboardLayout: profileData.dashboard_layout ?? null,
    alertThresholds: profileData.alert_thresholds ?? null,
    recommendations: [],
  };

  return <TraderProfilePageClient profile={profile} />;
}