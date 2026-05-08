'use server';

import { createClient } from '@/lib/supabase/server';
import { TraderProfile } from '@/types/trader-dna';

export async function saveTraderProfile(profile: TraderProfile): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase
      .from('trader_profiles')
      .upsert({
        id: user.id,
        profile_type: profile.type,
        risk_personality_score: profile.scores.riskPersonality,
        emotional_stability_score: profile.scores.emotionalStability,
        decision_making_score: profile.scores.decisionMaking,
        trading_behavior_score: profile.scores.tradingBehavior,
        learning_style_score: profile.scores.learningStyle,
        learning_path: profile.learningPath,
        dashboard_layout: profile.dashboardLayout,
        alert_thresholds: profile.alertThresholds,
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'id',
      });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving trader profile:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save profile' 
    };
  }
}

export async function getTraderProfile(): Promise<TraderProfile | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('trader_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      type: data.profile_type,
      scores: {
        riskPersonality: data.risk_personality_score,
        emotionalStability: data.emotional_stability_score,
        decisionMaking: data.decision_making_score,
        tradingBehavior: data.trading_behavior_score,
        learningStyle: data.learning_style_score,
      },
      learningPath: data.learning_path,
      dashboardLayout: data.dashboard_layout,
      alertThresholds: data.alert_thresholds,
      recommendations: [],
    };
  } catch (error) {
    console.error('Error fetching trader profile:', error);
    return null;
  }
}

export async function getProfileWithDefaults(): Promise<TraderProfile> {
  const profile = await getTraderProfile();
  
  if (profile) {
    return profile;
  }

  // Return default profile for users without assessment
  return {
    type: 'analyst',
    scores: {
      riskPersonality: 50,
      emotionalStability: 50,
      decisionMaking: 50,
      tradingBehavior: 50,
      learningStyle: 50,
    },
    learningPath: 'structured',
    dashboardLayout: {
      primaryWidget: 'performance',
      widgetOrder: ['performance', 'alerts', 'metrics'],
    },
    alertThresholds: {
      riskSensitivity: 'medium',
      alertFrequency: 'normal',
    },
    recommendations: [],
  };
}