import { Alert, AlertType, Severity, DetectionInput } from '../../../types/guardian';

/**
 * GRDN-03, GRDN-06: Trading Fatigue Detection
 * Triggers when session > 2 hours OR > 50 trades in single session
 */
export function detectFatigue(input: DetectionInput): Alert | null {
  const { recentTrades, sessionStart, settings, userId } = input;

  if (!settings.fatigueWarningEnabled) {
    return null;
  }

  const now = new Date();
  const sessionDurationMinutes = (now.getTime() - new Date(sessionStart).getTime()) / (1000 * 60);
  
  // Check session duration
  if (sessionDurationMinutes > settings.maxSessionDuration) {
    return {
      id: crypto.randomUUID(),
      userId,
      type: 'fatigue' as AlertType,
      severity: 'warning' as Severity,
      title: 'Trading Fatigue Warning',
      message: `Your trading session has exceeded ${settings.maxSessionDuration} minutes. Extended sessions can lead to impaired decision-making.`,
      suggestedAction: 'Consider taking a break.',
      triggeredAt: now,
      acknowledged: false
    };
  }

  // Check trades per session
  if (recentTrades.length > settings.maxTradesPerSession) {
    return {
      id: crypto.randomUUID(),
      userId,
      type: 'fatigue' as AlertType,
      severity: 'warning' as Severity,
      title: 'Trading Fatigue Warning',
      message: `You've placed ${recentTrades.length} trades in this session (limit: ${settings.maxTradesPerSession}). High trade volume can lead to fatigue.`,
      suggestedAction: 'Consider taking a break.',
      triggeredAt: now,
      acknowledged: false
    };
  }

  return null;
}