import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runFullCheck, getUserSettings, detectAlerts } from '@/lib/risk-guardian/detector';
import type { DetectionInput } from '@/types/guardian';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const settings = await getUserSettings(user.id);
    let alerts = [];
    
    if (body.recentTrades && body.recentTrades.length > 0) {
      const lotSizes = body.recentTrades.map((t: { lotSize: number }) => t.lotSize).filter((l: number) => l > 0);
      const historicalAverage = lotSizes.length > 0 
        ? lotSizes.reduce((sum: number, l: number) => sum + l, 0) / lotSizes.length 
        : 0;

      const detectionInput: DetectionInput = {
        userId: user.id,
        recentTrades: body.recentTrades,
        currentExposure: body.currentExposure || 0,
        historicalAverage,
        sessionStart: new Date(),
        emotionalStates: body.recentTrades.map((t: { emotionalState?: string }) => t.emotionalState || 'neutral'),
        settings
      };
      alerts = detectAlerts(detectionInput);
    } else {
      alerts = await runFullCheck(user.id, settings);
    }

    let newCount = 0;
    for (const alert of alerts) {
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
          acknowledged: false
        });
      if (!insertError) newCount++;
    }

    return NextResponse.json({ alerts, newCount });
  } catch (error) {
    console.error('Error running alert check:', error);
    return NextResponse.json({ 
      error: 'Failed to run alert check',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}