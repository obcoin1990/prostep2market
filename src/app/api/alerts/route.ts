import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/alerts - List alerts for authenticated user
 * Query params: ?acknowledged=false&limit=10&type=revenge_trading
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const acknowledged = searchParams.get('acknowledged');
  const limit = parseInt(searchParams.get('limit') || '10');
  const type = searchParams.get('type');

  let query = supabase
    .from('alerts')
    .select('*')
    .eq('user_id', user.id)
    .order('triggered_at', { ascending: false })
    .limit(limit);

  if (acknowledged !== null) {
    query = query.eq('acknowledged', acknowledged === 'true');
  }

  if (type) {
    query = query.eq('type', type);
  }

  const { data: alerts, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform to match Alert interface
  const transformedAlerts = alerts?.map(alert => ({
    id: alert.id,
    userId: alert.user_id,
    type: alert.type,
    severity: alert.severity,
    title: alert.title,
    message: alert.message,
    suggestedAction: alert.suggested_action,
    triggeredAt: alert.triggered_at,
    tradeIds: alert.trade_ids,
    acknowledged: alert.acknowledged,
    acknowledgedAt: alert.acknowledged_at
  })) || [];

  return NextResponse.json({ 
    alerts: transformedAlerts, 
    count: transformedAlerts.length 
  });
}