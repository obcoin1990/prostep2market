import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { RiskGuardianSettings, PROFILE_DEFAULTS, ProfileType } from '@/types/guardian';

/**
 * GET /api/guardian/settings - Get user's guardian settings
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Try to get existing settings
    const { data: settings, error } = await supabase
      .from('risk_guardian_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no settings exist, create defaults based on trader profile
    if (!settings) {
      // Get trader profile to determine profile type
      const { data: profile } = await supabase
        .from('trader_profiles')
        .select('profile_type')
        .eq('id', user.id)
        .single();

      const profileType = (profile?.profile_type as ProfileType) || 'default';
      const defaults = PROFILE_DEFAULTS[profileType] || PROFILE_DEFAULTS.default;

      // Create default settings
      const { data: newSettings, error: insertError } = await supabase
        .from('risk_guardian_settings')
        .insert({
          user_id: user.id,
          max_session_duration: defaults.maxSessionDuration,
          max_trades_per_session: defaults.maxTradesPerSession,
          max_trades_per_window: defaults.maxTradesPerWindow,
          exposure_multiplier: defaults.exposureMultiplier,
          fatigue_warning_enabled: defaults.fatigueWarningEnabled,
          revenge_trading_alert_enabled: defaults.revengeTradingAlertEnabled,
          emotional_instability_threshold: defaults.emotionalInstabilityThreshold
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ 
        settings: {
          userId: newSettings.user_id,
          maxSessionDuration: newSettings.max_session_duration,
          maxTradesPerSession: newSettings.max_trades_per_session,
          maxTradesPerWindow: newSettings.max_trades_per_window,
          exposureMultiplier: Number(newSettings.exposure_multiplier),
          fatigueWarningEnabled: newSettings.fatigue_warning_enabled,
          revengeTradingAlertEnabled: newSettings.revenge_trading_alert_enabled,
          emotionalInstabilityThreshold: newSettings.emotional_instability_threshold
        }
      });
    }

    // Return existing settings
    return NextResponse.json({ 
      settings: {
        userId: settings.user_id,
        maxSessionDuration: settings.max_session_duration,
        maxTradesPerSession: settings.max_trades_per_session,
        maxTradesPerWindow: settings.max_trades_per_window,
        exposureMultiplier: Number(settings.exposure_multiplier),
        fatigueWarningEnabled: settings.fatigue_warning_enabled,
        revengeTradingAlertEnabled: settings.revenge_trading_alert_enabled,
        emotionalInstabilityThreshold: settings.emotional_instability_threshold
      }
    });
  } catch (error) {
    console.error('Error getting guardian settings:', error);
    return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 });
  }
}

/**
 * PATCH /api/guardian/settings - Update user's guardian settings
 */
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate input
    const allowedFields = [
      'maxSessionDuration',
      'maxTradesPerSession',
      'maxTradesPerWindow',
      'exposureMultiplier',
      'fatigueWarningEnabled',
      'revengeTradingAlertEnabled',
      'emotionalInstabilityThreshold'
    ];

    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // Convert camelCase to snake_case
        const snakeCase = field.replace(/([A-Z])/g, '_$1').toLowerCase();
        updateData[snakeCase] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    updateData.updated_at = new Date().toISOString();

    // Upsert settings
    const { data: settings, error } = await supabase
      .from('risk_guardian_settings')
      .upsert({
        user_id: user.id,
        ...updateData
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      settings: {
        userId: settings.user_id,
        maxSessionDuration: settings.max_session_duration,
        maxTradesPerSession: settings.max_trades_per_session,
        maxTradesPerWindow: settings.max_trades_per_window,
        exposureMultiplier: Number(settings.exposure_multiplier),
        fatigueWarningEnabled: settings.fatigue_warning_enabled,
        revengeTradingAlertEnabled: settings.revenge_trading_alert_enabled,
        emotionalInstabilityThreshold: settings.emotional_instability_threshold
      }
    });
  } catch (error) {
    console.error('Error updating guardian settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
