// Strategy Lab Builder - CRUD operations
import { createClient } from '@/lib/supabase/client';
import { Strategy, StrategyRow, EntryRule, ExitRule, RiskRule } from '@/types/strategy-lab';
import { z } from 'zod';

// Zod validation schemas
export const entryRuleValidation = z.object({
  condition: z.enum(['price_above', 'price_below', 'ma_cross', 'rsi_above', 'rsi_below', 'custom']),
  value: z.string().min(1),
  timeframes: z.array(z.enum(['M5', 'M15', 'H1', 'H4', 'D1'])).min(1),
});

export const exitRuleValidation = z.object({
  type: z.enum(['tp', 'sl', 'trailing', 'time']),
  value: z.number().positive(),
  unit: z.enum(['pips', 'percent', 'atr']),
});

export const riskRuleValidation = z.object({
  type: z.enum(['fixed_lot', 'percent_balance', 'kelly', 'atr_based']),
  value: z.number().positive(),
  maxDrawdownPercent: z.number().min(0).max(100),
});

export const strategyValidation = z.object({
  name: z.string().min(1, 'Strategy name is required').max(100),
  entryRules: z.array(entryRuleValidation).min(1, 'At least one entry rule is required'),
  exitRules: z.array(exitRuleValidation).min(1, 'At least one exit rule is required'),
  riskRules: z.array(riskRuleValidation).min(1, 'At least one risk rule is required'),
});

export type StrategyFormData = z.infer<typeof strategyValidation>;

export async function getStrategiesByUser(userId: string): Promise<Strategy[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('strategies')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching strategies:', error);
    return [];
  }

  return (data || []).map(mapStrategyRow);
}

export async function getStrategyById(strategyId: string, userId: string): Promise<Strategy | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('strategies')
    .select('*')
    .eq('id', strategyId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return mapStrategyRow(data);
}

export async function createStrategy(userId: string, data: StrategyFormData): Promise<Strategy> {
  const supabase = createClient();
  
  // Validate data
  const validated = strategyValidation.parse(data);

  const { data: result, error } = await supabase
    .from('strategies')
    .insert({
      user_id: userId,
      name: validated.name,
      entry_rules: validated.entryRules,
      exit_rules: validated.exitRules,
      risk_rules: validated.riskRules,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating strategy:', error);
    throw error;
  }

  return mapStrategyRow(result);
}

export async function updateStrategy(
  strategyId: string, 
  userId: string, 
  data: Partial<StrategyFormData>
): Promise<Strategy> {
  const supabase = createClient();
  
  // Validate partial data
  const validated = strategyValidation.partial().parse(data);

  const updateData: any = {};
  if (validated.name !== undefined) updateData.name = validated.name;
  if (validated.entryRules !== undefined) updateData.entry_rules = validated.entryRules;
  if (validated.exitRules !== undefined) updateData.exit_rules = validated.exitRules;
  if (validated.riskRules !== undefined) updateData.risk_rules = validated.riskRules;

  const { data: result, error } = await supabase
    .from('strategies')
    .update(updateData)
    .eq('id', strategyId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating strategy:', error);
    throw error;
  }

  return mapStrategyRow(result);
}

export async function deleteStrategy(strategyId: string, userId: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('strategies')
    .delete()
    .eq('id', strategyId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting strategy:', error);
    throw error;
  }
}

export function validateStrategy(data: unknown): { success: boolean; errors?: string[] } {
  try {
    strategyValidation.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`) 
      };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

function mapStrategyRow(row: StrategyRow): Strategy {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    entryRules: row.entry_rules || [],
    exitRules: row.exit_rules || [],
    riskRules: row.risk_rules || [],
    createdAt: new Date(row.created_at),
    lastTestedAt: row.last_tested_at ? new Date(row.last_tested_at) : undefined,
  };
}