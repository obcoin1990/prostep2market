import { differenceInMinutes } from 'date-fns';

export interface ImpulsiveResult {
  detected: boolean;
  count: number;
  triggers: string[];
  tradeIds: string[];
}

export interface ImpulsiveConfig {
  maxHoldMinutes: number;
  minVolatilityThreshold: number;
}

const DEFAULT_CONFIG: ImpulsiveConfig = {
  maxHoldMinutes: 5,
  minVolatilityThreshold: 3,
};

/**
 * Detects impulsive trades.
 * Criteria: <5 min hold during high volatility, or entry during news events.
 * Uses stress score and emotional state as proxies for volatility/news triggers.
 */
export function detectImpulsiveTrades(
  trades: Trade[],
  config: Partial<ImpulsiveConfig> = {}
): ImpulsiveResult {
  if (trades.length < 3) {
    return { detected: false, count: 0, triggers: [], tradeIds: [] };
  }

  const cfg = { ...DEFAULT_CONFIG, ...config };
  const triggers: string[] = [];
  const tradeIds: string[] = [];
  let count = 0;

  for (const trade of trades) {
    const holdMinutes =
      trade.exitTime && trade.entryTime
        ? differenceInMinutes(
            new Date(trade.exitTime),
            new Date(trade.entryTime)
          )
        : null;

    const isShortHold = holdMinutes !== null && holdMinutes <= cfg.maxHoldMinutes;
    const isHighStress =
      (trade.stressScore || 0) >= cfg.minVolatilityThreshold;
    const isEmotional =
      trade.emotionalState &&
      ['fear', 'greed', 'frustration', 'excitement'].includes(
        trade.emotionalState.toLowerCase()
      );
    const hasNewsTrigger =
      trade.triggers && trade.triggers.some((t) =>
        ['news', 'economic', 'nfp', 'cpi', 'fomc'].includes(t.toLowerCase())
      );

    if (isShortHold && (isHighStress || isEmotional)) {
      count++;
      tradeIds.push(trade.id);

      if (isHighStress) triggers.push(`High stress (${trade.stressScore}/5)`);
      if (isEmotional) triggers.push(`Emotional state: ${trade.emotionalState}`);
      if (hasNewsTrigger) triggers.push('News event triggered');
    } else if (hasNewsTrigger && isShortHold === false) {
      // News event entry even if not short hold
      triggers.push('News event entry without short hold');
    }
  }

  return {
    detected: count >= 3,
    count,
    triggers: [...new Set(triggers)],
    tradeIds,
  };
}

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
