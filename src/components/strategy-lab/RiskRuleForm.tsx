'use client';

import { Control, Controller, FieldValues } from 'react-hook-form';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { StrategyFormData } from './strategy-types';

interface RiskRuleFormProps {
  index: number;
  control: Control<StrategyFormData, FieldValues>;
  onRemove: () => void;
}

const typeOptions = [
  { value: 'fixed_lot', label: 'Fixed Lot Size' },
  { value: 'percent_balance', label: '% of Balance' },
  { value: 'kelly', label: 'Kelly Criterion' },
  { value: 'atr_based', label: 'ATR-based Position Sizing' },
];

export function RiskRuleForm({ index, control, onRemove }: RiskRuleFormProps) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 grid gap-4 sm:grid-cols-3">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Controller
              name={`riskRules.${index}.type`}
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 rounded-lg border bg-background"
                >
                  {typeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            <Controller
              name={`riskRules.${index}.value`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  step="0.1"
                  placeholder="e.g., 2.0"
                  className="w-full px-3 py-2 rounded-lg border bg-background"
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  value={field.value || ''}
                />
              )}
            />
          </div>

          {/* Max Drawdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Max Drawdown %</label>
            <Controller
              name={`riskRules.${index}.maxDrawdownPercent`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 10"
                  className="w-full px-3 py-2 rounded-lg border bg-background"
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  value={field.value || ''}
                />
              )}
            />
          </div>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Drawdown Warning */}
      <div className="mt-2">
        <Controller
          name={`riskRules.${index}.maxDrawdownPercent`}
          control={control}
          render={({ field }) => {
            const drawdown = field.value || 0;
            if (drawdown > 20) {
              return (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>High drawdown risk! Consider reducing below 20%.</span>
                </div>
              );
            }
            return <></>;
          }}
        />
      </div>
    </div>
  );
}