'use client';

import { Control, Controller, FieldValues } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { StrategyFormData } from './strategy-types';

interface ExitRuleFormProps {
  index: number;
  control: Control<StrategyFormData, FieldValues>;
  onRemove: () => void;
}

const typeOptions = [
  { value: 'tp', label: 'Take Profit' },
  { value: 'sl', label: 'Stop Loss' },
  { value: 'trailing', label: 'Trailing Stop' },
  { value: 'time', label: 'Time-based Exit' },
];

const unitOptions = [
  { value: 'pips', label: 'Pips' },
  { value: 'percent', label: 'Percent' },
  { value: 'atr', label: 'ATR' },
];

export function ExitRuleForm({ index, control, onRemove }: ExitRuleFormProps) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 grid gap-4 sm:grid-cols-3">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Controller
              name={`exitRules.${index}.type`}
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
              name={`exitRules.${index}.value`}
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

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <Controller
              name={`exitRules.${index}.unit`}
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 rounded-lg border bg-background"
                >
                  {unitOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
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
      
      {/* Preview */}
      <div className="mt-2 text-sm text-muted-foreground">
        <Controller
          name={`exitRules.${index}.type`}
          control={control}
          render={({ field: typeField }) => (
            <Controller
              name={`exitRules.${index}.value`}
              control={control}
              render={({ field: valueField }) => (
                <Controller
                  name={`exitRules.${index}.unit`}
                  control={control}
                  render={({ field: unitField }) => {
                    const typeLabel = typeOptions.find(o => o.value === typeField.value)?.label || '';
                    return (
                      <span>
                        {typeLabel}: {valueField.value || 0} {unitField.value || ''}
                      </span>
                    );
                  }}
                />
              )}
            />
          )}
        />
      </div>
    </div>
  );
}