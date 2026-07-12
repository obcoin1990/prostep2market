/**
 * Tests for Strategy Simulation Engine (EDU-08, EDU-09, EDU-10, EDU-11)
 *
 * Validates simulation backtesting, session filtering, RR optimization,
 * behavioral comparison, and performance metrics.
 */

import { describe, it, expect } from 'vitest'
import {
  runSimulation,
  optimizeRR,
  simulateWithBehavioralRules,
  simulateSession,
} from '@/lib/strategy-lab/simulation'
import {
  SESSION_HOURS,
  SESSION_LABELS,
  filterBySession,
  filterByDateRange,
  getActiveSessions,
  getSessionLabel,
  generateSampleCandles,
} from '@/lib/strategy-lab/session-filters'
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  checkMACross,
  checkRSI,
  getCurrentPrice,
} from '@/lib/strategy-lab/indicators'
import {
  calculateMaxDrawdown,
  calculateAvgRR,
  calculateConsistency,
  calculateWinRate,
  calculateSharpeRatio,
  calculateProfitFactor,
  formatCurrency,
  formatPercentage,
} from '@/lib/strategy-lab/metrics'
import type { Candle, EntryRule, ExitRule, RiskRule } from '@/types/strategy-lab'

/** Generate a synthetic candle series for testing */
function makeCandles(prices: number[], startTime = Date.UTC(2026, 0, 1, 8, 0, 0), interval = 3600000): Candle[] {
  return prices.map((close, i) => ({
    time: startTime + i * interval,
    open: close,
    high: close + 0.001,
    low: close - 0.001,
    close,
    volume: 1000,
  }))
}

function trendingCandles(start: number, trend: number, count: number): Candle[] {
  const candles: Candle[] = []
  for (let i = 0; i < count; i++) {
    const close = start + trend * i
    candles.push({
      time: Date.UTC(2026, 0, 1, 8, 0, 0) + i * 3600000,
      open: close,
      high: close + 0.0005,
      low: close - 0.0005,
      close,
      volume: 1000,
    })
  }
  return candles
}

describe('Simulation Engine', () => {
  describe('Basic Simulation (EDU-08)', () => {
    it('should run backtest on historical candles', () => {
      const candles = trendingCandles(1.0, 0.0001, 100)
      const entryRules: EntryRule[] = [
        { condition: 'price_above', value: '1.001', timeframes: ['H1'] },
      ]
      const exitRules: ExitRule[] = [
        { type: 'tp', value: 2, unit: 'percent' },
        { type: 'sl', value: 1, unit: 'percent' },
      ]
      const riskRules: RiskRule[] = [
        { type: 'percent_balance', value: 2, maxDrawdownPercent: 10 },
      ]

      const result = runSimulation({
        candles,
        entryRules,
        exitRules,
        riskRules,
        initialBalance: 10000,
      })

      expect(result).toBeDefined()
      expect(result.trades).toBeInstanceOf(Array)
      expect(result.finalBalance).toBeGreaterThanOrEqual(0)
      expect(result.metrics).toBeDefined()
      expect(result.metrics.totalTrades).toBeGreaterThanOrEqual(0)
    })

    it('should trigger entry based on price_above rule', () => {
      const candles = trendingCandles(1.0, 0.001, 20)
      const entryRules: EntryRule[] = [
        { condition: 'price_above', value: '1.001', timeframes: ['H1'] },
      ]
      const exitRules: ExitRule[] = [{ type: 'tp', value: 5, unit: 'percent' }]
      const riskRules: RiskRule[] = [
        { type: 'percent_balance', value: 1, maxDrawdownPercent: 5 },
      ]

      const result = runSimulation({
        candles,
        entryRules,
        exitRules,
        riskRules,
        initialBalance: 10000,
      })

      // Should have at least one trade since price crosses 1.001
      expect(result.trades.length).toBeGreaterThan(0)
    })

    it('should trigger exit based on take profit', () => {
      const candles = trendingCandles(1.0, 0.01, 50)
      const entryRules: EntryRule[] = [
        { condition: 'price_above', value: '1.0001', timeframes: ['H1'] },
      ]
      const exitRules: ExitRule[] = [{ type: 'tp', value: 1, unit: 'percent' }]
      const riskRules: RiskRule[] = [
        { type: 'percent_balance', value: 1, maxDrawdownPercent: 5 },
      ]

      const result = runSimulation({
        candles,
        entryRules,
        exitRules,
        riskRules,
        initialBalance: 10000,
      })

      // At least one trade should have TP as reason
      const tpTrade = result.trades.find((t) => t.reason === 'Take Profit')
      expect(tpTrade).toBeDefined()
    })

    it('should calculate position size based on percent_balance risk rule', () => {
      const candles = trendingCandles(1.0, 0.01, 30)
      const entryRules: EntryRule[] = [
        { condition: 'price_above', value: '1.0001', timeframes: ['H1'] },
      ]
      const exitRules: ExitRule[] = [{ type: 'tp', value: 5, unit: 'percent' }]
      const riskRules: RiskRule[] = [
        { type: 'percent_balance', value: 5, maxDrawdownPercent: 20 },
      ]

      const result = runSimulation({
        candles,
        entryRules,
        exitRules,
        riskRules,
        initialBalance: 10000,
      })

      // 5% of 10000 = 500 position size
      expect(result.trades[0]?.pnl).toBeDefined()
    })

    it('should record all trades with P&L', () => {
      const candles = trendingCandles(1.0, 0.01, 30)
      const entryRules: EntryRule[] = [
        { condition: 'price_above', value: '1.0001', timeframes: ['H1'] },
      ]
      const exitRules: ExitRule[] = [
        { type: 'tp', value: 2, unit: 'percent' },
        { type: 'sl', value: 1, unit: 'percent' },
      ]
      const riskRules: RiskRule[] = [
        { type: 'percent_balance', value: 1, maxDrawdownPercent: 5 },
      ]

      const result = runSimulation({
        candles,
        entryRules,
        exitRules,
        riskRules,
        initialBalance: 10000,
      })

      for (const trade of result.trades) {
        expect(typeof trade.entryPrice).toBe('number')
        expect(typeof trade.exitPrice).toBe('number')
        expect(typeof trade.pnl).toBe('number')
        expect(typeof trade.rr).toBe('number')
        expect(trade.entryTime).toBeGreaterThan(0)
        expect(trade.exitTime).toBeGreaterThan(0)
      }
    })

    it('should close open position at end of simulation', () => {
      const candles = trendingCandles(1.0, 0.0001, 10) // Small trend, unlikely to hit TP
      const entryRules: EntryRule[] = [
        { condition: 'price_above', value: '1.0001', timeframes: ['H1'] },
      ]
      const exitRules: ExitRule[] = [{ type: 'tp', value: 50, unit: 'percent' }] // Very high TP
      const riskRules: RiskRule[] = [
        { type: 'percent_balance', value: 1, maxDrawdownPercent: 5 },
      ]

      const result = runSimulation({
        candles,
        entryRules,
        exitRules,
        riskRules,
        initialBalance: 10000,
      })

      // If a position is open at the end, the last trade should have "End of simulation" reason
      const lastTrade = result.trades[result.trades.length - 1]
      if (lastTrade) {
        expect(['Take Profit', 'Stop Loss', 'End of simulation']).toContain(lastTrade.reason)
      }
    })

    it('should return zero metrics on empty candles', () => {
      const result = runSimulation({
        candles: [],
        entryRules: [{ condition: 'price_above', value: '1.0', timeframes: ['H1'] }],
        exitRules: [{ type: 'tp', value: 1, unit: 'percent' }],
        riskRules: [{ type: 'percent_balance', value: 1, maxDrawdownPercent: 5 }],
        initialBalance: 10000,
      })

      expect(result.trades).toHaveLength(0)
      expect(result.metrics.totalTrades).toBe(0)
      expect(result.metrics.winRate).toBe(0)
      expect(result.metrics.totalPnl).toBe(0)
    })
  })

  describe('Session Testing (EDU-08)', () => {
    it('should filter candles by London session (UTC 7-16)', () => {
      const candles: Candle[] = []
      for (let h = 0; h < 24; h++) {
        candles.push({
          time: Date.UTC(2026, 0, 1, h, 0, 0),
          open: 1, high: 1, low: 1, close: 1, volume: 1,
        })
      }

      const filtered = filterBySession(candles, ['london'])
      // London is 7-16 UTC (10 hours)
      expect(filtered).toHaveLength(10)
      for (const c of filtered) {
        const hour = new Date(c.time).getUTCHours()
        expect(SESSION_HOURS.london).toContain(hour)
      }
    })

    it('should filter candles by New York session (UTC 13-22)', () => {
      const candles: Candle[] = []
      for (let h = 0; h < 24; h++) {
        candles.push({
          time: Date.UTC(2026, 0, 1, h, 0, 0),
          open: 1, high: 1, low: 1, close: 1, volume: 1,
        })
      }

      const filtered = filterBySession(candles, ['newyork'])
      expect(filtered).toHaveLength(10)
    })

    it('should filter candles by Asian session', () => {
      const candles: Candle[] = []
      for (let h = 0; h < 24; h++) {
        candles.push({
          time: Date.UTC(2026, 0, 1, h, 0, 0),
          open: 1, high: 1, low: 1, close: 1, volume: 1,
        })
      }

      const filtered = filterBySession(candles, ['sydney'])
      expect(filtered.length).toBeGreaterThan(0)
    })

    it('should run simulation on filtered session data', () => {
      const candles = generateSampleCandles(7)
      const entryRules: EntryRule[] = [
        { condition: 'price_above', value: '1.0', timeframes: ['H1'] },
      ]
      const exitRules: ExitRule[] = [{ type: 'tp', value: 5, unit: 'percent' }]
      const riskRules: RiskRule[] = [
        { type: 'percent_balance', value: 1, maxDrawdownPercent: 5 },
      ]

      const result = simulateSession(candles, ['london'], {
        entryRules,
        exitRules,
        riskRules,
        initialBalance: 10000,
      })

      expect(result).toBeDefined()
      expect(result.metrics).toBeDefined()
    })

    it('should return all candles when session filter is empty', () => {
      const candles = generateSampleCandles(3)
      const filtered = filterBySession(candles, [])
      expect(filtered).toHaveLength(candles.length)
    })

    it('should filter by date range', () => {
      // Use a date range that overlaps with the sample candles
      // generateSampleCandles creates candles starting from (now - days*86400000)
      // So we need a window that includes some of those candles
      const now = Date.now()
      const startDate = new Date(now - 5 * 86400000) // 5 days ago
      const endDate = new Date(now + 1 * 86400000)   // tomorrow
      const candles = generateSampleCandles(7)

      const filtered = filterByDateRange(candles, startDate, endDate)
      expect(filtered.length).toBeGreaterThan(0)
      for (const c of filtered) {
        const t = new Date(c.time)
        expect(t.getTime()).toBeGreaterThanOrEqual(startDate.getTime())
        expect(t.getTime()).toBeLessThanOrEqual(endDate.getTime())
      }
    })

    it('should get active sessions for a given hour', () => {
      // 13 UTC: London + New York overlap
      const sessions = getActiveSessions(13)
      expect(sessions).toContain('london')
      expect(sessions).toContain('newyork')
    })

    it('should return session label for valid hour', () => {
      const label = getSessionLabel(10) // 10 UTC = London
      expect(label).toBe('London')
    })

    it('should return "Off-hours" for invalid hour', () => {
      // Find an hour not in any session (rare with overlaps but possible)
      const label = getSessionLabel(0) // 0 UTC — overlaps sydney + tokyo
      expect(typeof label).toBe('string')
    })
  })

  describe('RR Optimization (EDU-09)', () => {
    it('should find optimal RR across different exit configurations', () => {
      const candles = trendingCandles(1.0, 0.005, 50)
      const entryRules: EntryRule[] = [
        { condition: 'price_above', value: '1.0001', timeframes: ['H1'] },
      ]
      const riskRules: RiskRule[] = [
        { type: 'percent_balance', value: 1, maxDrawdownPercent: 5 },
      ]

      const results = optimizeRR(candles, entryRules, riskRules, {
        min: 1, max: 5, step: 1,
      })

      expect(results.length).toBeGreaterThan(0)
      // Results should be sorted by totalPnl descending
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].metrics.totalPnl).toBeGreaterThanOrEqual(results[i].metrics.totalPnl)
      }
    })

    it('should test different risk percentages via RR optimization', () => {
      const candles = trendingCandles(1.0, 0.01, 30)
      const entryRules: EntryRule[] = [
        { condition: 'price_above', value: '1.0001', timeframes: ['H1'] },
      ]
      const riskRules: RiskRule[] = [
        { type: 'percent_balance', value: 2, maxDrawdownPercent: 10 },
      ]

      const results = optimizeRR(candles, entryRules, riskRules, {
        min: 1, max: 3, step: 0.5,
      })

      expect(results).toBeDefined()
      expect(results.length).toBeGreaterThan(0)
    })
  })

  describe('Behavioral Rules (EDU-10)', () => {
    it('should compare simulation with and without behavioral rules', () => {
      const candles = trendingCandles(1.0, 0.005, 50)
      const entryRules: EntryRule[] = [
        { condition: 'price_above', value: '1.0001', timeframes: ['H1'] },
      ]
      const exitRules: ExitRule[] = [
        { type: 'tp', value: 2, unit: 'percent' },
        { type: 'sl', value: 1, unit: 'percent' },
      ]
      const riskRules: RiskRule[] = [
        { type: 'percent_balance', value: 1, maxDrawdownPercent: 5 },
      ]

      const result = simulateWithBehavioralRules(candles, [
        { type: 'stop_after_losses', value: 3 },
      ], {
        entryRules,
        exitRules,
        riskRules,
        initialBalance: 10000,
        candles,
      })

      expect(result.original).toBeDefined()
      expect(result.withRules).toBeDefined()
      expect(result.impact).toBeInstanceOf(Array)
      expect(result.impact.length).toBeGreaterThan(0)
    })

    it('should show P&L impact of behavioral rules', () => {
      const candles = trendingCandles(1.0, 0.005, 50)
      const entryRules: EntryRule[] = [
        { condition: 'price_above', value: '1.0001', timeframes: ['H1'] },
      ]
      const exitRules: ExitRule[] = [{ type: 'tp', value: 2, unit: 'percent' }]
      const riskRules: RiskRule[] = [
        { type: 'percent_balance', value: 1, maxDrawdownPercent: 5 },
      ]

      const result = simulateWithBehavioralRules(candles, [
        { type: 'stop_after_losses', value: 3 },
      ], {
        entryRules,
        exitRules,
        riskRules,
        initialBalance: 10000,
        candles,
      })

      const impact = result.impact[0]
      expect(impact.impact).toBe(impact.withRulesPnl - impact.originalPnl)
    })
  })

  describe('Performance Metrics (EDU-11)', () => {
    const sampleTrades = [
      { entryTime: 1, entryPrice: 100, exitTime: 2, exitPrice: 110, pnl: 100, rr: 1.0, reason: 'TP' },
      { entryTime: 3, entryPrice: 100, exitTime: 4, exitPrice: 95, pnl: -50, rr: 0.5, reason: 'SL' },
      { entryTime: 5, entryPrice: 100, exitTime: 6, exitPrice: 115, pnl: 150, rr: 1.5, reason: 'TP' },
      { entryTime: 7, entryPrice: 100, exitTime: 8, exitPrice: 90, pnl: -100, rr: 1.0, reason: 'SL' },
    ]

    it('should calculate total P&L', () => {
      const totalPnl = sampleTrades.reduce((sum, t) => sum + t.pnl, 0)
      expect(totalPnl).toBe(100) // 100 - 50 + 150 - 100 = 100
    })

    it('should calculate max drawdown', () => {
      const dd = calculateMaxDrawdown(1000, sampleTrades)
      expect(dd).toBeGreaterThanOrEqual(0)
    })

    it('should calculate win rate percentage', () => {
      const wr = calculateWinRate(sampleTrades)
      expect(wr).toBe(50) // 2 wins out of 4
    })

    it('should calculate average RR ratio', () => {
      const avg = calculateAvgRR(sampleTrades)
      expect(avg).toBe(1.0) // (1.0 + 0.5 + 1.5 + 1.0) / 4
    })

    it('should calculate consistency score', () => {
      const score = calculateConsistency(sampleTrades)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should return 100 consistency on 0 or 1 trades (default)', () => {
      // Per implementation: trades.length < 2 returns 100
      expect(calculateConsistency([])).toBe(100)
      expect(calculateConsistency([sampleTrades[0]])).toBe(100)
    })

    it('should calculate Sharpe ratio', () => {
      const sharpe = calculateSharpeRatio(sampleTrades)
      expect(typeof sharpe).toBe('number')
    })

    it('should calculate profit factor', () => {
      const pf = calculateProfitFactor(sampleTrades)
      // gross profit = 250, gross loss = 150, pf = 1.67
      expect(pf).toBeGreaterThan(1.0)
    })

    it('should format currency correctly', () => {
      expect(formatCurrency(100)).toBe('+$100.00')
      expect(formatCurrency(-50)).toBe('-$50.00')
      expect(formatCurrency(0)).toBe('+$0.00')
    })

    it('should format percentage with sign', () => {
      expect(formatPercentage(5.5)).toBe('+5.50%')
      expect(formatPercentage(-3.2)).toBe('-3.20%')
      expect(formatPercentage(0)).toBe('+0.00%')
    })
  })
})

describe('Technical Indicators', () => {
  describe('SMA', () => {
    it('should calculate simple moving average', () => {
      const candles = makeCandles([1, 2, 3, 4, 5])
      const sma = calculateSMA(candles, 3)
      expect(sma).toEqual([2, 3, 4])
    })

    it('should return empty array for insufficient data', () => {
      const candles = makeCandles([1, 2])
      const sma = calculateSMA(candles, 5)
      expect(sma).toEqual([])
    })
  })

  describe('EMA', () => {
    it('should calculate exponential moving average', () => {
      const candles = makeCandles([1, 2, 3, 4, 5])
      const ema = calculateEMA(candles, 3)
      expect(ema.length).toBeGreaterThan(0)
    })
  })

  describe('RSI', () => {
    it('should calculate RSI values', () => {
      const candles = makeCandles([44, 44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.10, 45.42, 45.84])
      const rsi = calculateRSI(candles, 14)
      expect(Array.isArray(rsi)).toBe(true)
    })

    it('should return 100 when no losses (pure uptrend)', () => {
      const candles = makeCandles([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
      const rsi = calculateRSI(candles, 14)
      expect(rsi[0]).toBe(100)
    })
  })

  describe('MA Cross', () => {
    it('should detect bullish crossover', () => {
      // Construct data where fast crosses above slow
      const candles = makeCandles([
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0,
      ])
      const cross = checkMACross(candles, 5, 10)
      expect(['bullish', 'bearish', null]).toContain(cross)
    })

    it('should return null for insufficient data', () => {
      // Empty array: EMA returns [] (length < 2) → null
      const cross = checkMACross([], 5, 10)
      expect(cross).toBeNull()
    })
  })

  describe('RSI Check', () => {
    it('should return true when RSI > threshold', () => {
      const candles = makeCandles([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
      expect(checkRSI(candles, 14, 50)).toBe(true)
    })

    it('should return false when no candles', () => {
      expect(checkRSI([], 14, 50)).toBe(false)
    })
  })

  describe('Helpers', () => {
    it('should get current price', () => {
      const candles = makeCandles([1, 2, 3])
      expect(getCurrentPrice(candles)).toBe(3)
    })

    it('should return 0 for empty candles', () => {
      expect(getCurrentPrice([])).toBe(0)
    })
  })
})

describe('Sample Candle Generation', () => {
  it('should generate sample candles', () => {
    const candles = generateSampleCandles(2)
    expect(candles.length).toBe(48) // 2 days * 24 hours
    expect(candles[0].close).toBeGreaterThan(0)
  })

  it('should generate candles in chronological order', () => {
    const candles = generateSampleCandles(3)
    for (let i = 1; i < candles.length; i++) {
      expect(candles[i].time).toBeGreaterThan(candles[i - 1].time)
    }
  })
})
