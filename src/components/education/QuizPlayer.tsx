'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { QuizResults } from './QuizResults';

const quizSchema = z.object({
  answers: z.record(z.string(), z.number().min(0)),
});

type QuizFormData = z.infer<typeof quizSchema>;

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
}

interface QuizPlayerProps {
  quizId: string;
  passingScore: number;
  maxAttempts: number;
}

export function QuizPlayer({ quizId, passingScore, maxAttempts }: QuizPlayerProps) {
  const [quiz, setQuiz] = useState<{
    id: string;
    courseId: string;
    passingScore: number;
    maxAttempts: number;
    questions: QuizQuestion[];
    attempts: number;
    previousScore: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    score: number;
    passed: boolean;
    results: Record<string, { correct: boolean; correctIndex: number; explanation?: string }>;
  } | null>(null);

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      answers: {},
    },
  });

  const { watch, handleSubmit, formState: { errors } } = form;
  const answers = watch('answers');
  
  const answeredCount = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== null).length;

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await fetch(`/api/quiz?quizId=${quizId}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to load quiz');
        }
        const data = await response.json();
        setQuiz(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [quizId]);

  const onSubmit = async (data: QuizFormData) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId,
          answers: data.answers,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit quiz');
      }

      const resultData = await response.json();
      setResults({
        score: resultData.score,
        passed: resultData.passed,
        results: resultData.results,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!quiz) return null;

  if (results) {
    return (
      <QuizResults
        score={results.score}
        passed={results.passed}
        passingScore={passingScore}
        results={results.results}
        questions={quiz.questions}
        maxAttempts={maxAttempts}
        attempts={quiz.attempts + 1}
        onRetry={() => setResults(null)}
        courseId={quiz.courseId}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Quiz Header */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Course Quiz</h2>
            <p className="text-sm text-muted-foreground">
              {quiz.questions.length} questions • {passingScore}% to pass
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>{answeredCount} of {quiz.questions.length} answered</div>
            {quiz.attempts > 0 && (
              <div>Attempt {quiz.attempts + 1} of {maxAttempts}</div>
            )}
          </div>
        </div>
        {quiz.previousScore !== null && (
          <div className="mt-3 p-2 bg-muted rounded text-sm">
            Previous score: {quiz.previousScore}%
          </div>
        )}
      </div>

      {/* Questions */}
      {quiz.questions.map((question, qIndex) => (
        <div key={question.id} className="rounded-lg border bg-card p-6">
          <p className="font-medium mb-4">
            {qIndex + 1}. {question.text}
          </p>
          <div className="space-y-2">
            {question.options.map((option, oIndex) => (
              <label
                key={oIndex}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                  answers[question.id] === oIndex ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <input
                  type="radio"
                  value={oIndex}
                  {...form.register(`answers.${question.id}`)}
                  className="h-4 w-4 text-primary"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {errors.answers?.[question.id] && (
            <p className="text-sm text-destructive mt-2">
              Please select an answer
            </p>
          )}
        </div>
      ))}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || answeredCount < quiz.questions.length}
        className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : `Submit Quiz (${answeredCount}/${quiz.questions.length})`}
      </button>

      {answeredCount < quiz.questions.length && (
        <p className="text-sm text-muted-foreground text-center">
          Answer all questions to submit
        </p>
      )}
    </form>
  );
}