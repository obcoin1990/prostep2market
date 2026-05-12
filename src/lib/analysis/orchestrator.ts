import type {
  AnalysisRequest,
  FullAnalysisResult,
  AnalysisResult,
  Trade,
} from '@/types/analysis';
import { detectPatterns } from './patterns/detector';
import { calculateDrawdown } from './metrics/drawdown';
import { calculateLotSizeVariance, calculateExposureProfile, calculateMarginPressureEvents } from './metrics/risk';
import { calculateTradeQuality } from './metrics/quality';
import { calculateSessionPerformance, identifyWorstConditions, buildHeatmapData } from './performance/sessions';
import { calculatePairPerformance } from './performance/pairs';
import { generateInsights } from './insights/generator';
import { createClient } from '@/lib/supabase/server';

/**
 * Orchestrates the full analysis pipeline.
 * 1. Loads trades from database
 * 2. Calculates trade quality for each trade
 * 3. Detects behavioral patterns
 * 4. Calculates risk metrics
 * 5. Aggregates performance analytics
 * 6. Generates AI insights
 */
export async function runFullAnalysis(
  request: AnalysisRequest
): Promise<FullAnalysisResult> {
  // 1. Load trades from database
  const trades = await loadTrades(request);

  if (trades.length === 0) {
    return {
      tradeAnalyses: [],
      aggregatedRisk: {
        lotSizeVariance: 0,
        drawdownBehavior: {
          maxDrawdown: 0,
          maxDrawdownDuration: 0,
          avgRecoveryDays: 0,
          recoveryPattern: 'normal',
        },
        exposureProfile: {
          maxConcurrentPositions: 0,
          avgHoldingPeriod: 0,
          sessionExposure: {},
        },
        marginPressureEvents: 0,
      },
      performance: {
        bestSessions: [],
        worstConditions: [],
        pairPerformance: {},
        timeAnalysis: [],
      },
      behavioralPatterns: {
        revengeTrading: { detected: false, severity: 'low', evidence: [], tradeIds: [] },
        impulsiveTrades: { detected: false, count: 0, triggers: [] },
        overconfidence: { detected: false, evidence: [] },
        fearExits: { detected: false, instances: [] },
        overtrading: { detected: false, sessionCount: 0 },
        fomo: { detected: false, evidence: [] },
      },
      insights: [],
    };
  }

  // 2. Calculate trade quality for each trade
  const tradeAnalyses: AnalysisResult[] = trades.map((trade) => ({
    tradeId: trade.id,
    quality: calculateTradeQuality(trade),
    patterns: {
      revengeTrading: { detected: false, severity: 'low', evidence: [], tradeIds: [] },
      impulsiveTrades: { detected: false, count: 0, triggers: [] },
      overconfidence: { detected: false, evidence: [] },
      fearExits: { detected: false, instances: [] },
      overtrading: { detected: false, sessionCount: 0 },
      fomo: { detected: false, evidence: [] },
    },
  }));

  // 3. Detect behavioral patterns across all trades
  const behavioralPatterns = detectPatterns(trades);

  // 4. Calculate risk metrics
  const drawdownResult = calculateDrawdown(trades);
  const lotSizeVariance = calculateLotSizeVariance(trades);
  const exposureProfile = calculateExposureProfile(trades);
  const marginPressureEvents = calculateMarginPressureEvents(trades);

  const aggregatedRisk = {
    lotSizeVariance,
    drawdownBehavior: drawdownResult.profile,
    exposureProfile,
    marginPressureEvents,
  };

  // 5. Aggregate performance analytics
  const sessionPerformance = calculateSessionPerformance(trades);
  const worstConditions = identifyWorstConditions(trades);
  const pairPerformance = calculatePairPerformance(trades);
  const timeAnalysis = buildHeatmapData(trades);

  const performance = {
    bestSessions: sessionPerformance,
    worstConditions,
    pairPerformance,
    timeAnalysis,
  };

  // 6. Generate AI insights
  const insights = await generateInsights(trades, behavioralPatterns, aggregatedRisk);

  return {
    tradeAnalyses,
    aggregatedRisk,
    performance,
    behavioralPatterns,
    insights,
  };
}

/**
 * Loads trades from Supabase for the given analysis request.
 */
async function loadTrades(request: AnalysisRequest): Promise<Trade[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('trades')
      .select('*')
      .eq('user_id', request.userId)
      .order('entry_time', { ascending: true });

    if (request.startDate) {
      query = query.gte('entry_time', request.startDate.toISOString());
    }

    if (request.endDate) {
      query = query.lte('entry_time', request.endDate.toISOString());
    }

    if (request.tradeIds && request.tradeIds.length > 0) {
      query = query.in('id', request.tradeIds);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading trades:', error);
      return [];
    }

    return (data || []) as Trade[];
  } catch (error) {
    console.error('Error loading trades:', error);
    return [];
  }
}
