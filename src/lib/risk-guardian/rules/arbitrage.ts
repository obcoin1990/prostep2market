import { Alert, AlertType, Severity, DetectionInput } from '../../../types/guardian';

/**
 * GRDN-09 — Arbitrage-Like Behavior Detection
 *
 * Identifies accounts that combine:
 *   • Very short average trade duration  (< arbitrageMaxAvgDurationSeconds)
 *   • Very high win rate                 (> arbitrageMinWinRate %)
 *   • Very small profit targets          (realized RR < arbitrageMaxRR)
 *
 * The combination strongly suggests latency-arbitrage or risk-free fill
 * exploitation and should be flagged for manual review.
 *
 * RR is computed as:  avgWin / |avgLoss|
 * When stop-loss / take-profit fields are available on the trade they are used
 * to compute the planned RR instead, which is more accurate.
 */
export function detectArbitrageBehavior(input: DetectionInput): Alert | null {
  const { recentTrades, settings, userId } = input;

  if (!settings.arbitrageEnabled) return null;

  // Need a meaningful sample: at least 5 closed trades
  const closedTrades = recentTrades.filter(
    (t) => t.exitTime && t.result && t.result !== 'breakeven'
  );
  if (closedTrades.length < 5) return null;

  // ── Average duration ───────────────────────────────────────────────────────
  const durations = closedTrades.map((t) => {
    const entry = new Date(t.entryTime).getTime();
    const exit  = new Date(t.exitTime!).getTime();
    return Math.max(0, exit - entry); // ms
  });
  const avgDurationMs = durations.reduce((a, b) => a + b, 0) / durations.length;
  const avgDurationSec = avgDurationMs / 1_000;

  if (avgDurationSec >= settings.arbitrageMaxAvgDurationSeconds) return null;

  // ── Win rate ───────────────────────────────────────────────────────────────
  const wins   = closedTrades.filter((t) => t.result === 'win');
  const losses = closedTrades.filter((t) => t.result === 'loss');
  const winRate = (wins.length / closedTrades.length) * 100;

  if (winRate < settings.arbitrageMinWinRate) return null;

  // ── Risk-Reward Ratio ──────────────────────────────────────────────────────
  // Prefer planned RR from SL/TP when available; fall back to realised RR.
  let rr: number;

  const tradesWithPlan = closedTrades.filter(
    (t) => t.entryPrice != null && t.stopLoss != null && t.takeProfit != null
  );

  if (tradesWithPlan.length >= 3) {
    // Planned RR: (|TP - entry|) / (|SL - entry|)
    const rrValues = tradesWithPlan
      .map((t) => {
        const reward = Math.abs(t.takeProfit! - t.entryPrice!);
        const risk   = Math.abs(t.stopLoss!  - t.entryPrice!);
        return risk > 0 ? reward / risk : 0;
      })
      .filter((v) => v > 0);
    rr = rrValues.length > 0
      ? rrValues.reduce((a, b) => a + b, 0) / rrValues.length
      : 0;
  } else {
    // Realised RR: avgWin / |avgLoss|
    const avgWin  = wins.length  > 0 ? wins.reduce((s, t)  => s + (t.pnl ?? 0), 0) / wins.length  : 0;
    const avgLoss = losses.length > 0 ? losses.reduce((s, t) => s + (t.pnl ?? 0), 0) / losses.length : 0;
    rr = avgLoss < 0 ? avgWin / Math.abs(avgLoss) : 0;
  }

  if (rr === 0 || rr >= settings.arbitrageMaxRR) return null;

  return {
    id: crypto.randomUUID(),
    userId,
    type: 'arbitrage_behavior' as AlertType,
    severity: 'critical' as Severity,
    title: 'Arbitrage-like trading behavior',
    message:
      `Pattern detected: avg duration ${Math.round(avgDurationSec)}s, ` +
      `win rate ${winRate.toFixed(1)}%, RR ${rr.toFixed(2)} ` +
      `across ${closedTrades.length} trades. ` +
      `Thresholds: <${settings.arbitrageMaxAvgDurationSeconds}s, ` +
      `>${settings.arbitrageMinWinRate}% WR, RR<${settings.arbitrageMaxRR}.`,
    suggestedAction:
      'This pattern may indicate latency-arbitrage or risk-free fill exploitation. Account flagged for review.',
    triggeredAt: new Date(),
    tradeIds: closedTrades.map((t) => t.id),
    acknowledged: false,
  };
}
