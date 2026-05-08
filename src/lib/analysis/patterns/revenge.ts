import { differenceInMinutes } from 'date-fns';

export interface PatternResult {
  detected: boolean;
  severity: 'low' | 'medium' | 'high';
  evidence: string[];
  tradeIds: string[];
  estimatedCost: number;
}

export interface RevengeConfig {
  windowMinutes: number;
  minConsecutiveLosses: number;
  minTradesAfterLoss: number;
  positionMultiplier: number;
}

const DEFAULT_CONFIG: RevengeConfig = {
  windowMinutes: 10,
  minConsecutiveLosses: 2,
  minTradesAfterLoss: 3,
  positionMultiplier: 1.5,
};

/**
 * Detects revenge trading patterns.
 * Criteria: 3+ trades after 2 consecutive losses within same session,
 * with position size increase >= 1.5x within 10 min of loss.
 */
export function detectRevengeTrading(
  trades: Trade[],
  config: Partial<RevengeConfig> = {}
): PatternResult {
  if (trades.length < 5) {
    return { detected: false, severity: 'low', evidence: [], tradeIds: [], estimatedCost: 0 };
  }

  const cfg = { ...DEFAULT_CONFIG, ...config };
  const sortedTrades = [...trades].sort(
    (a, b) => new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
  );

  const evidence: string[] = [];
  const tradeIds: string[] = [];
  let totalCost = 0;

  for (let i = cfg.minConsecutiveLosses; i < sortedTrades.length; i++) {
    const current = sortedTrades[i];
    const prevLosses = [sortedTrades[i - 1], sortedTrades[i - 2]];

    // Check if previous trades were losses
    const allLosses = prevLosses.every((t) => t.pnl < 0);
    if (!allLosses) continue;

    // Check session match
    const sessionMatch = prevLosses.every(
      (t) => t.session === current.session
    );
    if (!sessionMatch) continue;

    // Check time window from last loss
    const lastLoss = prevLosses[0];
    if (!lastLoss.exitTime) continue;
    const minutesSinceLoss = differenceInMinutes(
      new Date(current.entryTime),
      new Date(lastLoss.exitTime)
    );

    if (minutesSinceLoss > cfg.windowMinutes) continue;

    // Check position size increase
    const avgLossSize = Math.abs(
      prevLosses.reduce((sum, t) => sum + t.pnl, 0) / prevLosses.length
    );
    const sizeRatio = current.lotSize / lastLoss.lotSize;

    if (sizeRatio >= cfg.positionMultiplier) {
      const severity =
        sizeRatio >= 2.0
          ? 'high'
          : sizeRatio >= 1.5
          ? 'medium'
          : 'low';

      evidence.push(
        `Entry ${minutesSinceLoss} min after consecutive losses (${prevLosses.length} trades)`,
        `Position size increased ${((sizeRatio - 1) * 100).toFixed(0)}%`,
        `Session: ${current.session}`
      );
      tradeIds.push(current.id, ...prevLosses.map((t) => t.id));
      totalCost += Math.abs(lastLoss.pnl);
    }
  }

  // Require minimum trades for pattern confirmation
  const detected =
    evidence.length >= 2 || tradeIds.length >= cfg.minTradesAfterLoss;

  return {
    detected,
    severity: detected ? 'medium' : 'low',
    evidence,
    tradeIds: [...new Set(tradeIds)],
    estimatedCost: totalCost,
  };
}

// Trade type for internal use (matches Phase 3 schema)
interface Trade {
  id: string;
  userId?: string;
  symbol: string;
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  lotSize: number;
  entryTime: string | Date;
  exitTime?: string | Date;
  session: 'asian' | 'london' | 'newyork' | 'sydney';
  result?: 'win' | 'loss' | 'breakeven';
  pnl: number;
  confidenceScore?: number;
  stressScore?: number;
  emotionalState?: string;
  triggers?: string[];
  preTradePlanAdherence?: number;
  notes?: string;
}
