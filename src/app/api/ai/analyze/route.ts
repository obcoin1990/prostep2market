import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { runFullAnalysis } from '@/lib/analysis/orchestrator';
import { z } from 'zod';

const analyzeSchema = z.object({
  tradeId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
}).refine(
  (data) => data.tradeId || (data.startDate && data.endDate),
  { message: 'Either tradeId or both startDate and endDate required' }
);

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = analyzeSchema.parse(body);
    const { tradeId, startDate, endDate } = parsed;

    // Run analysis
    const result = await runFullAnalysis({
      userId: user.id,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      tradeIds: tradeId ? [tradeId] : undefined,
    });

    return NextResponse.json({
      analysis: result,
      message: 'Analysis complete',
    });
  } catch (error) {
    console.error('Analysis error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
