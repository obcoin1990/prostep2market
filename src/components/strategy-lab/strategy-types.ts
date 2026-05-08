import { z } from 'zod';

export const strategySchema = z.object({
  name: z.string().min(1, 'Strategy name is required').max(100),
  entryRules: z.array(z.object({
    condition: z.enum(['price_above', 'price_below', 'ma_cross', 'rsi_above', 'rsi_below', 'custom']),
    value: z.string().min(1),
    timeframes: z.array(z.enum(['M5', 'M15', 'H1', 'H4', 'D1'])).min(1),
  })).min(1, 'At least one entry rule is required'),
  exitRules: z.array(z.object({
    type: z.enum(['tp', 'sl', 'trailing', 'time']),
    value: z.number().positive(),
    unit: z.enum(['pips', 'percent', 'atr']),
  })).min(1, 'At least one exit rule is required'),
  riskRules: z.array(z.object({
    type: z.enum(['fixed_lot', 'percent_balance', 'kelly', 'atr_based']),
    value: z.number().positive(),
    maxDrawdownPercent: z.number().min(0).max(100),
  })).min(1, 'At least one risk rule is required'),
});

export type StrategyFormData = z.infer<typeof strategySchema>;