import type { BehavioralPatterns, Trade } from '@/types/analysis';
import { detectRevengeTrading } from './revenge';
import { detectImpulsiveTrades } from './impulsive';
import { detectOverconfidence } from './overconfidence';
import { detectFomo } from './fomo';
import { detectOvertrading } from './overtrading';

/**
 * Detects all behavioral patterns from a set of trades.
 * Orchestrates all individual pattern detectors and aggregates results.
 */
export function detectPatterns(trades: Trade[]): BehavioralPatterns {
  if (trades.length < 3) {
    return {
      revengeTrading: { detected: false, severity: 'low', evidence: [], tradeIds: [] },
      impulsiveTrades: { detected: false, count: 0, triggers: [] },
      overconfidence: { detected: false, evidence: [] },
      fearExits: { detected: false, instances: [] },
      overtrading: { detected: false, sessionCount: 0 },
      fomo: { detected: false, evidence: [] },
    };
  }

  const revengeResult = detectRevengeTrading(trades);
  const impulsiveResult = detectImpulsiveTrades(trades);
  const overconfidenceResult = detectOverconfidence(trades);
  const fomoResult = detectFomo(trades);
  const overtradingResult = detectOvertrading(trades);

  // Fear exits: premature exits within 20% of TP while profitable
  const fearExitTrades = detectFearExits(trades);

  return {
    revengeTrading: {
      detected: revengeResult.detected,
      severity: revengeResult.severity,
      evidence: revengeResult.evidence,
      tradeIds: revengeResult.tradeIds,
    },
    impulsiveTrades: {
      detected: impulsiveResult.detected,
      count: impulsiveResult.count,
      triggers: impulsiveResult.triggers,
    },
    overconfidence: {
      detected: overconfidenceResult.detected,
      evidence: overconfidenceResult.evidence,
    },
    fearExits: {
      detected: fearExitTrades.detected,
      instances: fearExitTrades.instances,
    },
    overtrading: {
      detected: overtradingResult.detected,
      sessionCount: overtradingResult.sessionCount,
    },
    fomo: {
      detected: fomoResult.detected,
      evidence: fomoResult.evidence,
    },
  };
}

/**
 * Detects fear exits (premature exits within 20% of TP while profitable).
 */
function detectFearExits(
  trades: Trade[]
): { detected: boolean; instances: string[] } {
  const instances: string[] = [];

  for (const trade of trades) {
    if (
      trade.result === 'win' &&
      trade.pnl > 0 &&
      trade.takeProfit &&
      trade.exitPrice
    ) {
      // Calculate how close to TP the exit was
      const tpDistance = Math.abs(trade.takeProfit - trade.entryPrice);
      const actualDistance = Math.abs(trade.exitPrice - trade.entryPrice);
      const tpProximity = actualDistance / tpDistance;

      // If exited within 20% of TP, might be fear exit
      if (tpProximity >= 0.8 && tpProximity < 1.0) {
        instances.push(
          `Trade ${trade.id}: Exited at ${(tpProximity * 100).toFixed(0)}% of TP (${trade.symbol})`
        );
      }
    }
  }

  return {
    detected: instances.length >= 2,
    instances,
  };
}
