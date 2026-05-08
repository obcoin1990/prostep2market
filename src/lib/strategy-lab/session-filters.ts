// Session Filters for Simulation Engine
import { Candle } from '@/types/strategy-lab';

// Trading sessions by UTC hour
export const SESSION_HOURS: Record<string, number[]> = {
  sydney: [21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7],
  tokyo: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  london: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  newyork: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
};

export const SESSION_LABELS: Record<string, string> = {
  sydney: 'Sydney',
  tokyo: 'Tokyo',
  london: 'London',
  newyork: 'New York',
};

// Get session name from hour
export function getSessionLabel(hour: number): string {
  for (const [session, hours] of Object.entries(SESSION_HOURS)) {
    if (hours.includes(hour)) {
      return SESSION_LABELS[session];
    }
  }
  return 'Off-hours';
}

// Filter candles by trading sessions
export function filterBySession(candles: Candle[], sessions: string[]): Candle[] {
  if (!sessions || sessions.length === 0) {
    return candles;
  }
  
  return candles.filter((candle) => {
    const hour = new Date(candle.time).getUTCHours();
    return sessions.some((session) => {
      const sessionHours = SESSION_HOURS[session.toLowerCase()];
      return sessionHours?.includes(hour);
    });
  });
}

// Filter candles by date range
export function filterByDateRange(
  candles: Candle[], 
  startDate: Date, 
  endDate: Date
): Candle[] {
  return candles.filter((candle) => {
    const candleTime = new Date(candle.time);
    return candleTime >= startDate && candleTime <= endDate;
  });
}

// Get all active sessions at a given time
export function getActiveSessions(hour: number): string[] {
  const active: string[] = [];
  
  for (const [session, hours] of Object.entries(SESSION_HOURS)) {
    if (hours.includes(hour)) {
      active.push(session);
    }
  }
  
  return active;
}

// Generate sample candle data for demo/testing
export function generateSampleCandles(
  days: number = 30,
  startPrice: number = 1.1000,
  interval: number = 3600000 // 1 hour in ms
): Candle[] {
  const candles: Candle[] = [];
  const startTime = Date.now() - days * 24 * 60 * 60 * 1000;
  
  let currentPrice = startPrice;
  let currentTime = startTime;
  
  for (let i = 0; i < days * 24; i++) {
    // Simple random walk with trend
    const change = (Math.random() - 0.48) * 0.001; // Slight upward bias
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * 0.0005;
    const low = Math.min(open, close) - Math.random() * 0.0005;
    const volume = Math.floor(Math.random() * 10000) + 1000;
    
    candles.push({
      time: currentTime,
      open,
      high,
      low,
      close,
      volume,
    });
    
    currentPrice = close;
    currentTime += interval;
  }
  
  return candles;
}

// Major forex pairs for simulation
export const FOREX_PAIRS = [
  { symbol: 'EURUSD', name: 'EUR/USD' },
  { symbol: 'GBPUSD', name: 'GBP/USD' },
  { symbol: 'USDJPY', name: 'USD/JPY' },
  { symbol: 'AUDUSD', name: 'AUD/USD' },
  { symbol: 'USDCAD', name: 'USD/CAD' },
  { symbol: 'NZDUSD', name: 'NZD/USD' },
  { symbol: 'EURGBP', name: 'EUR/GBP' },
  { symbol: 'EURJPY', name: 'EUR/JPY' },
];