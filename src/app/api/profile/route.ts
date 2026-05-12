import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { saveTraderProfile } from '@/lib/trader-profile';
import { TraderProfile } from '@/types/trader-dna';

/**
 * POST /api/profile - Save the trader profile for the authenticated user
 * Body: TraderProfile JSON
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile: TraderProfile = await request.json();
    const result = await saveTraderProfile(profile);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to save profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving trader profile:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
