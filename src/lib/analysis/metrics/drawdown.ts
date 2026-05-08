import type { DrawdownProfile, Trade } from '@/types/analysis';

export interface DrawdownEpisode {
  startDate: Date;
  troughDate: Date;
  recoveryDate: Date | null;
  depth: number; // Percentage
  duration: number; // Days to trough
  recoveryDuration: number; // Days to recover
}

export interface DrawdownResult {
  profile: DrawdownProfile;
  episodes: DrawdownEpisode[];
}

/**
 * Calculates drawdown profile from trade sequence.
 * Builds equity curve, finds max drawdown, tracks recovery patterns.
 */
export function calculateDrawdown(trades: Trade[]): DrawdownResult {
  if (trades.length < 2) {
    return {
      profile: {
        maxDrawdown: 0,
        maxDrawdownDuration: 0,
        avgRecoveryDays: 0,
        recoveryPattern: 'normal',
      },
      episodes: [],
    };
  }

  const sortedTrades = [...trades].sort(
    (a, b) => new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
  );

  // Build equity curve (assume starting balance of 10000)
  let equity = 10000;
  const equityCurve: { date: Date; value: number }[] = [];

  for (const trade of sortedTrades) {
    equity += trade.pnl;
    equityCurve.push({
      date: new Date(trade.entryTime),
      value: equity,
    });
  }

  // Calculate max drawdown and track episodes
  let peak = equityCurve[0].value;
  let maxDrawdown = 0;
  const episodes: DrawdownEpisode[] = [];
  let currentEpisode: Partial<DrawdownEpisode> | null = null;

  for (let i = 0; i < equityCurve.length; i++) {
    const point = equityCurve[i];

    if (point.value > peak) {
      // New peak - end any ongoing drawdown
      if (currentEpisode && currentEpisode.troughDate) {
        currentEpisode.recoveryDate = point.date;
        currentEpisode.recoveryDuration = Math.floor(
          (point.date.getTime() - currentEpisode.troughDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        episodes.push(currentEpisode as DrawdownEpisode);
      }
      peak = point.value;
      currentEpisode = null;
    } else {
      // Below peak - potential drawdown
      const drawdown = ((peak - point.value) / peak) * 100;

      if (drawdown > Math.abs(maxDrawdown)) {
        maxDrawdown = -drawdown;
      }

      if (!currentEpisode || !currentEpisode.troughDate) {
        const startPoint = equityCurve.find((p) => p.value === peak);
        const startDate = startPoint?.date || point.date;
        currentEpisode = {
          startDate: startDate,
          troughDate: point.date,
          depth: drawdown,
          duration: Math.floor(
            (point.date.getTime() - startDate.getTime()) /
              (1000 * 60 * 60 * 24)
          ),
        };
      }
    }
  }

  // Calculate recovery pattern
  const recoveryDays = episodes
    .map((e) => e.recoveryDuration || 0)
    .filter((d) => d > 0);
  const avgRecovery =
    recoveryDays.length > 0
      ? recoveryDays.reduce((a, b) => a + b, 0) / recoveryDays.length
      : 0;

  let recoveryPattern: DrawdownProfile['recoveryPattern'];
  if (avgRecovery > 30) recoveryPattern = 'slow';
  else if (avgRecovery > 7) recoveryPattern = 'normal';
  else recoveryPattern = 'fast';

  return {
    profile: {
      maxDrawdown: Math.round(maxDrawdown * 100) / 100,
      maxDrawdownDuration: Math.max(...episodes.map((e) => e.duration), 0),
      avgRecoveryDays: Math.round(avgRecovery),
      recoveryPattern,
    },
    episodes,
  };
}
