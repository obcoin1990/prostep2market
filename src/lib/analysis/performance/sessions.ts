import type {
  SessionSummary,
  ConditionSummary,
  HeatmapCell,
  Trade,
} from '@/types/analysis';

const SESSIONS = ['asian', 'london', 'newyork', 'sydney'] as const;
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Calculates performance by trading session.
 * Groups trades by session and calculates win rate, avg RR, total PnL.
 */
export function calculateSessionPerformance(
  trades: Trade[]
): SessionSummary[] {
  if (trades.length === 0) return [];

  const sessionStats: Record<
    string,
    { wins: number; total: number; totalRR: number; totalPnl: number }
  > = {};

  for (const session of SESSIONS) {
    sessionStats[session] = { wins: 0, total: 0, totalRR: 0, totalPnl: 0 };
  }

  for (const trade of trades) {
    const session = trade.session || 'unknown';
    if (!sessionStats[session]) {
      sessionStats[session] = { wins: 0, total: 0, totalRR: 0, totalPnl: 0 };
    }

    sessionStats[session].total++;
    sessionStats[session].totalPnl += trade.pnl;

    if (trade.result === 'win') {
      sessionStats[session].wins++;
    }
  }

  const summaries: SessionSummary[] = SESSIONS.map((session, index) => {
    const stats = sessionStats[session];
    return {
      session,
      winRate:
        stats.total > 0 ? (stats.wins / stats.total) * 100 : 0,
      avgRR: stats.total > 0 ? stats.totalRR / stats.total : 0,
      totalTrades: stats.total,
      totalPnl: stats.totalPnl,
      rank: 0, // Will be set after sorting
    };
  });

  // Sort by total PnL descending and assign ranks
  summaries.sort((a, b) => b.totalPnl - a.totalPnl);
  summaries.forEach((s, i) => (s.rank = i + 1));

  return summaries;
}

/**
 * Identifies worst trading conditions.
 * Lowest win rate + negative PnL conditions.
 */
export function identifyWorstConditions(
  trades: Trade[]
): ConditionSummary[] {
  const sessionSummaries = calculateSessionPerformance(trades);

  // Filter to sessions with negative PnL and low win rate
  const worst = sessionSummaries
    .filter((s) => s.totalPnl < 0 && s.winRate < 50)
    .map((s) => ({
      condition: `${s.session} session`,
      winRate: s.winRate,
      avgRR: s.avgRR,
      totalTrades: s.totalTrades,
      totalPnl: s.totalPnl,
    }));

  return worst.sort((a, b) => a.winRate - b.winRate);
}

/**
 * Builds heatmap data for session analytics.
 * Returns 7 days x 4 sessions grid.
 */
export function buildHeatmapData(trades: Trade[]): HeatmapCell[] {
  if (trades.length === 0) return [];

  const cells: Map<string, HeatmapCell> = new Map();

  for (const trade of trades) {
    const entryDate = new Date(trade.entryTime);
    const dayOfWeek = entryDate.getDay();
    const session = trade.session || 'unknown';

    const key = `${dayOfWeek}-${session}`;

    const existing = cells.get(key) || {
      dayOfWeek,
      session: session as HeatmapCell['session'],
      totalTrades: 0,
      totalPnl: 0,
      winRate: 0,
      avgRR: 0,
    };

    existing.totalTrades++;
    existing.totalPnl += trade.pnl;

    // Recalculate win rate
    const wins = trade.result === 'win' ? 1 : 0;
    const prevWins = existing.winRate * (existing.totalTrades - 1);
    existing.winRate =
      existing.totalTrades > 0
        ? ((prevWins + wins) / existing.totalTrades) * 100
        : 0;

    cells.set(key, existing);
  }

  return Array.from(cells.values()).map((cell) => ({
    ...cell,
    winRate: Math.round(cell.winRate * 10) / 10,
    totalPnl: Math.round(cell.totalPnl * 100) / 100,
  }));
}

/**
 * Builds a 7x4 grid from heatmap data for rendering.
 */
export function buildHeatmapGrid(
  data: HeatmapCell[]
): Array<Array<HeatmapCell | null>> {
  const grid: Array<Array<HeatmapCell | null>> = [];

  for (let day = 0; day < 7; day++) {
    const row: Array<HeatmapCell | null> = [];
    for (const session of SESSIONS) {
      const cell = data.find(
        (c) => c.dayOfWeek === day && c.session === session
      );
      row.push(cell || null);
    }
    grid.push(row);
  }

  return grid;
}
