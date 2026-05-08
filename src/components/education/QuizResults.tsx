'use client';

import Link from 'next/link';
import { CheckCircle, XCircle, RefreshCw, Download, ArrowRight } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  passed: boolean;
  passingScore: number;
  results: Record<string, { correct: boolean; correctIndex: number; explanation?: string }>;
  questions: Array<{ id: string; text: string; options: string[] }>;
  maxAttempts: number;
  attempts: number;
  onRetry: () => void;
  courseId: string;
}

export function QuizResults({
  score,
  passed,
  passingScore,
  results,
  questions,
  maxAttempts,
  attempts,
  onRetry,
  courseId,
}: QuizResultsProps) {
  const hasAttemptsLeft = attempts < maxAttempts;

  return (
    <div className="space-y-8">
      {/* Score Display */}
      <div className={`rounded-lg border p-8 text-center ${
        passed 
          ? 'bg-green-500/10 border-green-500/20' 
          : 'bg-red-500/10 border-red-500/20'
      }`}>
        <div className="mb-4">
          {passed ? (
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
          )}
        </div>
        
        <div className={`text-5xl font-bold mb-2 ${
          passed ? 'text-green-500' : 'text-red-500'
        }`}>
          {score}%
        </div>
        
        <div className="text-lg mb-4">
          {passed ? 'Congratulations! You passed!' : 'Keep trying! You can do this.'}
        </div>
        
        <div className="text-sm text-muted-foreground">
          Passing score: {passingScore}% • Attempt {attempts} of {maxAttempts}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {passed ? (
          <>
            <Link
              href={`/education/certificates`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              View Certificate
            </Link>
            <Link
              href={`/education/${courseId.split('-')[0]}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent"
            >
              Back to Course
              <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        ) : hasAttemptsLeft ? (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">You've used all attempts</p>
            <Link
              href={`/education`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-accent"
            >
              Back to Education Hub
            </Link>
          </div>
        )}
      </div>

      {/* Question Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Question Results</h3>
        
        {questions.map((question, qIndex) => {
          const result = results[question.id];
          const isCorrect = result?.correct;
          const correctIndex = result?.correctIndex;
          
          return (
            <div 
              key={question.id} 
              className={`rounded-lg border p-4 ${
                isCorrect 
                  ? 'bg-green-500/5 border-green-500/20' 
                  : 'bg-red-500/5 border-red-500/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium mb-2">
                    {qIndex + 1}. {question.text}
                  </p>
                  
                  {/* Show user's answer */}
                  {result && !isCorrect && (
                    <div className="text-sm mb-2">
                      <span className="text-red-500">Your answer: </span>
                      <span className="text-muted-foreground">
                        {question.options[result.correctIndex ?? 0]}
                      </span>
                    </div>
                  )}
                  
                  {/* Show correct answer */}
                  <div className="text-sm mb-2">
                    <span className="text-green-500">Correct answer: </span>
                    <span className="text-muted-foreground">
                      {question.options[correctIndex || 0]}
                    </span>
                  </div>
                  
                  {/* Show explanation */}
                  {result?.explanation && (
                    <div className="text-sm p-3 bg-muted rounded mt-2">
                      <span className="font-medium">Explanation: </span>
                      <span className="text-muted-foreground">{result.explanation}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to extract answers from results
function answersFromResults(results: Record<string, { correct: boolean; correctIndex: number; explanation?: string }>) {
  const answers: Record<string, number> = {};
  Object.keys(results).forEach(key => {
    answers[key] = results[key].correctIndex;
  });
  return answers;
}