import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDailyAnalytics, getAlertsForDashboard } from '@/lib/supabase/analytics';
import { calculatePairPerformance } from '@/lib/analysis/performance/pairs';
import { calculateSessionPerformance } from '@/lib/analysis/performance/sessions';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import type { PairStats } from '@/types/analysis';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get('days') || '7');

  // Limit to 90 days max
  const limitedDays = Math.min(days, 90);

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - limitedDays);

  try {
    // Get daily analytics
    const dailyData = await getDailyAnalytics(user.id, startDate, endDate);

    // Get alerts
    const alerts = await getAlertsForDashboard(user.id, 5);

    // Transform for dashboard widgets
    const aiAlerts = alerts?.map((a: any) => ({
      id: a.id || crypto.randomUUID(),
      date: a.date,
      ...(a.behavioral_flags || {}),
    })) || [];

    // Get trades for pair and session stats
    const trades = await loadRecentTrades(user.id, startDate, endDate);
    const pairPerformance = calculatePairPerformance(trades as any);
    const sessionPerformance = calculateSessionPerformance(trades as any);

    // Calculate trade statistics
    const tradeStats = {
      pairs: Object.values(pairPerformance)
        .sort((a, b) => b.winRate - a.winRate)
        .slice(0, 5),
      times: sessionPerformance.map((s) => ({
        session: s.session,
        winRate: s.winRate,
        avgRR: s.avgRR,
        totalTrades: s.totalTrades,
      })),
    };

    // Build heatmap data from daily data
    const heatmap = buildHeatmapFromDaily(dailyData || []);

    // Get top insights from daily analytics
    const topInsights = extractTopInsights(dailyData || []);

    return NextResponse.json({
      aiAlerts,
      tradeStats,
      heatmap,
      insights: topInsights,
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}

async function loadRecentTrades(userId: string, startDate: Date, endDate: Date) {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId)
    .gte('entry_time', startDate.toISOString())
    .lte('entry_time', endDate.toISOString())
    .order('entry_time', { ascending: true });

  return data || [];
}

function buildHeatmapFromDaily(dailyData: any[]) {
  // Transform daily data into 7x4 heatmap format
  // Group by day of week and estimate session distribution
  const heatmap: Array<{
    dayOfWeek: number;
    session: string;
    totalTrades: number;
    totalPnl: number;
    winRate: number;
    avgRR: number;
  }> = [];

  for (const day of dailyData) {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    
    // Estimate session distribution based on available data
    // In a real implementation, this would come from trade-level data
    const sessions = ['asian', 'london', 'newyork', 'sydney'];
    const tradesPerSession = Math.ceil(day.total_trades / 4) || 0;

    for (const session of sessions) {
      heatmap.push({
        dayOfWeek,
        session,
        totalTrades: tradesPerSession,
        totalPnl: (day.total_pnl || 0) / 4,
        winRate: day.win_rate || 0,
        avgRR: day.avg_rr || 0,
      });
    }
  }

  return heatmap;
}

function extractTopInsights(dailyData: any[]) {
  const insights: any[] = [];

  for (const day of dailyData) {
    if (day.top_insights && Array.isArray(day.top_insights)) {
      insights.push(...day.top_insights);
    }
  }

  // Sort by confidence and return top 3
  return insights
    .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
    .slice(0, 3);
}
