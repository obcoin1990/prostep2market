export interface OvertradingResult {
  detected: boolean;
  sessionCount: number;
  sessions: Record<string, number>;
  maxTrades: number;
  worstSession: string;
}

export interface OvertradingConfig {
  maxTradesPerSession: number;
}

const DEFAULT_CONFIG: OvertradingConfig = {
  maxTradesPerSession: 8,
};

/**
 * Detects overtrading pattern.
 * Criteria: >8 trades in a single session.
 */
export function detectOvertrading(
  trades: Trade[],
  config: Partial<OvertradingConfig> = {}
): OvertradingResult {
  if (trades.length < 3) {
    return {
      detected: false,
      sessionCount: 0,
      sessions: {},
      maxTrades: 0,
      worstSession: '',
    };
  }

  const cfg = { ...DEFAULT_CONFIG, ...config };

  // Count trades per session
  const sessionCounts: Record<string, number> = {};
  for (const trade of trades) {
    const session = trade.session || 'unknown';
    sessionCounts[session] = (sessionCounts[session] || 0) + 1;
  }

  // Find sessions exceeding threshold
  const excessiveSessions: string[] = [];
  for (const [session, count] of Object.entries(sessionCounts)) {
    if (count > cfg.maxTradesPerSession) {
      excessiveSessions.push(session);
    }
  }

  const maxTrades = Math.max(...Object.values(sessionCounts), 0);
  const worstSession =
    Object.entries(sessionCounts).find(
      ([, count]) => count === maxTrades
    )?.[0] || '';

  return {
    detected: excessiveSessions.length > 0,
    sessionCount: Object.values(sessionCounts).filter(
      (c) => c > cfg.maxTradesPerSession
    ).length,
    sessions: sessionCounts,
    maxTrades,
    worstSession,
  };
}

interface Trade {
  id: string;
  session: 'asian' | 'london' | 'newyork' | 'sydney' | 'unknown';
}
