'use client';

import { useForm, useFieldArray, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EntryRuleForm } from './EntryRuleForm';
import { ExitRuleForm } from './ExitRuleForm';
import { RiskRuleForm } from './RiskRuleForm';
import { useState } from 'react';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

const strategySchema = z.object({
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

interface StrategyBuilderProps {
  initialData?: StrategyFormData;
  onSubmit: (data: StrategyFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function StrategyBuilder({ 
  initialData, 
  onSubmit, 
  onCancel,
  isLoading = false 
}: StrategyBuilderProps) {
  const [showValidation, setShowValidation] = useState(false);
  
  const form = useForm<StrategyFormData, FieldValues>({
    resolver: zodResolver(strategySchema),
    defaultValues: initialData || {
      name: '',
      entryRules: [],
      exitRules: [],
      riskRules: [],
    },
  });

  const { 
    register, 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = form;

  const entryFieldArray = useFieldArray({ control, name: 'entryRules' });
  const exitFieldArray = useFieldArray({ control, name: 'exitRules' });
  const riskFieldArray = useFieldArray({ control, name: 'riskRules' });

  const onFormSubmit = async (data: StrategyFormData) => {
    setShowValidation(true);
    await onSubmit(data);
  };

  const totalRules = 
    entryFieldArray.fields.length + 
    exitFieldArray.fields.length + 
    riskFieldArray.fields.length;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Strategy Name */}
      <div className="rounded-lg border bg-card p-6">
        <label className="block text-sm font-medium mb-2">
          Strategy Name
        </label>
        <input
          {...register('name')}
          type="text"
          placeholder="Enter a name for your strategy"
          className="w-full px-3 py-2 rounded-lg border bg-background"
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Entry Rules */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Entry Rules</h3>
          <button
            type="button"
            onClick={() => entryFieldArray.append({
              condition: 'price_above',
              value: '',
              timeframes: ['H1'],
            })}
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
          >
            <Plus className="h-4 w-4" />
            Add Rule
          </button>
        </div>

        {entryFieldArray.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No entry rules. Add at least one entry rule.
          </p>
        ) : (
          <div className="space-y-4">
            {entryFieldArray.fields.map((field, index) => (
              <EntryRuleForm
                key={field.id}
                index={index}
                control={control}
                onRemove={() => entryFieldArray.remove(index)}
              />
            ))}
          </div>
        )}
        {showValidation && errors.entryRules && (
          <p className="text-sm text-destructive mt-2">{errors.entryRules.message}</p>
        )}
      </div>

      {/* Exit Rules */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Exit Rules</h3>
          <button
            type="button"
            onClick={() => exitFieldArray.append({
              type: 'tp',
              value: 2,
              unit: 'percent',
            })}
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
          >
            <Plus className="h-4 w-4" />
            Add Rule
          </button>
        </div>

        {exitFieldArray.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No exit rules. Add at least one exit rule.
          </p>
        ) : (
          <div className="space-y-4">
            {exitFieldArray.fields.map((field, index) => (
              <ExitRuleForm
                key={field.id}
                index={index}
                control={control}
                onRemove={() => exitFieldArray.remove(index)}
              />
            ))}
          </div>
        )}
        {showValidation && errors.exitRules && (
          <p className="text-sm text-destructive mt-2">{errors.exitRules.message}</p>
        )}
      </div>

      {/* Risk Rules */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Risk Rules</h3>
          <button
            type="button"
            onClick={() => riskFieldArray.append({
              type: 'percent_balance',
              value: 2,
              maxDrawdownPercent: 10,
            })}
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
          >
            <Plus className="h-4 w-4" />
            Add Rule
          </button>
        </div>

        {riskFieldArray.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No risk rules. Add at least one risk rule.
          </p>
        ) : (
          <div className="space-y-4">
            {riskFieldArray.fields.map((field, index) => (
              <RiskRuleForm
                key={field.id}
                index={index}
                control={control}
                onRemove={() => riskFieldArray.remove(index)}
              />
            ))}
          </div>
        )}
        {showValidation && errors.riskRules && (
          <p className="text-sm text-destructive mt-2">{errors.riskRules.message}</p>
        )}
      </div>

      {/* Strategy Preview */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-4">Strategy Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{entryFieldArray.fields.length}</div>
            <div className="text-sm text-muted-foreground">Entry Rules</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{exitFieldArray.fields.length}</div>
            <div className="text-sm text-muted-foreground">Exit Rules</div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{riskFieldArray.fields.length}</div>
            <div className="text-sm text-muted-foreground">Risk Rules</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Strategy'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 rounded-lg border hover:bg-accent"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}