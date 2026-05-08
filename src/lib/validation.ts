import { z } from 'zod'

// Session enum
const sessionEnum = z.enum(['asian', 'london', 'newyork', 'sydney'])

// Emotional state enum
const emotionalStateEnum = z.enum(['calm', 'excited', 'frustrated', 'fearful', 'greedy'])

// Common triggers
const triggersArray = z.array(z.enum([
  'FOMO',
  'revenge',
  'overconfidence',
  'boredom',
  'fatigue',
  'news',
  'signal',
  'other'
]))

/**
 * Trade schema for manual entry validation
 */
export const tradeSchema = z.object({
  symbol: z.string()
    .min(1, 'Symbol is required')
    .max(10, 'Symbol too long'),
  entryPrice: z.number('Entry price must be a number').positive('Entry price must be positive'),
  exitPrice: z.number('Exit price must be a number').positive('Exit price must be positive').optional().nullable(),
  stopLoss: z.number('Stop loss must be a number').positive('Stop loss must be positive'),
  takeProfit: z.number('Take profit must be a number').positive('Take profit must be positive'),
  lotSize: z.number('Lot size must be a number').positive('Lot size must be positive').min(0.01, 'Minimum lot size is 0.01'),
  entryTime: z.string().datetime({ message: 'Entry time is required' }),
  exitTime: z.string().datetime().optional().nullable(),
  session: sessionEnum.optional().nullable(),
  screenshotUrl: z.string().url().optional().or(z.literal('')).nullable(),
  confidenceScore: z.number().min(1).max(5).optional().nullable(),
  stressScore: z.number().min(1).max(5).optional().nullable(),
  emotionalState: emotionalStateEnum.optional().nullable(),
  triggers: triggersArray.optional().nullable(),
  preTradePlanAdherence: z.number().min(1).max(5).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
})

/**
 * CSV row schema (flat structure from CSV)
 */
export const csvRowSchema = z.object({
  symbol: z.string().min(1),
  entry_price: z.string(),
  exit_price: z.string().optional(),
  stop_loss: z.string(),
  take_profit: z.string(),
  lot_size: z.string(),
  entry_time: z.string(),
  exit_time: z.string().optional(),
  session: z.string().optional(),
})

// Type exports
export type TradeInput = z.infer<typeof tradeSchema>
export type CsvRowInput = z.infer<typeof csvRowSchema>

/**
 * Helper to format validation errors
 */
export function formatValidationErrors(error: z.ZodError): string[] {
  return error.issues.map(issue => 
    `${issue.path.join('.')}: ${issue.message}`
  )
}