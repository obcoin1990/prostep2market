// Simulation Engine - Core backtest logic
import { 
  Candle, 
  Trade, 
  EntryRule, 
  ExitRule, 
  RiskRule,
  SimulationMetrics,
  BehaviorRule,
  BehavioralImpact 
} from '@/types/strategy-lab';
import { filterBySession } from './session-filters';
import { checkMACross, checkRSI, getCurrentPrice } from './indicators';

interface SimulationConfig {
  candles: Candle[];
  entryRules: EntryRule[];
  exitRules: ExitRule[];
  riskRules: RiskRule[];
  initialBalance: number;
  behaviorRules?: BehaviorRule[];
}

// Check if entry rule is triggered
function checkEntryRule(rule: EntryRule, candle: Candle, index: number, candles: Candle[]): boolean {
  const priorCandles = candles.slice(0, index + 1);
  
  switch (rule.condition) {
    case 'price_above':
      return candle.close > parseFloat(rule.value);
    case 'price_below':
      return candle.close < parseFloat(rule.value);
    case 'ma_cross': {
      const maPeriod = parseInt(rule.value) || 10;
      const cross = checkMACross(priorCandles, maPeriod, maPeriod * 2);
      return cross === 'bullish';
    }
    case 'rsi_above': {
      const threshold = parseFloat(rule.value) || 30;
      return checkRSI(priorCandles, 14, threshold);
    }
    case 'rsi_below': {
      const threshold = parseFloat(rule.value) || 70;
      const isRSIAbove = checkRSI(priorCandles, 14, 100 - threshold);
      const rsi = isRSIAbove ? 100 : 50;
      return rsi < threshold;
    }
    default:
      return false;
  }
}

// Calculate position size based on risk rules
function calculatePositionSize(config: SimulationConfig, balance: number): number {
  const riskRule = config.riskRules[0];
  
  if (!riskRule) {
    return balance * 0.02; // Default 2%
  }
  
  switch (riskRule.type) {
    case 'percent_balance':
      return balance * (riskRule.value / 100);
    case 'fixed_lot':
      return riskRule.value * 10000; // Convert to units
    case 'kelly':
      return balance * (riskRule.value / 100); // Kelly fraction
    case 'atr_based':
      return balance * 0.02; // Simplified ATR-based
    default:
      return balance * 0.02;
  }
}

// Check exit rules
function checkExitRules(
  candle: Candle, 
  position: { entryPrice: number; size: number; rules: ExitRule[] }
): { triggered: boolean; exitPrice: number; reason: string } | null {
  for (const rule of position.rules) {
    let triggered = false;
    let exitPrice = 0;
    let reason = '';
    
    const slDistance = position.entryPrice * 0.01; // Simplified
    
    switch (rule.type) {
      case 'sl':
        if (rule.unit === 'percent') {
          const slPrice = position.entryPrice * (1 - rule.value / 100);
          triggered = candle.low <= slPrice;
          exitPrice = slPrice;
        } else if (rule.unit === 'pips') {
          const slPrice = position.entryPrice - (rule.value * 0.0001);
          triggered = candle.low <= slPrice;
          exitPrice = slPrice;
        }
        reason = 'Stop Loss';
        break;
        
      case 'tp':
        if (rule.unit === 'percent') {
          const tpPrice = position.entryPrice * (1 + rule.value / 100);
          triggered = candle.high >= tpPrice;
          exitPrice = tpPrice;
        } else if (rule.unit === 'pips') {
          const tpPrice = position.entryPrice + (rule.value * 0.0001);
          triggered = candle.high >= tpPrice;
          exitPrice = tpPrice;
        }
        reason = 'Take Profit';
        break;
    }
    
    if (triggered) {
      return { triggered: true, exitPrice, reason };
    }
  }
  
  return null;
}

// Main simulation function
export function runSimulation(config: SimulationConfig): {
  trades: Trade[];
  finalBalance: number;
  metrics: SimulationMetrics;
} {
  const trades: Trade[] = [];
  let balance = config.initialBalance;
  let position: { entryPrice: number; entryTime: number; size: number; rules: ExitRule[] } | null = null;
  
  // Behavioral rules state
  let consecutiveLosses = 0;
  let consecutiveWins = 0;
  let tradesToday = 0;
  let lastTradeDay = 0;
  const cooldownHours = 0;
  
  for (let i = 1; i < config.candles.length; i++) {
    const candle = config.candles[i];
    const currentDay = new Date(candle.time).getDate();
    
    // Reset daily trade count
    if (currentDay !== lastTradeDay) {
      tradesToday = 0;
      lastTradeDay = currentDay;
    }
    
    // Check behavioral rules
    if (config.behaviorRules) {
      for (const rule of config.behaviorRules) {
        switch (rule.type) {
          case 'max_daily_trades':
            if (tradesToday >= rule.value) continue;
          case 'cooldown_after_trades':
            if (cooldownHours > 0) continue;
        }
      }
    }
    
    // Entry logic
    if (!position) {
      const entryTriggered = config.entryRules.some((rule) =>
        checkEntryRule(rule, candle, i, config.candles)
      );
      
      if (entryTriggered) {
        const size = calculatePositionSize(config, balance);
        position = {
          entryPrice: candle.close,
          entryTime: candle.time,
          size,
          rules: config.exitRules,
        };
        tradesToday++;
      }
    }
    // Exit logic
    else if (position) {
      const exitResult = checkExitRules(candle, position);
      
      if (exitResult) {
        const pnl = (exitResult.exitPrice - position.entryPrice) * position.size;
        const risk = config.riskRules[0]?.value || 1;
        
        trades.push({
          entryTime: position.entryTime,
          entryPrice: position.entryPrice,
          exitTime: candle.time,
          exitPrice: exitResult.exitPrice,
          pnl,
          rr: pnl / (position.entryPrice * risk * 0.01),
          reason: exitResult.reason,
        });
        
        // Track consecutive wins/losses
        if (pnl > 0) {
          consecutiveWins++;
          consecutiveLosses = 0;
        } else {
          consecutiveLosses++;
          consecutiveWins = 0;
        }
        
        balance += pnl;
        position = null;
      }
    }
  }
  
  // Close any open position at the end
  if (position) {
    const lastCandle = config.candles[config.candles.length - 1];
    const pnl = (lastCandle.close - position.entryPrice) * position.size;
    
    trades.push({
      entryTime: position.entryTime,
      entryPrice: position.entryPrice,
      exitTime: lastCandle.time,
      exitPrice: lastCandle.close,
      pnl,
      rr: pnl / (position.entryPrice * 0.01),
      reason: 'End of simulation',
    });
    
    balance += pnl;
  }
  
  // Calculate metrics
  const winningTrades = trades.filter((t) => t.pnl > 0);
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? winningTrades.length / totalTrades : 0;
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  
  // Calculate max drawdown
  let maxBalance = config.initialBalance;
  let maxDrawdown = 0;
  let currentBalance = config.initialBalance;
  
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
  
  // Calculate average RR
  const avgRR = totalTrades > 0
    ? trades.reduce((sum, t) => sum + Math.abs(t.rr), 0) / totalTrades
    : 0;
  
  // Calculate consistency score (simplified)
  const returns = trades.map(t => t.pnl / config.initialBalance);
  const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
  const variance = returns.length > 0 
    ? returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length 
    : 0;
  const stdDev = Math.sqrt(variance);
  const consistencyScore = avgReturn > 0 && stdDev > 0 
    ? Math.min(100, (avgReturn / stdDev) * 50) 
    : 0;
  
  const metrics: SimulationMetrics = {
    totalTrades,
    winRate: Math.round(winRate * 100),
    avgRR: Math.round(avgRR * 100) / 100,
    totalPnl: Math.round(totalPnl * 100) / 100,
    maxDrawdown: Math.round(maxDrawdown * 100 * 100) / 100,
    consistencyScore: Math.round(consistencyScore),
    behavioralImpact: [],
  };
  
  return {
    trades,
    finalBalance: Math.round(balance * 100) / 100,
    metrics,
  };
}

// Run simulation with session filter
export function simulateSession(
  candles: Candle[],
  sessionFilter: string[],
  config: Omit<SimulationConfig, 'candles'>
): ReturnType<typeof runSimulation> {
  const filteredCandles = sessionFilter 
    ? filterBySession(candles, sessionFilter) 
    : candles;
  
  return runSimulation({
    ...config,
    candles: filteredCandles,
  });
}

// Optimize RR ratios
export function optimizeRR(
  candles: Candle[],
  entryRules: EntryRule[],
  riskRules: RiskRule[],
  rrRange: { min: number; max: number; step: number }
): Array<{ rr: number; metrics: SimulationMetrics }> {
  const results: Array<{ rr: number; metrics: SimulationMetrics }> = [];
  
  // Test different RR values
  for (let rr = rrRange.min; rr <= rrRange.max; rr += rrRange.step) {
    // Create exit rules with this RR
    const tpValue = rr;
    const slValue = 1;
    
    const exitRules: ExitRule[] = [
      { type: 'tp', value: tpValue, unit: 'percent' },
      { type: 'sl', value: slValue, unit: 'percent' },
    ];
    
    const result = runSimulation({
      candles,
      entryRules,
      exitRules,
      riskRules,
      initialBalance: 10000,
    });
    
    results.push({ rr, metrics: result.metrics });
  }
  
  return results.sort((a, b) => b.metrics.totalPnl - a.metrics.totalPnl);
}

// Simulate with behavioral rules
export function simulateWithBehavioralRules(
  candles: Candle[],
  behaviorRules: BehaviorRule[],
  config: Omit<SimulationConfig, 'behaviorRules' | 'candles'> & { candles: Candle[] }
): { 
  original: SimulationMetrics; 
  withRules: SimulationMetrics; 
  impact: BehavioralImpact[] 
} {
  // Run without behavioral rules
  const originalResult = runSimulation({
    ...config,
    candles,
    behaviorRules: [],
  });
  
  // Run with behavioral rules
  const withRulesResult = runSimulation({
    ...config,
    candles,
    behaviorRules,
  });
  
  // Calculate impact per rule type
  const impact: BehavioralImpact[] = [
    {
      ruleType: 'stop_after_losses',
      originalPnl: originalResult.metrics.totalPnl,
      withRulesPnl: withRulesResult.metrics.totalPnl,
      impact: withRulesResult.metrics.totalPnl - originalResult.metrics.totalPnl,
    },
  ];
  
  return {
    original: originalResult.metrics,
    withRules: withRulesResult.metrics,
    impact,
  };
}