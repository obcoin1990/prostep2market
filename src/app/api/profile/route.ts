import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { saveTraderProfile } from '@/lib/trader-profile';
import { TraderProfile } from '@/types/trader-dna';
import { z } from 'zod';

const ProfileUpdateSchema = z.object({
  profileType: z.enum(['sniper', 'analyst', 'warrior', 'disciplinarian', 'opportunist']),
  riskPersonalityScore: z.number().int().min(0).max(100).optional(),
  emotionalStabilityScore: z.number().int().min(0).max(100).optional(),
  decisionMakingScore: z.number().int().min(0).max(100).optional(),
  tradingBehaviorScore: z.number().int().min(0).max(100).optional(),
  learningStyleScore: z.number().int().min(0).max(100).optional(),
  learningPath: z.string().optional(),
  dashboardLayout: z.record(z.string(), z.unknown()).optional(),
  alertThresholds: z.record(z.string(), z.unknown()).optional(),
});

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
    const rawBody = await request.json();
    const parseResult = ProfileUpdateSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.issues }, { status: 422 });
    }
    const profile: TraderProfile = rawBody as TraderProfile;
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
