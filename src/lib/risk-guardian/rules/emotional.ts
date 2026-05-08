import { Alert, AlertType, Severity, DetectionInput, TradeInput } from '../../../types/guardian';

/**
 * GRDN-05: Emotional Instability Detection
 * Triggers on 5+ trades with emotional_state = 'frustrated' or 'fearful' in 24h
 */
export function detectEmotionalInstability(input: DetectionInput): Alert | null {
  const { recentTrades, settings, userId } = input;

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Count trades in the last 24 hours with frustrated or fearful emotional state
  const emotionalTrades = recentTrades.filter(trade => {
    if (!trade.emotionalState) return false;
    const tradeTime = new Date(trade.entryTime);
    return tradeTime >= twentyFourHoursAgo && 
           (trade.emotionalState === 'frustrated' || trade.emotionalState === 'fearful');
  });

  if (emotionalTrades.length >= settings.emotionalInstabilityThreshold) {
    return {
      id: crypto.randomUUID(),
      userId,
      type: 'emotional_instability' as AlertType,
      severity: 'warning' as Severity,
      title: 'Emotional Instability Detected',
      message: `You've made ${emotionalTrades.length} trades while feeling frustrated or fearful in the last 24 hours. This may indicate emotional trading.`,
      suggestedAction: 'Take a step back and evaluate your trading state. Consider a break.',
      triggeredAt: now,
      tradeIds: emotionalTrades.map(t => t.id),
      acknowledged: false
    };
  }

  return null;
}