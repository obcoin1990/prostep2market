export interface OverconfidenceResult {
  detected: boolean;
  evidence: string[];
  tradeIds: string[];
  consecutiveWins: number;
  avgWinStreak: number;
}

export interface OverconfidenceConfig {
  minConsecutiveWins: number;
  minLotIncreasePercent: number;
}

const DEFAULT_CONFIG: OverconfidenceConfig = {
  minConsecutiveWins: 5,
  minLotIncreasePercent: 30,
};

/**
 * Detects overconfidence pattern.
 * Criteria: 5+ consecutive wins followed by lot size increase >30%.
 */
export function detectOverconfidence(
  trades: Trade[],
  config: Partial<OverconfidenceConfig> = {}
): OverconfidenceResult {
  if (trades.length < 6) {
    return {
      detected: false,
      evidence: [],
      tradeIds: [],
      consecutiveWins: 0,
      avgWinStreak: 0,
    };
  }

  const cfg = { ...DEFAULT_CONFIG, ...config };
  const sortedTrades = [...trades].sort(
    (a, b) => new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
  );

  const evidence: string[] = [];
  const tradeIds: string[] = [];
  let maxStreak = 0;
  let currentStreak = 0;
  const streaks: number[] = [];

  for (let i = 0; i < sortedTrades.length; i++) {
    if (sortedTrades[i].pnl > 0) {
      currentStreak++;
    } else {
      if (currentStreak > 0) streaks.push(currentStreak);
      currentStreak = 0;
    }
  }
  if (currentStreak > 0) streaks.push(currentStreak);
  maxStreak = Math.max(...streaks, 0);

  // Check for lot size increase after win streak
  for (let i = cfg.minConsecutiveWins - 1; i < sortedTrades.length; i++) {
    const windowTrades = sortedTrades.slice(
      i - cfg.minConsecutiveWins + 1,
      i + 1
    );
    const allWins = windowTrades.every((t) => t.pnl > 0);

    if (!allWins) continue;

    const avgLotBefore = windowTrades
      .slice(0, cfg.minConsecutiveWins - 1)
      .reduce((sum, t) => sum + t.lotSize, 0) / (cfg.minConsecutiveWins - 1);
    const lotAfter = windowTrades[cfg.minConsecutiveWins - 1].lotSize;
    const increasePercent = ((lotAfter - avgLotBefore) / avgLotBefore) * 100;

    if (increasePercent >= cfg.minLotIncreasePercent) {
      evidence.push(
        `${cfg.minConsecutiveWins}+ consecutive wins detected`,
        `Lot size increased ${increasePercent.toFixed(0)}% after win streak`,
        `Average lot before: ${avgLotBefore.toFixed(2)}, after: ${lotAfter.toFixed(2)}`
      );
      tradeIds.push(...windowTrades.map((t) => t.id));
    }
  }

  const avgWinStreak =
    streaks.length > 0 ? streaks.reduce((a, b) => a + b, 0) / streaks.length : 0;

  return {
    detected: evidence.length > 0,
    evidence,
    tradeIds: [...new Set(tradeIds)],
    consecutiveWins: maxStreak,
    avgWinStreak,
  };
}

interface Trade {
  id: string;
  symbol: string;
  lotSize: number;
  entryTime: string | Date;
  exitTime?: string | Date;
  session: 'asian' | 'london' | 'newyork' | 'sydney';
  pnl: number;
}
