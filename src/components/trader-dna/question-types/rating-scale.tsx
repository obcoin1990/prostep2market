'use client';

import { AssessmentQuestion } from '@/types/trader-dna';

interface RatingScaleProps {
  question: AssessmentQuestion;
  value: number | string | undefined;
  onChange: (value: number | string) => void;
}

const RATING_LABELS = ['Very Low', 'Low', 'Neutral', 'High', 'Very High'];

export function RatingScale({ question, value, onChange }: RatingScaleProps) {
  const selectedValue = typeof value === 'number' ? value : value ? parseInt(value as string) : undefined;

  return (
    <div className="space-y-4">
      {/* Rating buttons */}
      <div className="flex justify-between gap-2">
        {[1, 2, 3, 4, 5].map((rating) => {
          const isSelected = selectedValue === rating;
          return (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              className={`
                flex-1 py-3 px-2 rounded-lg border-2 font-medium transition-all
                ${isSelected 
                  ? 'border-[#E53935] bg-[#E53935] text-white' 
                  : 'border-[#E0E0E0] bg-white text-[#616161] hover:border-[#E53935]/50'
                }
              `}
              aria-pressed={isSelected}
              aria-label={`Rating ${rating}: ${RATING_LABELS[rating - 1]}`}
            >
              {rating}
            </button>
          );
        })}
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-xs text-[#757575] px-1">
        <span>Very Low</span>
        <span>Very High</span>
      </div>

      {/* Description if available */}
      {selectedValue && (
        <div className="text-center text-sm text-[#E53935] font-medium mt-2">
          {RATING_LABELS[selectedValue - 1]}
        </div>
      )}
    </div>
  );
}