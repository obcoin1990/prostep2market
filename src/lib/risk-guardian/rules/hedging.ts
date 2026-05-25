import { Alert, AlertType, Severity, DetectionInput } from '../../../types/guardian';

/**
 * GRDN-10 — Hedging Behavior Detection
 *
 * Detects when a trader opens opposing positions on the same symbol within a
 * short time window with similar lot sizes — a common pattern in external
 * (forbidden) hedging strategies.
 *
 * Direction is inferred from stop-loss / take-profit relative to entry price:
 *   • takeProfit > entryPrice  → LONG
 *   • takeProfit < entryPrice  → SHORT
 * When take-profit is absent the stop-loss is used:
 *   • stopLoss < entryPrice    → LONG
 *   • stopLoss > entryPrice    → SHORT
 * Trades with no price info are excluded from the check.
 */
type Direction = 'long' | 'short' | 'unknown';

function inferDirection(t: {
  entryPrice?: number;
  takeProfit?: number;
  stopLoss?: number;
}): Direction {
  if (t.entryPrice == null) return 'unknown';

  if (t.takeProfit != null) {
    if (t.takeProfit > t.entryPrice) return 'long';
    if (t.takeProfit < t.entryPrice) return 'short';
  }
  if (t.stopLoss != null) {
    if (t.stopLoss < t.entryPrice) return 'long';
    if (t.stopLoss > t.entryPrice) return 'short';
  }
  return 'unknown';
}

export function detectHedgingBehavior(input: DetectionInput): Alert | null {
  const { recentTrades, settings, userId } = input;

  if (!settings.hedgingEnabled) return null;
  if (recentTrades.length < 2) return null;

  const windowMs    = settings.hedgingTimeWindowSeconds * 1_000;
  const tolerance   = settings.hedgingLotSizeTolerance; // e.g. 0.10 = 10%

  // Group by symbol
  const bySymbol: Record<string, typeof recentTrades> = {};
  for (const t of recentTrades) {
    const sym = (t.symbol ?? '').toUpperCase();
    if (!sym) continue;
    bySymbol[sym] = bySymbol[sym] ?? [];
    bySymbol[sym].push(t);
  }

  const flaggedTradeIds: string[] = [];
  const hedgePairs: Array<{ symbol: string; lotSizeDiff: number; windowSeconds: number }> = [];

  for (const [symbol, trades] of Object.entries(bySymbol)) {
    if (trades.length < 2) continue;

    // Sort ASC by entry time for the sliding window scan
    const sorted = [...trades].sort(
      (a, b) => new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
    );

    for (let i = 0; i < sorted.length; i++) {
      const anchor = sorted[i];
      const anchorDir = inferDirection(anchor);
      const anchorTime = new Date(anchor.entryTime).getTime();

      for (let j = i + 1; j < sorted.length; j++) {
        const candidate = sorted[j];
        const candidateTime = new Date(candidate.entryTime).getTime();
        const gap = candidateTime - anchorTime;

        if (gap > windowMs) break; // sorted, so no further trades can qualify

        const candidateDir = inferDirection(candidate);

        // Must be opposing directions (or at least one unknown — still suspicious)
        const opposing =
          (anchorDir === 'long' && candidateDir === 'short') ||
          (anchorDir === 'short' && candidateDir === 'long') ||
          anchorDir === 'unknown' ||
          candidateDir === 'unknown';

        if (!opposing) continue;

        // Similar lot size
        const lotDiff = Math.abs(anchor.lotSize - candidate.lotSize);
        const maxLot  = Math.max(anchor.lotSize, candidate.lotSize);
        if (maxLot === 0) continue;
        const relDiff = lotDiff / maxLot;

        if (relDiff > tolerance) continue;

        // Hedge pair found
        flaggedTradeIds.push(anchor.id, candidate.id);
        hedgePairs.push({
          symbol,
          lotSizeDiff: parseFloat(relDiff.toFixed(4)),
          windowSeconds: Math.round(gap / 1_000),
        });
      }
    }
  }

  if (hedgePairs.length === 0) return null;

  const uniqueTradeIds = [...new Set(flaggedTradeIds)];
  const uniqueSymbols  = [...new Set(hedgePairs.map((p) => p.symbol))].join(', ');

  return {
    id: crypto.randomUUID(),
    userId,
    type: 'hedging_behavior' as AlertType,
    severity: 'critical' as Severity,
    title: 'Hedging behavior detected (possible external hedging)',
    message:
      `${hedgePairs.length} opposing-position pair(s) detected on ${uniqueSymbols} ` +
      `within ${settings.hedgingTimeWindowSeconds}s with similar lot sizes ` +
      `(tolerance ${(tolerance * 100).toFixed(0)}%).`,
    suggestedAction:
      'External hedging is prohibited on most prop-firm accounts. This account has been flagged for review.',
    triggeredAt: new Date(),
    tradeIds: uniqueTradeIds,
    acknowledged: false,
  };
}
