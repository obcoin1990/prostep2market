import { Alert, AlertType, Severity, DetectionInput, TradeInput } from '../../../types/guardian';

/**
 * GRDN-04, GRDN-07: Exposure and Risk Escalation Detection
 * - Risk Escalation: currentExposure > 150% of profile normal
 * - Exposure Warning: lot size > 130% of historical average
 */
export function detectRiskEscalation(input: DetectionInput): Alert | null {
  const { currentExposure, historicalAverage, settings, userId } = input;

  const threshold = historicalAverage * settings.exposureMultiplier;

  if (currentExposure > threshold) {
    return {
      id: crypto.randomUUID(),
      userId,
      type: 'risk_escalation' as AlertType,
      severity: 'critical' as Severity,
      title: 'Risk Escalation Warning',
      message: `Your current exposure ($${currentExposure.toFixed(2)}) exceeds ${settings.exposureMultiplier * 100}% of your normal level ($${historicalAverage.toFixed(2)}).`,
      suggestedAction: 'Consider reducing your position sizes or closing some trades to reduce risk.',
      triggeredAt: new Date(),
      acknowledged: false
    };
  }

  return null;
}

export function detectExposureWarning(input: DetectionInput): Alert | null {
  const { recentTrades, historicalAverage, settings, userId } = input;

  const threshold = historicalAverage * settings.exposureMultiplier;

  // Check each trade's lot size against historical average
  const oversizedTrades = recentTrades.filter((trade: TradeInput) => trade.lotSize > threshold);

  if (oversizedTrades.length > 0) {
    return {
      id: crypto.randomUUID(),
      userId,
      type: 'exposure_warning' as AlertType,
      severity: 'warning' as Severity,
      title: 'Exposure Warning',
      message: `${oversizedTrades.length} trade(s) have lot sizes exceeding ${settings.exposureMultiplier * 100}% of your historical average.`,
      suggestedAction: 'Review your position sizing strategy. Consider reducing lot sizes.',
      triggeredAt: new Date(),
      tradeIds: oversizedTrades.map((t: TradeInput) => t.id),
      acknowledged: false
    };
  }

  return null;
}