import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/alerts/[id]/acknowledge - Mark alert as acknowledged
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Verify the alert belongs to the user
  const { data: alert, error: fetchError } = await supabase
    .from('alerts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !alert) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
  }

  // Update the alert
  const now = new Date().toISOString();
  const { data: updatedAlert, error } = await supabase
    .from('alerts')
    .update({ 
      acknowledged: true, 
      acknowledged_at: now 
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ 
    alert: {
      id: updatedAlert.id,
      userId: updatedAlert.user_id,
      type: updatedAlert.type,
      severity: updatedAlert.severity,
      title: updatedAlert.title,
      message: updatedAlert.message,
      suggestedAction: updatedAlert.suggested_action,
      triggeredAt: updatedAlert.triggered_at,
      tradeIds: updatedAlert.trade_ids,
      acknowledged: updatedAlert.acknowledged,
      acknowledgedAt: updatedAlert.acknowledged_at
    }
  });
}