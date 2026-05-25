import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runFullCheck, getUserSettings, detectAlerts } from '@/lib/risk-guardian/detector';
import type { Alert, DetectionInput, FlagType } from '@/types/guardian';

const ABUSE_FLAG_TYPES = new Set<FlagType>([
  'abusive_scalping',
  'arbitrage_behavior',
  'hedging_behavior',
]);

/**
 * POST /api/alerts/check
 * Runs all detection rules for the authenticated user and stores triggered alerts.
 * Abuse-detection alerts (scalping, arbitrage, hedging) are also persisted as
 * behavioral flags in the `abuse_flags` table for long-term tracking.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json().catch(() => ({}));
    const settings = await getUserSettings(user.id);
    let alerts: Alert[] = [];

    if (body.recentTrades && body.recentTrades.length > 0) {
      const lotSizes = body.recentTrades
        .map((t: { lotSize: number }) => t.lotSize)
        .filter((l: number) => l > 0);
      const historicalAverage = lotSizes.length > 0
        ? lotSizes.reduce((sum: number, l: number) => sum + l, 0) / lotSizes.length
        : 0;

      const detectionInput: DetectionInput = {
        userId: user.id,
        recentTrades: body.recentTrades,
        currentExposure: body.currentExposure || 0,
        historicalAverage,
        sessionStart: new Date(),
        emotionalStates: body.recentTrades.map(
          (t: { emotionalState?: string }) => t.emotionalState || 'neutral'
        ),
        settings,
      };
      alerts = detectAlerts(detectionInput);
    } else {
      alerts = await runFullCheck(user.id, settings);
    }

    let newCount = 0;
    for (const alert of alerts) {
      // ── Insert into alerts table ──────────────────────────────────────────
      const { error: insertError } = await supabase
        .from('alerts')
        .insert({
          user_id: user.id,
          type: alert.type,
          severity: alert.severity,
          title: alert.title,
          message: alert.message,
          suggested_action: alert.suggestedAction,
          trade_ids: alert.tradeIds,
          triggered_at: alert.triggeredAt.toISOString(),
          acknowledged: false,
        });
      if (!insertError) newCount++;

      // ── Persist behavioral flag for abuse-detection alerts ────────────────
      if (ABUSE_FLAG_TYPES.has(alert.type as FlagType)) {
        await persistBehavioralFlag(supabase, user.id, alert);
      }
    }

    return NextResponse.json({ alerts, newCount });
  } catch (error) {
    console.error('Error running alert check:', error);
    return NextResponse.json(
      { error: 'Failed to run alert check', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ── Behavioral flag persistence ───────────────────────────────────────────────

async function persistBehavioralFlag(
  supabase: Awaited<ReturnType<typeof import('@/lib/supabase/server').createClient>>,
  userId: string,
  alert: Alert
) {
  try {
    // Build details object from the alert message (parsed out of the alert's context)
    const details: Record<string, unknown> = {};

    if (alert.type === 'abusive_scalping') {
      const match = alert.message.match(/(\d+) trades closed/);
      if (match) details.scalpTradeCount = parseInt(match[1], 10);
      const durMatch = alert.message.match(/avg (\d+)s/);
      if (durMatch) details.avgDurationSeconds = parseInt(durMatch[1], 10);
    } else if (alert.type === 'arbitrage_behavior') {
      const durMatch = alert.message.match(/avg duration (\d+)s/);
      if (durMatch) details.avgDurationSeconds = parseInt(durMatch[1], 10);
      const wrMatch = alert.message.match(/win rate ([\d.]+)%/);
      if (wrMatch) details.winRate = parseFloat(wrMatch[1]);
      const rrMatch = alert.message.match(/RR ([\d.]+) across/);
      if (rrMatch) details.avgRR = parseFloat(rrMatch[1]);
    } else if (alert.type === 'hedging_behavior') {
      const pairsMatch = alert.message.match(/(\d+) opposing-position/);
      if (pairsMatch) details.hedgePairCount = parseInt(pairsMatch[1], 10);
    }

    await supabase.from('abuse_flags').insert({
      user_id: userId,
      flag_type: alert.type,
      detected_at: alert.triggeredAt.toISOString(),
      details,
      trade_ids: alert.tradeIds ?? [],
      is_active: true,
    });
  } catch (err) {
    // Non-critical — don't fail the whole check if flag persistence fails
    console.error('Failed to persist behavioral flag:', err);
  }
}
