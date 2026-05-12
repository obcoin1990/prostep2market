import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/guardian/pause - Activate pause mode for the authenticated user
 * Body: { durationMinutes: number, reason?: string }
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { durationMinutes, reason } = body;

    if (!durationMinutes || typeof durationMinutes !== 'number' || durationMinutes <= 0) {
      return NextResponse.json({ error: 'durationMinutes must be a positive number' }, { status: 400 });
    }

    // Deactivate any existing active pause first
    await supabase
      .from('pause_mode')
      .update({ active: false })
      .eq('user_id', user.id)
      .eq('active', true);

    // Insert new pause record
    const { data: pauseMode, error } = await supabase
      .from('pause_mode')
      .insert({
        user_id: user.id,
        duration_minutes: durationMinutes,
        reason: reason ?? null,
        active: true,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      pauseMode: {
        id: pauseMode.id,
        active: pauseMode.active,
        durationMinutes: pauseMode.duration_minutes,
        startedAt: pauseMode.started_at,
        reason: pauseMode.reason,
      },
    });
  } catch (error) {
    console.error('Error activating pause mode:', error);
    return NextResponse.json({ error: 'Failed to activate pause mode' }, { status: 500 });
  }
}
