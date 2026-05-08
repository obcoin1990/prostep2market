import { Alert, AlertType, Severity, DetectionInput } from '../../../types/guardian';
import { isWithinInterval } from 'date-fns';

/**
 * Overtrading Detection
 * Triggers on > 8 trades in 4-hour window
 */
export function detectOvertrading(input: DetectionInput): Alert | null {
  const { recentTrades, settings, userId } = input;

  if (recentTrades.length < 2) {
    return null;
  }

  // Sort trades by entry time, newest first
  const sortedTrades = [...recentTrades].sort(
    (a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime()
  );

  const now = new Date();
  const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);

  // Find the window with the most trades
  let maxTradesInWindow = 0;
  
  for (let i = 0; i < sortedTrades.length; i++) {
    const windowStart = new Date(sortedTrades[i].entryTime);
    const windowEnd = new Date(windowStart.getTime() + 4 * 60 * 60 * 1000);
    
    const tradesInWindow = sortedTrades.filter(trade => {
      const tradeTime = new Date(trade.entryTime);
      return tradeTime >= windowStart && tradeTime <= windowEnd;
    });
    
    if (tradesInWindow.length > maxTradesInWindow) {
      maxTradesInWindow = tradesInWindow.length;
    }
  }

  if (maxTradesInWindow > settings.maxTradesPerWindow) {
    return {
      id: crypto.randomUUID(),
      userId,
      type: 'overtrading' as AlertType,
      severity: 'warning' as Severity,
      title: 'Overtrading Alert',
      message: `You placed ${maxTradesInWindow} trades within a 4-hour window (limit: ${settings.maxTradesPerWindow}). This high frequency may indicate impulsive trading.`,
      suggestedAction: 'Slow down and be more selective with your trades.',
      triggeredAt: now,
      acknowledged: false
    };
  }

  return null;
}