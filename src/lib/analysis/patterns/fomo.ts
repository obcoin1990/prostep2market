export interface FomoResult {
  detected: boolean;
  evidence: string[];
  tradeIds: string[];
  count: number;
}

export interface FomoConfig {
  highVolatilityThreshold: number;
  minPrePlanAdherence: number;
}

const DEFAULT_CONFIG: FomoConfig = {
  highVolatilityThreshold: 3,
  minPrePlanAdherence: 3,
};

/**
 * Detects FOMO trades.
 * Criteria: high volatility entry (high stress/emotional state) without pre-trade plan adherence.
 */
export function detectFomo(
  trades: Trade[],
  config: Partial<FomoConfig> = {}
): FomoResult {
  if (trades.length < 3) {
    return { detected: false, evidence: [], tradeIds: [], count: 0 };
  }

  const cfg = { ...DEFAULT_CONFIG, ...config };
  const evidence: string[] = [];
  const tradeIds: string[] = [];
  let count = 0;

  for (const trade of trades) {
    const isHighVolatility =
      (trade.stressScore || 0) >= cfg.highVolatilityThreshold ||
      (trade.confidenceScore || 0) <= 2;
    const hasLowAdherence =
      (trade.preTradePlanAdherence || 5) < cfg.minPrePlanAdherence;
    const hasFomoTriggers =
      trade.triggers &&
      trade.triggers.some((t) =>
        ['breakout', 'chasing', 'missed', 'gap'].includes(t.toLowerCase())
      );
    const isEmotional =
      trade.emotionalState &&
      ['greed', 'excitement', 'fear of missing'].includes(
        trade.emotionalState.toLowerCase()
      );

    if (
      isHighVolatility &&
      (hasLowAdherence || hasFomoTriggers || isEmotional)
    ) {
      count++;
      tradeIds.push(trade.id);

      if (hasLowAdherence)
        evidence.push(
          `Low plan adherence (${trade.preTradePlanAdherence}/5) during volatility`
        );
      if (hasFomoTriggers)
        evidence.push('FOMO trigger keywords detected (breakout/chasing)');
      if (isEmotional)
        evidence.push(`Emotional state: ${trade.emotionalState}`);
    }
  }

  return {
    detected: count >= 3,
    evidence,
    tradeIds: [...new Set(tradeIds)],
    count,
  };
}

interface Trade {
  id: string;
  stressScore?: number;
  confidenceScore?: number;
  preTradePlanAdherence?: number;
  triggers?: string[];
  emotionalState?: string;
}
