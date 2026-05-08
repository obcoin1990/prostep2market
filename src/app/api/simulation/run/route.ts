// Simulation Run API
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStrategyById } from '@/lib/strategy-lab/builder';
import { runSimulation, simulateSession, optimizeRR, simulateWithBehavioralRules } from '@/lib/strategy-lab/simulation';
import { generateSampleCandles } from '@/lib/strategy-lab/session-filters';
import { BehaviorRule } from '@/types/strategy-lab';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { 
      strategyId, 
      pair = 'EURUSD', 
      startDate, 
      endDate, 
      sessionFilter = [],
      behaviorRules = [],
      initialBalance = 10000,
    } = body;

    if (!strategyId) {
      return NextResponse.json(
        { error: 'Strategy ID is required' },
        { status: 400 }
      );
    }

    // Fetch strategy
    const strategy = await getStrategyById(strategyId, user.id);
    
    if (!strategy) {
      return NextResponse.json(
        { error: 'Strategy not found' },
        { status: 404 }
      );
    }

    // Generate sample candle data (30 days)
    const candles = generateSampleCandles(30, 1.1000, 3600000);
    
    // Run main simulation with session filter
    const simulationResult = simulateSession(
      candles,
      sessionFilter,
      {
        entryRules: strategy.entryRules,
        exitRules: strategy.exitRules,
        riskRules: strategy.riskRules,
        initialBalance,
      }
    );

    // Run RR optimization
    const rrOptimization = optimizeRR(
      candles,
      strategy.entryRules,
      strategy.riskRules,
      { min: 1, max: 4, step: 0.5 }
    ).slice(0, 5); // Top 5 results

    // Run behavioral comparison if rules provided
    let behavioralComparison = null;
    if (behaviorRules.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const config: any = {
        entryRules: strategy.entryRules,
        exitRules: strategy.exitRules,
        riskRules: strategy.riskRules,
        initialBalance,
      };
      behavioralComparison = simulateWithBehavioralRules(candles, behaviorRules, config);
    }

    // Save simulation results to database
    const { data: savedResult, error: saveError } = await supabase
      .from('simulation_results')
      .insert({
        user_id: user.id,
        strategy_id: strategyId,
        parameters: {
          pair,
          startDate,
          endDate,
          sessionFilter,
          behaviorRules,
          initialBalance,
        },
        results: {
          metrics: simulationResult.metrics,
          trades: simulationResult.trades,
          rrOptimization: rrOptimization.map(r => ({
            rr: r.rr,
            totalTrades: r.metrics.totalTrades,
            winRate: r.metrics.winRate,
            totalPnl: r.metrics.totalPnl,
          })),
          behavioralComparison: behavioralComparison ? {
            original: behavioralComparison.original,
            withRules: behavioralComparison.withRules,
            impact: behavioralComparison.impact,
          } : null,
        },
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving simulation:', saveError);
    }

    return NextResponse.json({
      simulationId: savedResult?.id || `sim-${Date.now()}`,
      metrics: simulationResult.metrics,
      rrOptimization,
      behavioralComparison,
    });
  } catch (error) {
    console.error('Error running simulation:', error);
    return NextResponse.json(
      { error: 'Failed to run simulation' },
      { status: 500 }
    );
  }
}