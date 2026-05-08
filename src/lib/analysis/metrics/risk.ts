import type { ExposureSnapshot, Trade } from '@/types/analysis';

/**
 * Calculates lot size variance as standard deviation from mean.
 * Returns percentage variance (stdDev / mean * 100).
 */
export function calculateLotSizeVariance(trades: Trade[]): number {
  if (trades.length < 2) return 0;

  const lots = trades.map((t) => t.lotSize);
  const mean = lots.reduce((a, b) => a + b, 0) / lots.length;

  if (mean === 0) return 0;

  const squaredDiffs = lots.map((l) => Math.pow(l - mean, 2));
  const variance =
    squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
  const stdDev = Math.sqrt(variance);

  return Math.round((stdDev / mean) * 10000) / 100; // Return as percentage
}

/**
 * Calculates exposure profile from trades.
 * Tracks concurrent positions and session exposure.
 */
export function calculateExposureProfile(trades: Trade[]): ExposureSnapshot {
  if (trades.length === 0) {
    return {
      maxConcurrentPositions: 0,
      avgHoldingPeriod: 0,
      sessionExposure: {},
    };
  }

  // Sort trades by entry time
  const sortedTrades = [...trades].sort(
    (a, b) => new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
  );

  // Calculate max concurrent positions (simplified - assumes non-overlapping if different symbols)
  const symbols = new Set(sortedTrades.map((t) => t.symbol));
  const maxConcurrent = Math.min(symbols.size, sortedTrades.length);

  // Calculate average holding period in hours
  let totalHoldingHours = 0;
  let tradesWithExit = 0;

  for (const trade of sortedTrades) {
    if (trade.exitTime && trade.entryTime) {
      const entryMs = new Date(trade.entryTime).getTime();
      const exitMs = new Date(trade.exitTime).getTime();
      const hours = (exitMs - entryMs) / (1000 * 60 * 60);
      totalHoldingHours += hours;
      tradesWithExit++;
    }
  }

  const avgHoldingPeriod =
    tradesWithExit > 0 ? totalHoldingHours / tradesWithExit : 0;

  // Calculate session exposure (time spent per session)
  const sessionExposure: Record<string, number> = {
    asian: 0,
    london: 0,
    newyork: 0,
    sydney: 0,
  };

  for (const trade of sortedTrades) {
    const session = trade.session || 'unknown';
    if (sessionExposure[session] !== undefined) {
      sessionExposure[session]++;
    }
  }

  return {
    maxConcurrentPositions: maxConcurrent,
    avgHoldingPeriod: Math.round(avgHoldingPeriod * 10) / 10,
    sessionExposure,
  };
}

/**
 * Counts margin pressure events (large lot sizes relative to account).
 * Currently uses lot size variance as proxy - high variance suggests position sizing issues.
 */
export function calculateMarginPressureEvents(trades: Trade[]): number {
  if (trades.length < 5) return 0;

  const lots = trades.map((t) => t.lotSize);
  const mean = lots.reduce((a, b) => a + b, 0) / lots.length;
  const threshold = mean * 2; // 2x average is considered high

  let events = 0;
  for (const lot of lots) {
    if (lot > threshold) events++;
  }

  return events;
}
