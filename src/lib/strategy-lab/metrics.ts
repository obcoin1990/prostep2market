// Metrics calculations for simulation results
import { Trade, SimulationMetrics, BehavioralImpact } from '@/types/strategy-lab';

// Calculate maximum drawdown
export function calculateMaxDrawdown(initialBalance: number, trades: Trade[]): number {
  let maxBalance = initialBalance;
  let currentBalance = initialBalance;
  let maxDrawdown = 0;
  
  for (const trade of trades) {
    currentBalance += trade.pnl;
    if (currentBalance > maxBalance) {
      maxBalance = currentBalance;
    }
    const drawdown = (maxBalance - currentBalance) / maxBalance;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return Math.round(maxDrawdown * 100 * 100) / 100;
}

// Calculate average risk-reward ratio
export function calculateAvgRR(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  
  const totalRR = trades.reduce((sum, t) => sum + Math.abs(t.rr), 0);
  return Math.round((totalRR / trades.length) * 100) / 100;
}

// Calculate consistency score (0-100)
export function calculateConsistency(trades: Trade[]): number {
  if (trades.length < 2) return 100;
  
  const returns = trades.map(t => t.pnl);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  if (avgReturn <= 0 || stdDev === 0) return 0;
  
  const score = Math.min(100, (avgReturn / stdDev) * 20);
  return Math.round(score);
}

// Calculate win rate
export function calculateWinRate(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  
  const wins = trades.filter(t => t.pnl > 0).length;
  return Math.round((wins / trades.length) * 100);
}

// Format currency
export function formatCurrency(pnl: number, currency: string = 'USD'): string {
  const formatted = Math.abs(pnl).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  if (pnl >= 0) {
    return `+${currency === 'USD' ? '$' : ''}${formatted}`;
  }
  return `-${currency === 'USD' ? '$' : ''}${formatted}`;
}

// Calculate behavioral impact
export function calculateBehavioralImpact(
  original: SimulationMetrics,
  withRules: SimulationMetrics
): BehavioralImpact[] {
  const impact: BehavioralImpact[] = [];
  
  // Calculate overall impact
  impact.push({
    ruleType: 'stop_after_losses',
    originalPnl: original.totalPnl,
    withRulesPnl: withRules.totalPnl,
    impact: withRules.totalPnl - original.totalPnl,
  });
  
  return impact;
}

// Calculate Sharpe Ratio (simplified)
export function calculateSharpeRatio(trades: Trade[], riskFreeRate: number = 0.02): number {
  if (trades.length < 2) return 0;
  
  const returns = trades.map(t => t.pnl);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) return 0;
  
  const sharpe = (avgReturn - riskFreeRate / 365) / stdDev;
  return Math.round(sharpe * 100) / 100;
}

// Calculate Profit Factor
export function calculateProfitFactor(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  
  const grossProfit = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
  
  if (grossLoss === 0) return grossProfit > 0 ? 999 : 0;
  
  return Math.round((grossProfit / grossLoss) * 100) / 100;
}

// Format percentage
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// Format large numbers
export function formatLargeNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(2);
}