import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminContext } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { BehavioralFlag } from '@/types/guardian';

/**
 * GET /api/admin/abuse-flags
 * Returns behavioral flags for all users (admin only).
 * Query params:
 *   ?active=true     → only active flags (default)
 *   ?userId=<id>     → filter by user
 *   ?flagType=<type> → filter by flag type
 *   ?limit=<n>       → max rows (default 100)
 */
export async function GET(request: NextRequest) {
  const result = await getAdminContext();
  if (result instanceof NextResponse) return result;

  const { searchParams } = new URL(request.url);
  const activeOnly  = searchParams.get('active') !== 'false';
  const userId      = searchParams.get('userId');
  const flagType    = searchParams.get('flagType');
  const limit       = Math.min(500, parseInt(searchParams.get('limit') ?? '100', 10));

  const adminClient = createAdminClient();
  let query = adminClient
    .from('abuse_flags')
    .select('*')
    .order('detected_at', { ascending: false })
    .limit(limit);

  if (activeOnly)  query = query.eq('is_active', true);
  if (userId)      query = query.eq('user_id', userId);
  if (flagType)    query = query.eq('flag_type', flagType);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const flags: BehavioralFlag[] = (data ?? []).map(rowToFlag);
  return NextResponse.json({ flags });
}

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
