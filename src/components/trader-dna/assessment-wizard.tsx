'use client';

import { useState } from 'react';
import { 
  AnswerMap, 
  SectionKey, 
  TraderProfile,
  PROFILE_TYPE_NAMES
} from '@/types/trader-dna';
import { questions, sectionKeys, sections } from '@/data/trader-dna/questions';
import { calculateProfile } from '@/data/trader-dna/scoring';
import { ProgressBar } from './progress-bar';
import { QuestionCard } from './question-card';
import { ProfileSummary } from './profile-summary';
import { saveTraderProfile } from '@/lib/trader-profile';

export function AssessmentWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [isComplete, setIsComplete] = useState(false);
  const [profile, setProfile] = useState<TraderProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const currentSection: SectionKey = sectionKeys[currentStep];
  const sectionQuestions = questions.filter(q => q.section === currentSection);
  const sectionInfo = sections[currentSection];

  // Check if all questions in current section are answered
  const isSectionComplete = (): boolean => {
    return sectionQuestions.every(q => answers[q.id] !== undefined);
  };

  // Handle answer change
  const handleAnswer = (questionId: string, value: number | string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Handle next section
  const handleNext = async () => {
    if (!isSectionComplete()) return;

    if (currentStep < sectionKeys.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step - calculate profile
      const calculatedProfile = calculateProfile(answers);
      setProfile(calculatedProfile);
      setIsComplete(true);

      // Save profile to database
      setSaving(true);
      try {
        await saveTraderProfile(calculatedProfile);
        setSaveError(null);
      } catch (error) {
        console.error('Failed to save profile:', error);
        setSaveError('Profile generated but could not be saved. Your results are still available.');
      } finally {
        setSaving(false);
      }
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Show profile summary if complete
  if (isComplete && profile) {
    return (
      <div className="max-w-2xl mx-auto">
        {saveError && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">{saveError}</p>
          </div>
        )}
        <ProfileSummary profile={profile} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress bar */}
      <ProgressBar 
        current={currentStep + 1}
        total={sectionKeys.length}
        sectionName={sectionInfo.title}
      />

      {/* Section description */}
      <div className="bg-[#F5F7FA] rounded-lg p-4">
        <p className="text-sm text-[#616161]">
          {sectionInfo.description}
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {sectionQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            value={answers[question.id]}
            onChange={(value) => handleAnswer(question.id, value)}
            questionNumber={index + 1}
            totalQuestions={sectionQuestions.length}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E0E0E0]">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`
            px-6 py-3 rounded-lg font-medium transition-all
            ${currentStep === 0 
              ? 'text-[#BDBDBD] cursor-not-allowed' 
              : 'text-[#616161] hover:bg-[#F5F7FA] border border-[#E0E0E0]'
            }
          `}
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!isSectionComplete() || saving}
          className={`
            px-8 py-3 rounded-lg font-medium transition-all
            ${!isSectionComplete() || saving
              ? 'bg-[#E0E0E0] text-[#9E9E9E] cursor-not-allowed'
              : 'bg-[#E53935] text-white hover:bg-[#D32F2F]'
            }
          `}
        >
          {saving 
            ? 'Saving...' 
            : currentStep === sectionKeys.length - 1 
              ? 'Generate Profile' 
              : 'Next Section →'
          }
        </button>
      </div>

      {/* Section completion hint */}
      {!isSectionComplete() && (
        <p className="text-center text-sm text-[#9E9E9E]">
          Answer all {sectionQuestions.length} questions to continue
        </p>
      )}
    </div>
  );
}