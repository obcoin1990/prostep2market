import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/guardian/pause/status - Get current pause status for user
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get active pause for user
    const { data: pauseMode, error } = await supabase
      .from('pause_mode')
      .select('*')
      .eq('user_id', user.id)
      .eq('active', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!pauseMode) {
      return NextResponse.json({ pauseMode: null });
    }

    // WR-12: Check if the pause has expired based on duration_minutes + started_at.
    // If expired, treat as no active pause and flip the DB flag to inactive.
    if (pauseMode.duration_minutes && pauseMode.started_at) {
      const startedAt = new Date(pauseMode.started_at).getTime()
      const expiresAt = startedAt + pauseMode.duration_minutes * 60_000
      if (Date.now() >= expiresAt) {
        await supabase
          .from('pause_mode')
          .update({ active: false })
          .eq('id', pauseMode.id)
        return NextResponse.json({ pauseMode: null })
      }
    }

    return NextResponse.json({
      pauseMode: {
        id: pauseMode.id,
        active: pauseMode.active,
        durationMinutes: pauseMode.duration_minutes,
        startedAt: pauseMode.started_at,
        reason: pauseMode.reason
      }
    });
  } catch (error) {
    console.error('Error getting pause status:', error);
    return NextResponse.json({ error: 'Failed to get pause status' }, { status: 500 });
  }
}