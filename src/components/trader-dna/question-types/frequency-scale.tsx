'use client';

import { AssessmentQuestion } from '@/types/trader-dna';

interface FrequencyScaleProps {
  question: AssessmentQuestion;
  value: number | string | undefined;
  onChange: (value: number | string) => void;
}

const FREQUENCY_LABELS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];

export function FrequencyScale({ question, value, onChange }: FrequencyScaleProps) {
  const selectedValue = typeof value === 'number' ? value : value ? parseInt(value as string) : undefined;

  return (
    <div className="space-y-3">
      {/* Scale buttons */}
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((freq) => {
          const isSelected = selectedValue === freq;
          return (
            <button
              key={freq}
              type="button"
              onClick={() => onChange(freq)}
              className={`
                py-3 px-2 rounded-lg border-2 font-medium text-sm transition-all
                ${isSelected 
                  ? 'border-[#E53935] bg-[#E53935] text-white' 
                  : 'border-[#E0E0E0] bg-white text-[#616161] hover:border-[#E53935]/50'
                }
              `}
              aria-pressed={isSelected}
              aria-label={FREQUENCY_LABELS[freq - 1]}
            >
              {FREQUENCY_LABELS[freq - 1]}
            </button>
          );
        })}
      </div>

      {/* Progress indicator */}
      {selectedValue && (
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#E53935] transition-all duration-300"
              style={{ width: `${(selectedValue / 5) * 100}%` }}
            />
          </div>
          <span className="text-xs text-[#757575]">
            {selectedValue}/5
          </span>
        </div>
      )}
    </div>
  );
}