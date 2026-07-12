/**
 * Tests for Strategy Builder CRUD operations
 *
 * Validates strategy creation, validation, retrieval, and updates.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

const { supabase } = vi.hoisted(() => {
  const queues: Record<string, any> = {}
  const getResponse = (table: string) => {
    const q = queues[table]
    if (q && q.length > 0) return q.shift()!
    return { data: null, error: null }
  }
  const makeChain = (response: any) => {
    const chain: any = {
      select: vi.fn(() => chain),
      eq: vi.fn(() => chain),
      order: vi.fn(() => chain),
      limit: vi.fn(() => chain),
      single: vi.fn(async () => response),
      maybeSingle: vi.fn(async () => response),
      insert: vi.fn(() => chain),
      update: vi.fn(() => chain),
      upsert: vi.fn(() => chain),
      delete: vi.fn(() => chain),
    }
    chain.then = (onF: any, onR?: any) => Promise.resolve(response).then(onF, onR)
    chain.catch = (onR: any) => Promise.resolve(response).catch(onR)
    return chain
  }
  const fromMock = vi.fn((table: string) => makeChain(getResponse(table)))
  const setResponse = (table: string, ...responses: any[]) => { queues[table] = [...responses] }
  const createClient = vi.fn(async () => ({ from: fromMock }))
  return { supabase: { setResponse, createClient, fromMock, queues } }
})

vi.mock('@/lib/supabase/server', () => ({
  createClient: supabase.createClient,
}))

import {
  entryRuleValidation,
  exitRuleValidation,
  riskRuleValidation,
  strategyValidation,
  validateStrategy,
  getStrategiesByUser,
  getStrategyById,
  createStrategy,
  updateStrategy,
  deleteStrategy,
} from '@/lib/strategy-lab/builder'

describe('Strategy Builder', () => {
  const validEntryRule = {
    condition: 'price_above' as const,
    value: '1.1000',
    timeframes: ['H1' as const],
  }

  const validExitRule = {
    type: 'tp' as const,
    value: 2,
    unit: 'percent' as const,
  }

  const validRiskRule = {
    type: 'percent_balance' as const,
    value: 2,
    maxDrawdownPercent: 10,
  }

  const validStrategy = {
    name: 'My Trading Strategy',
    entryRules: [validEntryRule],
    exitRules: [validExitRule],
    riskRules: [validRiskRule],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('entryRuleValidation', () => {
    it('should validate a valid entry rule', () => {
      const result = entryRuleValidation.safeParse(validEntryRule)
      expect(result.success).toBe(true)
    })

    it('should reject invalid condition', () => {
      const result = entryRuleValidation.safeParse({
        ...validEntryRule,
        condition: 'invalid',
      })
      expect(result.success).toBe(false)
    })

    it('should reject empty value', () => {
      const result = entryRuleValidation.safeParse({
        ...validEntryRule,
        value: '',
      })
      expect(result.success).toBe(false)
    })

    it('should reject empty timeframes', () => {
      const result = entryRuleValidation.safeParse({
        ...validEntryRule,
        timeframes: [],
      })
      expect(result.success).toBe(false)
    })

    it('should accept all valid conditions', () => {
      const conditions = ['price_above', 'price_below', 'ma_cross', 'rsi_above', 'rsi_below', 'custom'] as const
      for (const condition of conditions) {
        const result = entryRuleValidation.safeParse({ ...validEntryRule, condition })
        expect(result.success).toBe(true)
      }
    })
  })

  describe('exitRuleValidation', () => {
    it('should validate a valid exit rule', () => {
      const result = exitRuleValidation.safeParse(validExitRule)
      expect(result.success).toBe(true)
    })

    it('should reject negative value', () => {
      const result = exitRuleValidation.safeParse({
        ...validExitRule,
        value: -5,
      })
      expect(result.success).toBe(false)
    })

    it('should reject zero value', () => {
      const result = exitRuleValidation.safeParse({
        ...validExitRule,
        value: 0,
      })
      expect(result.success).toBe(false)
    })

    it('should accept all valid units', () => {
      const units = ['pips', 'percent', 'atr'] as const
      for (const unit of units) {
        const result = exitRuleValidation.safeParse({ ...validExitRule, unit })
        expect(result.success).toBe(true)
      }
    })
  })

  describe('riskRuleValidation', () => {
    it('should validate a valid risk rule', () => {
      const result = riskRuleValidation.safeParse(validRiskRule)
      expect(result.success).toBe(true)
    })

    it('should reject drawdown > 100', () => {
      const result = riskRuleValidation.safeParse({
        ...validRiskRule,
        maxDrawdownPercent: 150,
      })
      expect(result.success).toBe(false)
    })

    it('should reject negative drawdown', () => {
      const result = riskRuleValidation.safeParse({
        ...validRiskRule,
        maxDrawdownPercent: -5,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('strategyValidation', () => {
    it('should validate a complete strategy', () => {
      const result = strategyValidation.safeParse(validStrategy)
      expect(result.success).toBe(true)
    })

    it('should require a name', () => {
      const result = strategyValidation.safeParse({
        ...validStrategy,
        name: '',
      })
      expect(result.success).toBe(false)
    })

    it('should require at least one entry rule', () => {
      const result = strategyValidation.safeParse({
        ...validStrategy,
        entryRules: [],
      })
      expect(result.success).toBe(false)
    })

    it('should require at least one exit rule', () => {
      const result = strategyValidation.safeParse({
        ...validStrategy,
        exitRules: [],
      })
      expect(result.success).toBe(false)
    })

    it('should require at least one risk rule', () => {
      const result = strategyValidation.safeParse({
        ...validStrategy,
        riskRules: [],
      })
      expect(result.success).toBe(false)
    })

    it('should reject name longer than 100 chars', () => {
      const result = strategyValidation.safeParse({
        ...validStrategy,
        name: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('validateStrategy', () => {
    it('should return success for valid strategy', () => {
      const result = validateStrategy(validStrategy)
      expect(result.success).toBe(true)
    })

    it('should return errors for invalid strategy', () => {
      const result = validateStrategy({
        name: '',
        entryRules: [],
        exitRules: [],
        riskRules: [],
      })
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.length).toBeGreaterThan(0)
    })

    it('should handle non-Zod errors', () => {
      const result = validateStrategy(null)
      expect(result.success).toBe(false)
    })
  })

  describe('getStrategiesByUser', () => {
    it('should return mapped strategies', async () => {
      supabase.setResponse('strategies', {
        data: [
          {
            id: 's-1',
            user_id: 'user-1',
            name: 'Strategy 1',
            entry_rules: [validEntryRule],
            exit_rules: [validExitRule],
            risk_rules: [validRiskRule],
            created_at: '2026-01-01T00:00:00Z',
            last_tested_at: null,
          },
        ],
        error: null,
      })

      const strategies = await getStrategiesByUser('user-1')
      expect(strategies).toHaveLength(1)
      expect(strategies[0].id).toBe('s-1')
      expect(strategies[0].userId).toBe('user-1')
      expect(strategies[0].name).toBe('Strategy 1')
      expect(strategies[0].entryRules).toHaveLength(1)
    })

    it('should return empty array on error', async () => {
      supabase.setResponse('strategies', { data: null, error: { message: 'DB error' } })

      const strategies = await getStrategiesByUser('user-1')
      expect(strategies).toEqual([])
    })
  })

  describe('getStrategyById', () => {
    it('should return strategy when found', async () => {
      supabase.setResponse('strategies', {
        data: {
          id: 's-1',
          user_id: 'user-1',
          name: 'Strategy 1',
          entry_rules: [],
          exit_rules: [],
          risk_rules: [],
          created_at: '2026-01-01T00:00:00Z',
          last_tested_at: null,
        },
        error: null,
      })

      const strategy = await getStrategyById('s-1', 'user-1')
      expect(strategy).not.toBeNull()
      expect(strategy?.id).toBe('s-1')
    })

    it('should return null when not found', async () => {
      supabase.setResponse('strategies', { data: null, error: { message: 'not found' } })

      const strategy = await getStrategyById('nonexistent', 'user-1')
      expect(strategy).toBeNull()
    })
  })

  describe('createStrategy', () => {
    it('should create a new strategy', async () => {
      supabase.setResponse('strategies', {
        data: {
          id: 's-new',
          user_id: 'user-1',
          name: validStrategy.name,
          entry_rules: validStrategy.entryRules,
          exit_rules: validStrategy.exitRules,
          risk_rules: validStrategy.riskRules,
          created_at: '2026-01-01T00:00:00Z',
          last_tested_at: null,
        },
        error: null,
      })

      const strategy = await createStrategy('user-1', validStrategy)
      expect(strategy.id).toBe('s-new')
      expect(strategy.name).toBe(validStrategy.name)
    })

    it('should throw on invalid data', async () => {
      await expect(
        createStrategy('user-1', { ...validStrategy, name: '' })
      ).rejects.toThrow()
    })
  })

  describe('updateStrategy', () => {
    it('should update an existing strategy', async () => {
      supabase.setResponse('strategies', {
        data: {
          id: 's-1',
          user_id: 'user-1',
          name: 'Updated Name',
          entry_rules: validStrategy.entryRules,
          exit_rules: validStrategy.exitRules,
          risk_rules: validStrategy.riskRules,
          created_at: '2026-01-01T00:00:00Z',
          last_tested_at: null,
        },
        error: null,
      })

      const strategy = await updateStrategy('s-1', 'user-1', { name: 'Updated Name' })
      expect(strategy.name).toBe('Updated Name')
    })
  })

  describe('deleteStrategy', () => {
    it('should delete without error', async () => {
      supabase.setResponse('strategies', { data: null, error: null })

      await expect(deleteStrategy('s-1', 'user-1')).resolves.toBeUndefined()
    })
  })
})
