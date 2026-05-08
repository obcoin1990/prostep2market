import type { PairStats, Trade } from '@/types/analysis';

/**
 * Calculates performance by trading pair (symbol).
 */
export function calculatePairPerformance(trades: Trade[]): Record<string, PairStats> {
  if (trades.length === 0) return {};

  const pairStats: Record<
    string,
    {
      wins: number;
      total: number;
      totalRR: number;
      totalPnl: number;
      sessions: Record<string, number>;
    }
  > = {};

  for (const trade of trades) {
    const symbol = trade.symbol;
    if (!pairStats[symbol]) {
      pairStats[symbol] = {
        wins: 0,
        total: 0,
        totalRR: 0,
        totalPnl: 0,
        sessions: {},
      };
    }

    const stats = pairStats[symbol];
    stats.total++;
    stats.totalPnl += trade.pnl;

    if (trade.result === 'win') {
      stats.wins++;
    }

    // Track best session for this pair
    const session = trade.session || 'unknown';
    stats.sessions[session] = (stats.sessions[session] || 0) + 1;
  }

  const result: Record<string, PairStats> = {};

  for (const [symbol, stats] of Object.entries(pairStats)) {
    // Find best session for this pair
    let bestSession = 'unknown';
    let maxSessionTrades = 0;
    for (const [session, count] of Object.entries(stats.sessions)) {
      if (count > maxSessionTrades) {
        maxSessionTrades = count;
        bestSession = session;
      }
    }

    result[symbol] = {
      symbol,
      winRate: stats.total > 0 ? (stats.wins / stats.total) * 100 : 0,
      avgRR: stats.total > 0 ? stats.totalRR / stats.total : 0,
      totalTrades: stats.total,
      totalPnl: stats.totalPnl,
      bestSession,
    };
  }

  return result;
}

/**
 * Returns pairs sorted by win rate (descending).
 */
export function getTopPairs(
  pairStats: Record<string, PairStats>,
  limit = 5
): PairStats[] {
  return Object.values(pairStats)
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, limit);
}

/**
 * Returns pairs sorted by total PnL (descending).
 */
export function getMostProfitablePairs(
  pairStats: Record<string, PairStats>,
  limit = 5
): PairStats[] {
  return Object.values(pairStats)
    .sort((a, b) => b.totalPnl - a.totalPnl)
    .slice(0, limit);
}
