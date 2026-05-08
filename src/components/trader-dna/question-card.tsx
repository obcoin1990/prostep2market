'use client';

import { AssessmentQuestion } from '@/types/trader-dna';
import { MultipleChoice } from './question-types/multiple-choice';
import { RatingScale } from './question-types/rating-scale';
import { ScenarioSelection } from './question-types/scenario-selection';
import { FrequencyScale } from './question-types/frequency-scale';

interface QuestionCardProps {
  question: AssessmentQuestion;
  value: number | string | undefined;
  onChange: (value: number | string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({ question, value, onChange, questionNumber, totalQuestions }: QuestionCardProps) {
  const renderQuestionType = () => {
    switch (question.type) {
      case 'multiple_choice':
        return <MultipleChoice question={question} value={value} onChange={onChange} />;
      case 'rating':
        return <RatingScale question={question} value={value} onChange={onChange} />;
      case 'scenario':
        return <ScenarioSelection question={question} value={value} onChange={onChange} />;
      case 'frequency':
        return <FrequencyScale question={question} value={value} onChange={onChange} />;
      default:
        return <p className="text-red-500">Unknown question type</p>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm">
      {/* Question header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#E53935] uppercase tracking-wide">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-xs text-[#9E9E9E] capitalize">
            {question.type.replace('_', ' ')}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-[#0B0B0B] leading-relaxed">
          {question.question}
        </h3>
      </div>

      {/* Question options */}
      <div className="mt-4">
        {renderQuestionType()}
      </div>

      {/* Selection indicator */}
      {value !== undefined && (
        <div className="mt-4 pt-4 border-t border-[#F5F5F5]">
          <div className="flex items-center gap-2 text-sm text-[#2E7D32]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Selection recorded</span>
          </div>
        </div>
      )}
    </div>
  );
}