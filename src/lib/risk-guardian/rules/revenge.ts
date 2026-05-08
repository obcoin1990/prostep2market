import { Alert, AlertType, Severity, DetectionInput } from '../../../types/guardian';

/**
 * GRDN-02: Revenge Trading Detection
 * Triggers when 3+ trades within 30 min after 2+ consecutive losses
 */
export function detectRevengeTrading(input: DetectionInput): Alert | null {
  const { recentTrades, userId, settings } = input;

  if (!settings.revengeTradingAlertEnabled) {
    return null;
  }

  // Sort trades by entry time, newest first
  const sortedTrades = [...recentTrades].sort(
    (a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime()
  );

  // Find 2+ consecutive losses
  let consecutiveLosses: number[] = [];
  
  for (let i = 0; i < sortedTrades.length - 1; i++) {
    const currentTrade = sortedTrades[i];
    const nextTrade = sortedTrades[i + 1];
    
    if (currentTrade.result === 'loss' && nextTrade.result === 'loss') {
      // Found 2 consecutive losses
      consecutiveLosses = [i, i + 1];
      break;
    }
  }

  if (consecutiveLosses.length < 2) {
    return null;
  }

  // Get the timestamp of the last consecutive loss
  const lastLossIndex = consecutiveLosses[0];
  const lastLossTime = new Date(sortedTrades[lastLossIndex].entryTime);

  // Look for 3+ trades within 30 minutes after the last consecutive loss
  const thirtyMinutesAgo = new Date(lastLossTime.getTime() - 30 * 60 * 1000);
  
  const followUpTrades = sortedTrades.filter(trade => {
    const tradeTime = new Date(trade.entryTime);
    return tradeTime > lastLossTime && tradeTime.getTime() <= lastLossTime.getTime() + 30 * 60 * 1000;
  });

  if (followUpTrades.length >= 3) {
    return {
      id: crypto.randomUUID(),
      userId,
      type: 'revenge_trading' as AlertType,
      severity: 'critical' as Severity,
      title: 'Revenge Trading Detected',
      message: `You placed ${followUpTrades.length} trades within 30 minutes after 2 consecutive losses. This pattern often leads to emotional trading.`,
      suggestedAction: 'Take a 15-minute break before continuing.',
      triggeredAt: new Date(),
      tradeIds: followUpTrades.map(t => t.id),
      acknowledged: false
    };
  }

  return null;
}