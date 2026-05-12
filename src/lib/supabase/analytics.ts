import { createClient } from '@/lib/supabase/server';

export interface TradeAnalysis {
  tradeId: string;
  userId: string;
  quality: {
    entryTimingScore: number;
    exitQualityScore: number;
    rrEfficiency: number;
    qualityGrade: string;
  };
  patterns: Record<string, unknown>;
  riskMetrics: Record<string, unknown>;
  insights: Record<string, unknown>[];
}

export interface DailyAnalyticsRecord {
  userId: string;
  date: string;
  totalTrades: number;
  winRate: number;
  avgRR: number;
  totalPnl: number;
  maxDrawdown: number;
  lotSizeVariance: number;
  behavioralFlags: Record<string, unknown>;
  topInsights: Record<string, unknown>[];
}

export async function getTradeAnalysis(tradeId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('trade_analyses')
    .select('*')
    .eq('trade_id', tradeId)
    .single();

  if (error) throw error;
  return data;
}

export async function saveTradeAnalysis(analysis: TradeAnalysis) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('trade_analyses')
    .upsert(
      {
        trade_id: analysis.tradeId,
        user_id: analysis.userId,
        entry_timing_score: analysis.quality.entryTimingScore,
        exit_quality_score: analysis.quality.exitQualityScore,
        rr_efficiency: analysis.quality.rrEfficiency,
        quality_grade: analysis.quality.qualityGrade,
        behavioral_patterns: analysis.patterns,
        risk_metrics: analysis.riskMetrics,
        ai_insights: analysis.insights,
      },
      { onConflict: 'trade_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDailyAnalytics(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('daily_analytics')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) throw error;
  return data;
}

export async function saveDailyAnalytics(daily: DailyAnalyticsRecord) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('daily_analytics')
    .upsert(
      {
        user_id: daily.userId,
        date: daily.date,
        total_trades: daily.totalTrades,
        win_rate: daily.winRate,
        avg_rr: daily.avgRR,
        total_pnl: daily.totalPnl,
        max_drawdown: daily.maxDrawdown,
        lot_size_variance: daily.lotSizeVariance,
        behavioral_flags: daily.behavioralFlags,
        top_insights: daily.topInsights,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAlertsForDashboard(userId: string, limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('daily_analytics')
    .select('date, behavioral_flags')
    .eq('user_id', userId)
    .not('behavioral_flags', 'eq', '{}')
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
