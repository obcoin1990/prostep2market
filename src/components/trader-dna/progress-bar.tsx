'use client';

interface ProgressBarProps {
  current: number; // 1-5
  total: number;
  sectionName: string;
}

export function ProgressBar({ current, total, sectionName }: ProgressBarProps) {
  const progressPercentage = (current / total) * 100;

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 shadow-sm">
      {/* Header with section name and percentage */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-medium text-[#9E9E9E] uppercase tracking-wide">
            Section {current} of {total}
          </span>
          <h2 className="text-lg font-semibold text-[#0B0B0B] mt-1">
            {sectionName}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-[#E53935]">{Math.round(progressPercentage)}%</span>
          <span className="text-xs text-[#9E9E9E] block">Complete</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#E53935] to-[#FF6B6B] transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mt-2">
          {Array.from({ length: total }, (_, i) => {
            const stepNumber = i + 1;
            const isCompleted = stepNumber < current;
            const isCurrent = stepNumber === current;
            
            return (
              <div 
                key={stepNumber}
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all
                  ${isCompleted 
                    ? 'bg-[#E53935] text-white' 
                    : isCurrent 
                      ? 'bg-[#E53935]/20 text-[#E53935] border-2 border-[#E53935]' 
                      : 'bg-[#E0E0E0] text-[#9E9E9E]'
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}