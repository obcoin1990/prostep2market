import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/guardian/resume - Deactivate pause mode
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Update pause_mode table: set active = false
    const { error } = await supabase
      .from('pause_mode')
      .update({ active: false })
      .eq('user_id', user.id)
      .eq('active', true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ resumed: true });
  } catch (error) {
    console.error('Error resuming from pause mode:', error);
    return NextResponse.json({ error: 'Failed to resume from pause mode' }, { status: 500 });
  }
}