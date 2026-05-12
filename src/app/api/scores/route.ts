/**
 * Edge Score API Route
 * GET: Fetch current user's latest edge score
 * POST: Trigger score calculation for user
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  calculateEdgeScoresFromTrades,
  getRank,
  generateQuickTips,
  type EdgeScoreBreakdown,
} from '@/lib/edge-score';

/**
 * GET /api/scores - Fetch latest edge score for current user
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch latest score from edge_scores table
  const { data: latestScore, error: latestError } = await supabase
    .from('edge_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (latestError && latestError.code !== 'PGRST116') {
    // PGRST116 = no rows returned, which is fine for new users
    return NextResponse.json({ error: latestError.message }, { status: 500 });
  }

  // Fetch behavioral patterns from trade_analyses for AI tips
  const { data: patterns } = await supabase
    .from('trade_analyses')
    .select('recurring_mistakes, behavioral_triggers')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  // Extract recurring mistakes from patterns
  const recurringMistakes = patterns
    ?.filter(p => p.recurring_mistakes)
    .flatMap(p => p.recurring_mistakes as string[]);

  const behavioralTriggers = patterns
    ?.filter(p => p.behavioral_triggers)
    .flatMap(p => p.behavioral_triggers as string[]);

  // If no score exists, generate tips based on patterns
  if (!latestScore) {
    // Check if user has any trades
    const { count } = await supabase
      .from('trades')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if ((count ?? 0) === 0) {
      return NextResponse.json({
        score: null,
        isNewUser: true,
        message: 'Start logging trades to see your Edge Score',
      });
    }

    // User has trades but no score yet - calculate now
    return NextResponse.json({
      score: null,
      isNewUser: false,
      hasTrades: true,
      message: 'Calculate your score by posting to this endpoint',
    });
  }

  // Build score breakdown from database
  const scoreBreakdown: EdgeScoreBreakdown = {
    disciplineScore: parseFloat(latestScore.discipline_score as unknown as string),
    riskScore: parseFloat(latestScore.risk_score as unknown as string),
    emotionalStabilityScore: parseFloat(latestScore.emotional_stability_score as unknown as string),
    consistencyScore: parseFloat(latestScore.consistency_score as unknown as string),
    strategyAdherenceScore: parseFloat(latestScore.strategy_adherence_score as unknown as string),
    compositeScore: parseFloat(latestScore.composite_score as unknown as string),
  };

  // Generate tips (integrate with AI patterns if available)
  let tips = generateQuickTips(scoreBreakdown);

  // If we have AI-identified patterns, prepend them to tips
  if (recurringMistakes && recurringMistakes.length > 0) {
    const aiTip = {
      level: 'improvement' as const,
      message: `AI detected recurring mistakes: ${recurringMistakes.slice(0, 2).join(', ')}. Address these patterns to improve your score.`,
      category: 'discipline' as const,
    };
    tips = [aiTip, ...tips];
  }

  return NextResponse.json({
    score: {
      ...scoreBreakdown,
      rank: latestScore.rank,
      date: latestScore.date,
    },
    tips,
    behavioralTriggers,
    isNewUser: false,
  });
}

/**
 * POST /api/scores - Calculate and store new edge score
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse request body for custom parameters
  let days = 30;
  try {
    const body = await request.json();
    if (body.days && typeof body.days === 'number') {
      days = Math.min(90, Math.max(1, body.days));
    }
  } catch {
    // No body provided, use default
  }

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Fetch trades for the period
  const { data: trades, error: tradesError } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', user.id)
    .gte('entry_time', startDate.toISOString())
    .lte('entry_time', endDate.toISOString())
    .order('entry_time', { ascending: false });

  if (tradesError) {
    return NextResponse.json({ error: tradesError.message }, { status: 500 });
  }

  // Fetch alert timestamps to accurately count trades placed after an alert
  const { data: alertRows } = await supabase
    .from('alerts')
    .select('triggered_at')
    .eq('user_id', user.id)
    .gte('triggered_at', startDate.toISOString());

  const alertTimestamps = (alertRows || []).map(a => new Date(a.triggered_at).getTime());

  // A trade "after an alert" = entry_time falls within 30 min of any alert trigger
  const POST_ALERT_WINDOW_MS = 30 * 60 * 1000;
  const tradesAfterAlerts = (trades || []).filter(t => {
    const entryMs = new Date(t.entry_time).getTime();
    return alertTimestamps.some(alertMs => entryMs >= alertMs && entryMs <= alertMs + POST_ALERT_WINDOW_MS);
  }).length;

  // Calculate journaling days (unique dates with trades)
  const tradeDates = new Set(
    trades?.map(t => new Date(t.entry_time).toISOString().split('T')[0]) || []
  );

  // Get account size from user metadata or use default
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('account_size')
    .eq('id', user.id)
    .single();

  const accountSize = profile?.account_size || 10000;
  const maxDrawdown = accountSize * 0.1; // Estimate 10% as default

  // Calculate scores using edge-score library
  const scores = await calculateEdgeScoresFromTrades(
    trades || [],
    {
      accountSize,
      maxDrawdown,
      alertCount: alertTimestamps.length,
      calmTrades: trades?.filter(t => !['fear', 'panic', 'frustration'].includes(t.emotional_state?.toLowerCase() || '')).length || 0,
      tradesAfterAlerts,
      journalingDays: tradeDates.size,
    }
  );

  const rank = getRank(scores.compositeScore);

  // Insert or update score for today
  const today = new Date().toISOString().split('T')[0];

  const { data: savedScore, error: saveError } = await supabase
    .from('edge_scores')
    .upsert({
      user_id: user.id,
      date: today,
      discipline_score: scores.disciplineScore,
      risk_score: scores.riskScore,
      emotional_stability_score: scores.emotionalStabilityScore,
      consistency_score: scores.consistencyScore,
      strategy_adherence_score: scores.strategyAdherenceScore,
      composite_score: scores.compositeScore,
      rank,
    }, {
      onConflict: 'user_id,date',
    })
    .select()
    .single();

  if (saveError) {
    return NextResponse.json({ error: saveError.message }, { status: 500 });
  }

  // Generate tips
  const tips = generateQuickTips(scores);

  return NextResponse.json({
    score: {
      ...scores,
      rank,
      date: today,
    },
    tips,
    tradesAnalyzed: trades?.length || 0,
    days,
  });
}
