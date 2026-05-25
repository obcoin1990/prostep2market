import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { RiskGuardianSettings, PROFILE_DEFAULTS, ProfileType, ABUSE_DETECTION_DEFAULTS } from '@/types/guardian';

/**
 * GET /api/guardian/settings — Get user's guardian settings
 */
export async function GET(_request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { data: settings, error } = await supabase
      .from('risk_guardian_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!settings) {
      // Create profile-based defaults
      const { data: profile } = await supabase
        .from('trader_profiles')
        .select('profile_type')
        .eq('id', user.id)
        .single();

      const profileType = (profile?.profile_type as ProfileType) || 'default';
      const defaults = PROFILE_DEFAULTS[profileType] || PROFILE_DEFAULTS.default;

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
          emotional_instability_threshold: defaults.emotionalInstabilityThreshold,
          // Abuse-detection defaults
          scalping_enabled: defaults.scalpingEnabled,
          scalping_min_duration_seconds: defaults.scalpingMinDurationSeconds,
          scalping_max_trades_per_day: defaults.scalpingMaxTradesPerDay,
          arbitrage_enabled: defaults.arbitrageEnabled,
          arbitrage_max_avg_duration_seconds: defaults.arbitrageMaxAvgDurationSeconds,
          arbitrage_min_win_rate: defaults.arbitrageMinWinRate,
          arbitrage_max_rr: defaults.arbitrageMaxRR,
          hedging_enabled: defaults.hedgingEnabled,
          hedging_time_window_seconds: defaults.hedgingTimeWindowSeconds,
          hedging_lot_size_tolerance: defaults.hedgingLotSizeTolerance,
        })
        .select()
        .single();

      if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

      return NextResponse.json({ settings: dbRowToSettings(newSettings, user.id) });
    }

    return NextResponse.json({ settings: dbRowToSettings(settings, user.id) });
  } catch (error) {
    console.error('Error getting guardian settings:', error);
    return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 });
  }
}

/**
 * PATCH /api/guardian/settings — Update user's guardian settings
 */
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();

    const allowedFields = [
      // Existing
      'maxSessionDuration',
      'maxTradesPerSession',
      'maxTradesPerWindow',
      'exposureMultiplier',
      'fatigueWarningEnabled',
      'revengeTradingAlertEnabled',
      'emotionalInstabilityThreshold',
      // Abuse-detection
      'scalpingEnabled',
      'scalpingMinDurationSeconds',
      'scalpingMaxTradesPerDay',
      'arbitrageEnabled',
      'arbitrageMaxAvgDurationSeconds',
      'arbitrageMinWinRate',
      'arbitrageMaxRR',
      'hedgingEnabled',
      'hedgingTimeWindowSeconds',
      'hedgingLotSizeTolerance',
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        const snakeCase = field.replace(/([A-Z])/g, '_$1').toLowerCase();
        updateData[snakeCase] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    updateData.updated_at = new Date().toISOString();

    const { data: settings, error } = await supabase
      .from('risk_guardian_settings')
      .upsert({ user_id: user.id, ...updateData }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ settings: dbRowToSettings(settings, user.id) });
  } catch (error) {
    console.error('Error updating guardian settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

// ── Helper ────────────────────────────────────────────────────────────────────

function dbRowToSettings(row: Record<string, unknown>, userId: string): RiskGuardianSettings {
  return {
    userId,
    maxSessionDuration: row.max_session_duration as number,
    maxTradesPerSession: row.max_trades_per_session as number,
    maxTradesPerWindow: row.max_trades_per_window as number,
    exposureMultiplier: Number(row.exposure_multiplier),
    fatigueWarningEnabled: row.fatigue_warning_enabled as boolean,
    revengeTradingAlertEnabled: row.revenge_trading_alert_enabled as boolean,
    emotionalInstabilityThreshold: row.emotional_instability_threshold as number,

    scalpingEnabled:            (row.scalping_enabled             ?? ABUSE_DETECTION_DEFAULTS.scalpingEnabled) as boolean,
    scalpingMinDurationSeconds: (row.scalping_min_duration_seconds ?? ABUSE_DETECTION_DEFAULTS.scalpingMinDurationSeconds) as number,
    scalpingMaxTradesPerDay:    (row.scalping_max_trades_per_day   ?? ABUSE_DETECTION_DEFAULTS.scalpingMaxTradesPerDay) as number,

    arbitrageEnabled:               (row.arbitrage_enabled                  ?? ABUSE_DETECTION_DEFAULTS.arbitrageEnabled) as boolean,
    arbitrageMaxAvgDurationSeconds: (row.arbitrage_max_avg_duration_seconds ?? ABUSE_DETECTION_DEFAULTS.arbitrageMaxAvgDurationSeconds) as number,
    arbitrageMinWinRate:            Number(row.arbitrage_min_win_rate       ?? ABUSE_DETECTION_DEFAULTS.arbitrageMinWinRate),
    arbitrageMaxRR:                 Number(row.arbitrage_max_rr             ?? ABUSE_DETECTION_DEFAULTS.arbitrageMaxRR),

    hedgingEnabled:           (row.hedging_enabled              ?? ABUSE_DETECTION_DEFAULTS.hedgingEnabled) as boolean,
    hedgingTimeWindowSeconds: (row.hedging_time_window_seconds  ?? ABUSE_DETECTION_DEFAULTS.hedgingTimeWindowSeconds) as number,
    hedgingLotSizeTolerance:  Number(row.hedging_lot_size_tolerance ?? ABUSE_DETECTION_DEFAULTS.hedgingLotSizeTolerance),
  };
}
