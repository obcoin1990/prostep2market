// Technical Indicators for Simulation Engine
import { Candle } from '@/types/strategy-lab';

// Simple Moving Average
export function calculateSMA(candles: Candle[], period: number): number[] {
  const sma: number[] = [];
  
  for (let i = period - 1; i < candles.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += candles[j].close;
    }
    sma.push(sum / period);
  }
  
  return sma;
}

// Exponential Moving Average
export function calculateEMA(candles: Candle[], period: number): number[] {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA is SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += candles[i].close;
  }
  ema.push(sum / period);
  
  // Calculate EMA for remaining candles
  for (let i = period; i < candles.length; i++) {
    const prevEma = ema[ema.length - 1];
    const currentEma = (candles[i].close - prevEma) * multiplier + prevEma;
    ema.push(currentEma);
  }
  
  return ema;
}

// Relative Strength Index
export function calculateRSI(candles: Candle[], period: number = 14): number[] {
  const rsi: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  // Calculate price changes
  for (let i = 1; i < candles.length; i++) {
    const change = candles[i].close - candles[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  // Calculate RSI
  for (let i = period - 1; i < gains.length; i++) {
    let avgGain = 0;
    let avgLoss = 0;
    
    for (let j = i - period + 1; j <= i; j++) {
      avgGain += gains[j];
      avgLoss += losses[j];
    }
    
    avgGain /= period;
    avgLoss /= period;
    
    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
  }
  
  return rsi;
}

// Check for Moving Average Crossover
export function checkMACross(
  candles: Candle[], 
  fastPeriod: number = 10, 
  slowPeriod: number = 20
): 'bullish' | 'bearish' | null {
  const fastEMA = calculateEMA(candles, fastPeriod);
  const slowEMA = calculateEMA(candles, slowPeriod);
  
  if (fastEMA.length < 2 || slowEMA.length < 2) {
    return null;
  }
  
  const fastCurrent = fastEMA[fastEMA.length - 1];
  const fastPrev = fastEMA[fastEMA.length - 2];
  const slowCurrent = slowEMA[slowEMA.length - 1];
  const slowPrev = slowEMA[slowEMA.length - 2];
  
  // Bullish: Fast crosses above Slow
  if (fastPrev <= slowPrev && fastCurrent > slowCurrent) {
    return 'bullish';
  }
  
  // Bearish: Fast crosses below Slow
  if (fastPrev >= slowPrev && fastCurrent < slowCurrent) {
    return 'bearish';
  }
  
  return null;
}

// Check RSI threshold
export function checkRSI(
  candles: Candle[], 
  period: number = 14, 
  threshold: number
): boolean {
  const rsi = calculateRSI(candles, period);
  
  if (rsi.length === 0) return false;
  
  return rsi[rsi.length - 1] > threshold;
}

// Get current price
export function getCurrentPrice(candles: Candle[]): number {
  return candles[candles.length - 1]?.close || 0;
}

// Get previous candle
export function getPreviousCandle(candles: Candle[], index: number): Candle | null {
  return candles[index - 1] || null;
}