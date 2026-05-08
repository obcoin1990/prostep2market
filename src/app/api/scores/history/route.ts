/**
 * Edge Score History API Route
 * GET: Fetch score history for user (for sparkline)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Rank } from '@/lib/edge-score';

/**
 * GET /api/scores/history - Fetch score history for sparkline
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse days parameter (default 30, max 90)
  const { searchParams } = new URL(request.url);
  let days = parseInt(searchParams.get('days') || '30');
  days = Math.min(90, Math.max(1, days));

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Fetch score history
  const { data: history, error } = await supabase
    .from('edge_scores')
    .select('date, discipline_score, risk_score, emotional_stability_score, consistency_score, strategy_adherence_score, composite_score, rank')
    .eq('user_id', user.id)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform to SparklineData format
  const sparklineData = (history || []).map(record => ({
    date: record.date,
    score: parseFloat(record.composite_score as unknown as string),
  }));

  // Also return full history for breakdown display
  const fullHistory = (history || []).map(record => ({
    date: record.date,
    disciplineScore: parseFloat(record.discipline_score as unknown as string),
    riskScore: parseFloat(record.risk_score as unknown as string),
    emotionalStabilityScore: parseFloat(record.emotional_stability_score as unknown as string),
    consistencyScore: parseFloat(record.consistency_score as unknown as string),
    strategyAdherenceScore: parseFloat(record.strategy_adherence_score as unknown as string),
    compositeScore: parseFloat(record.composite_score as unknown as string),
    rank: record.rank as Rank,
  }));

  return NextResponse.json({
    history: fullHistory,
    sparklineData,
    days,
    totalRecords: history?.length || 0,
  });
}