import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { BehavioralFlag } from '@/types/guardian';

/**
 * GET /api/guardian/flags
 * Returns behavioral flags for the authenticated user.
 * ?active=true  → only active (non-cleared) flags (default)
 * ?active=false → all flags including cleared
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get('active') !== 'false';

  let query = supabase
    .from('abuse_flags')
    .select('*')
    .eq('user_id', user.id)
    .order('detected_at', { ascending: false })
    .limit(50);

  if (activeOnly) query = query.eq('is_active', true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const flags: BehavioralFlag[] = (data ?? []).map(rowToFlag);
  return NextResponse.json({ flags });
}

// ── Helper ────────────────────────────────────────────────────────────────────

function rowToFlag(row: Record<string, unknown>): BehavioralFlag {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    flagType: row.flag_type as BehavioralFlag['flagType'],
    detectedAt: row.detected_at as string,
    details: (row.details ?? {}) as BehavioralFlag['details'],
    tradeIds: (row.trade_ids ?? []) as string[],
    isActive: row.is_active as boolean,
    clearedAt: row.cleared_at as string | undefined,
    clearedBy: row.cleared_by as string | undefined,
  };
}
