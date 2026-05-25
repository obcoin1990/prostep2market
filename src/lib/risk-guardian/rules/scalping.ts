import { Alert, AlertType, Severity, DetectionInput } from '../../../types/guardian';

/**
 * GRDN-08 — Abusive Scalping Detection
 *
 * Flags accounts that repeatedly open and close trades in under
 * `scalpingMinDurationSeconds` seconds. When the count of such trades today
 * exceeds `scalpingMaxTradesPerDay`, a critical alert is raised.
 */
export function detectAbusiveScalping(input: DetectionInput): Alert | null {
  const { recentTrades, settings, userId } = input;

  if (!settings.scalpingEnabled) return null;

  const minDurationMs = settings.scalpingMinDurationSeconds * 1_000;

  // Only consider closed trades (exitTime present)
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const scalpTrades = recentTrades.filter((t) => {
    if (!t.exitTime) return false;                    // open trade — skip
    const entryMs = new Date(t.entryTime).getTime();
    const exitMs  = new Date(t.exitTime).getTime();
    const durationMs = exitMs - entryMs;
    if (durationMs < 0) return false;                 // data anomaly
    if (durationMs >= minDurationMs) return false;    // not a scalp
    // Within today (rolling 24 h window so 24-hour check works on serverless)
    return entryMs >= startOfDay.getTime();
  });

  if (scalpTrades.length <= settings.scalpingMaxTradesPerDay) {
    return null;
  }

  const avgDurationSec = Math.round(
    scalpTrades.reduce((sum, t) => {
      const dur = new Date(t.exitTime!).getTime() - new Date(t.entryTime).getTime();
      return sum + dur;
    }, 0) /
      scalpTrades.length /
      1_000
  );

  return {
    id: crypto.randomUUID(),
    userId,
    type: 'abusive_scalping' as AlertType,
    severity: 'critical' as Severity,
    title: 'High-frequency scalping behavior',
    message:
      `${scalpTrades.length} trades closed in under ` +
      `${settings.scalpingMinDurationSeconds}s today ` +
      `(avg ${avgDurationSec}s). Threshold: ${settings.scalpingMaxTradesPerDay}.`,
    suggestedAction:
      'Review your trade plan. Extremely short-duration trades may violate prop firm rules.',
    triggeredAt: now,
    tradeIds: scalpTrades.map((t) => t.id),
    acknowledged: false,
  };
}
