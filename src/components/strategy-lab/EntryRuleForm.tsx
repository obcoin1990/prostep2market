'use client';

import { Control, Controller, FieldValues } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { StrategyFormData } from './strategy-types';

interface EntryRuleFormProps {
  index: number;
  control: Control<StrategyFormData, FieldValues>;
  onRemove: () => void;
}

const conditionOptions = [
  { value: 'price_above', label: 'Price Above' },
  { value: 'price_below', label: 'Price Below' },
  { value: 'ma_cross', label: 'MA Cross' },
  { value: 'rsi_above', label: 'RSI Above' },
  { value: 'rsi_below', label: 'RSI Below' },
  { value: 'custom', label: 'Custom' },
];

const timeframeOptions = ['M5', 'M15', 'H1', 'H4', 'D1'] as const;

export function EntryRuleForm({ index, control, onRemove }: EntryRuleFormProps) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 grid gap-4 sm:grid-cols-3">
          {/* Condition */}
          <div>
            <label className="block text-sm font-medium mb-1">Condition</label>
            <Controller
              name={`entryRules.${index}.condition`}
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 rounded-lg border bg-background"
                >
                  {conditionOptions.map((opt) => (
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
              name={`entryRules.${index}.value`}
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="e.g., 1.1000, 50, 14"
                  className="w-full px-3 py-2 rounded-lg border bg-background"
                />
              )}
            />
          </div>

          {/* Timeframes */}
          <div>
            <label className="block text-sm font-medium mb-1">Timeframes</label>
            <Controller
              name={`entryRules.${index}.timeframes`}
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {timeframeOptions.map((tf) => (
                    <label key={tf} className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={field.value?.includes(tf)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...(field.value || []), tf]
                            : field.value?.filter((t: string) => t !== tf) || [];
                          field.onChange(newValue);
                        }}
                        className="rounded"
                      />
                      {tf}
                    </label>
                  ))}
                </div>
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
    </div>
  );
}