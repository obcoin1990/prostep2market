'use client';

import { AssessmentQuestion } from '@/types/trader-dna';

interface MultipleChoiceProps {
  question: AssessmentQuestion;
  value: number | string | undefined;
  onChange: (value: number | string) => void;
}

export function MultipleChoice({ question, value, onChange }: MultipleChoiceProps) {
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
                ? 'border-[#E53935] bg-[#E53935]/5 text-[#0B0B0B]' 
                : 'border-[#E0E0E0] bg-white hover:border-[#E53935]/50 text-[#0B0B0B]'
              }
            `}
            aria-pressed={isSelected}
            aria-label={`Select: ${option.label}`}
          >
            <div className="flex items-start gap-3">
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                ${isSelected ? 'border-[#E53935] bg-[#E53935]' : 'border-[#BDBDBD]'}
              `}>
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
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