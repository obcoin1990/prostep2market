/**
 * Leaderboard API Route
 * GET: Fetch leaderboard with privacy filtering
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRankConfig } from '@/lib/edge-score';

type Visibility = 'public' | 'anonymous' | 'hidden';

/**
 * GET /api/leaderboard - Fetch privacy-filtered leaderboard
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse query parameters
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'monthly'; // weekly, monthly, all-time
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '100'));

  // Calculate date range based on period
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'weekly':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'monthly':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'all-time':
    default:
      startDate = new Date(0); // Beginning of time
      break;
  }

  // Fetch leaderboard settings to filter visible users
  const { data: settings } = await supabase
    .from('leaderboard_settings')
    .select('user_id, visibility')
    .eq('show_in_leaderboard', true)
    .neq('visibility', 'hidden');

  const visibleUserIds = settings?.map(s => s.user_id).filter(Boolean) || [];

  if (visibleUserIds.length === 0) {
    return NextResponse.json({
      entries: [],
      userRank: null,
      pagination: {
        total: 0,
        hasMore: false,
      },
    });
  }

  // Build visibility map for display names
  const visibilityMap: Record<string, Visibility> = {};
  settings?.forEach(s => {
    visibilityMap[s.user_id] = s.visibility as Visibility;
  });

  // Fetch top scores from edge_scores
  // We need to get the latest score per user for the period
  const { data: scores, error } = await supabase
    .from('edge_scores')
    .select(`
      user_id,
      composite_score,
      rank,
      date
    `)
    .in('user_id', visibleUserIds)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('composite_score', { ascending: false })
    .limit(limit * 2); // Fetch more to account for multiple scores per user

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get the latest score per user
  const latestScores = new Map<string, {
    compositeScore: number;
    rank: string;
    date: string;
  }>();

  scores?.forEach(score => {
    const existing = latestScores.get(score.user_id);
    if (!existing || score.date > existing.date) {
      latestScores.set(score.user_id, {
        compositeScore: parseFloat(score.composite_score as unknown as string),
        rank: score.rank,
        date: score.date,
      });
    }
  });

  // Sort by score descending
  const sortedUsers = Array.from(latestScores.entries())
    .sort((a, b) => b[1].compositeScore - a[1].compositeScore)
    .slice(0, limit);

  // Fetch user profiles for display names
  const userIds = sortedUsers.map(([userId]) => userId);
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, display_name, avatar_url')
    .in('id', userIds);

  const profileMap = new Map(
    profiles?.map(p => [p.id, p]) || []
  );

  // Build leaderboard entries with privacy-aware display names
  const entries = sortedUsers.map(([userId, score], index) => {
    const visibility = visibilityMap[userId] || 'anonymous';
    const profile = profileMap.get(userId);
    const rankConfig = getRankConfig(score.rank as any);

    return {
      rank: index + 1,
      userId,
      displayName: visibility === 'public' && profile?.display_name
        ? profile.display_name
        : `Trader #${userId.slice(0, 6).toUpperCase()}`,
      compositeScore: score.compositeScore,
      rankLabel: rankConfig.label,
      isCurrentUser: userId === user.id,
      visibility,
      avatarUrl: visibility === 'public' ? profile?.avatar_url : null,
    };
  });

  // Find current user's rank if not in top entries
  let userRank: { rank: number; score: number } | null = null;
  if (!entries.some(e => e.isCurrentUser)) {
    const userScore = latestScores.get(user.id);
    if (userScore) {
      const userIndex = Array.from(latestScores.keys())
        .filter(id => visibleUserIds.includes(id))
        .sort((a, b) => (latestScores.get(b)?.compositeScore || 0) - (latestScores.get(a)?.compositeScore || 0))
        .indexOf(user.id);
      
      userRank = {
        rank: userIndex + 1,
        score: userScore.compositeScore,
      };
    }
  }

  return NextResponse.json({
    entries,
    userRank,
    period,
    pagination: {
      total: latestScores.size,
      hasMore: sortedUsers.length >= limit,
    },
  });
}