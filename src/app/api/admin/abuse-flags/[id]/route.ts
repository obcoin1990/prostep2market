import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminContext } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * PATCH /api/admin/abuse-flags/[id]
 * Clear (deactivate) a behavioral flag.
 * Body: { action: 'clear' | 'reactivate' }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await getAdminContext();
  if (result instanceof NextResponse) return result;
  const { user } = result;

  const { id } = await params;

  let body: { action?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const action = body.action ?? 'clear';
  if (!['clear', 'reactivate'].includes(action)) {
    return NextResponse.json({ error: 'action must be "clear" or "reactivate"' }, { status: 400 });
  }

  const adminClient = createAdminClient();

  // Verify flag exists
  const { data: existing, error: fetchError } = await adminClient
    .from('abuse_flags')
    .select('id')
    .eq('id', id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Flag not found' }, { status: 404 });
  }

  const update =
    action === 'clear'
      ? { is_active: false, cleared_at: new Date().toISOString(), cleared_by: user.id }
      : { is_active: true, cleared_at: null, cleared_by: null };

  const { data, error } = await adminClient
    .from('abuse_flags')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, flag: data });
}
