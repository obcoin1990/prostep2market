'use client';

import { AssessmentQuestion } from '@/types/trader-dna';

interface ScenarioSelectionProps {
  question: AssessmentQuestion;
  value: number | string | undefined;
  onChange: (value: number | string) => void;
}

export function ScenarioSelection({ question, value, onChange }: ScenarioSelectionProps) {
  return (
    <div className="space-y-3">
      {question.options.map((option, index) => {
        const isSelected = value === option.value;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              w-full text-left p-4 rounded-lg border-2 transition-all
              ${isSelected 
                ? 'border-[#E53935] bg-[#E53935]/5' 
                : 'border-[#E0E0E0] bg-white hover:border-[#E53935]/50'
              }
            `}
            aria-pressed={isSelected}
          >
            <div className="flex items-start gap-3">
              <div className={`
                w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0
                ${isSelected ? 'border-[#E53935] bg-[#E53935]' : 'border-[#BDBDBD]'}
              `}>
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${isSelected ? 'text-[#E53935]' : 'text-[#0B0B0B]'}`}>
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-sm text-[#616161] mt-1">{option.description}</div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}