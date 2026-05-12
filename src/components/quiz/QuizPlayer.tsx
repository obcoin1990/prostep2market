'use client'

import { useState, useCallback } from 'react'
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft, Clock, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────────────────────────

interface Option {
  id:    string
  text:  string
  order: number
}

interface Question {
  id:      string
  text:    string
  type:    'SINGLE' | 'MULTIPLE' | 'TRUE_FALSE'
  order:   number
  options: Option[]
}

interface Quiz {
  id:         string
  title:      string
  passMark:   number
  maxAttempts: number
  questions:  Question[]
}

interface AttemptResult {
  score:        number
  passed:       boolean
  passMark:     number
  correct:      number
  total:        number
  attemptsUsed: number
  maxAttempts:  number
  feedback:     Record<string, {
    correct:           boolean
    correctOptionIds:  string[]
    selectedOptionIds: string[]
  }>
}

interface Props {
  quiz:              Quiz
  attemptsUsed:      number
  onComplete?:       (result: AttemptResult) => void
}

// ── Component ────────────────────────────────────────────────────────────────

export function QuizPlayer({ quiz, attemptsUsed, onComplete }: Props) {
  // answers: { questionId → Set<optionId> }
  const [answers, setAnswers]     = useState<Record<string, Set<string>>>({})
  const [current, setCurrent]     = useState(0)
  const [result, setResult]       = useState<AttemptResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')

  const question  = quiz.questions[current]
  const total     = quiz.questions.length
  const remaining = quiz.maxAttempts - attemptsUsed

  // Toggle option selection
  const toggleOption = useCallback((questionId: string, optionId: string, isSingle: boolean) => {
    setAnswers(prev => {
      const current = prev[questionId] ? new Set(prev[questionId]) : new Set<string>()
      if (isSingle) {
        return { ...prev, [questionId]: new Set([optionId]) }
      }
      if (current.has(optionId)) {
        current.delete(optionId)
      } else {
        current.add(optionId)
      }
      return { ...prev, [questionId]: current }
    })
  }, [])

  const isSelected = (questionId: string, optionId: string) =>
    answers[questionId]?.has(optionId) ?? false

  const isAnswered = (questionId: string) =>
    (answers[questionId]?.size ?? 0) > 0

  const allAnswered = quiz.questions.every(q => isAnswered(q.id))

  async function handleSubmit() {
    if (!allAnswered) return
    setSubmitting(true)
    setError('')
    try {
      const payload: Record<string, string[]> = {}
      for (const [qId, opts] of Object.entries(answers)) {
        payload[qId] = [...opts]
      }

      const res = await fetch(`/api/quizzes/${quiz.id}/attempt`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ answers: payload }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Submission failed')
        return
      }
      setResult(json.data)
      onComplete?.(json.data)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleRetry() {
    setAnswers({})
    setCurrent(0)
    setResult(null)
    setError('')
  }

  // ── Result screen ──────────────────────────────────────────────────────────
  if (result) {
    return (
      <QuizResults
        result={result}
        questions={quiz.questions}
        onRetry={result.attemptsUsed < result.maxAttempts ? handleRetry : undefined}
      />
    )
  }

  // ── Quiz player ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{quiz.title}</h2>
          <p className="text-xs text-gray-400">
            Pass mark: {quiz.passMark}% · {remaining} attempt{remaining !== 1 ? 's' : ''} remaining
          </p>
        </div>
        <span className="text-sm font-medium text-gray-500">
          {current + 1} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-gray-100 mb-6">
        <div
          className="h-1.5 rounded-full bg-brand-500 transition-all"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">
          Question {current + 1}
          {question.type === 'MULTIPLE' && (
            <span className="ml-2 normal-case text-brand-500">(select all that apply)</span>
          )}
        </p>
        <p className="text-lg font-semibold text-gray-900 mb-5 leading-snug">
          {question.text}
        </p>

        {/* Options */}
        <div className="space-y-2.5">
          {question.options.map(option => {
            const selected  = isSelected(question.id, option.id)
            const isSingle  = question.type === 'SINGLE' || question.type === 'TRUE_FALSE'

            return (
              <button
                key={option.id}
                onClick={() => toggleOption(question.id, option.id, isSingle)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm transition-all',
                  selected
                    ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-gray-50'
                )}
              >
                {/* Checkbox / Radio indicator */}
                <span
                  className={cn(
                    'flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center',
                    isSingle ? 'rounded-full' : 'rounded',
                    selected ? 'border-brand-500 bg-brand-500' : 'border-gray-300'
                  )}
                >
                  {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                {option.text}
              </button>
            )
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-3 text-sm text-red-500 rounded-lg bg-red-50 px-3 py-2">{error}</p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={() => setCurrent(c => c - 1)}
          disabled={current === 0}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {quiz.questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrent(i)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                i === current
                  ? 'bg-brand-500 w-5'
                  : isAnswered(q.id)
                  ? 'bg-brand-300'
                  : 'bg-gray-200'
              )}
            />
          ))}
        </div>

        {current < total - 1 ? (
          <button
            onClick={() => setCurrent(c => c + 1)}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-semibold text-white bg-green-500 hover:bg-green-600 disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit Quiz'}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Results Screen ────────────────────────────────────────────────────────────

function QuizResults({
  result,
  questions,
  onRetry,
}: {
  result:    AttemptResult
  questions: Question[]
  onRetry?:  () => void
}) {
  const [showAnswers, setShowAnswers] = useState(false)

  return (
    <div className="flex flex-col items-center text-center py-6">
      {/* Score circle */}
      <div
        className={cn(
          'w-28 h-28 rounded-full flex flex-col items-center justify-center mb-4 border-4',
          result.passed
            ? 'bg-green-50 border-green-400'
            : 'bg-red-50 border-red-300'
        )}
      >
        <span className="text-3xl font-black text-gray-900">{result.score}%</span>
        <span className="text-xs font-medium text-gray-500">
          {result.correct}/{result.total} correct
        </span>
      </div>

      {result.passed ? (
        <>
          <CheckCircle2 className="h-6 w-6 text-green-500 mb-2" />
          <h2 className="text-xl font-bold text-gray-900">You Passed!</h2>
          <p className="text-sm text-gray-500 mt-1">
            Great work — you scored {result.score}%, above the {result.passMark}% pass mark.
          </p>
        </>
      ) : (
        <>
          <XCircle className="h-6 w-6 text-red-400 mb-2" />
          <h2 className="text-xl font-bold text-gray-900">Not Passed</h2>
          <p className="text-sm text-gray-500 mt-1">
            You scored {result.score}% — you need {result.passMark}% to pass.
            {result.attemptsUsed < result.maxAttempts && (
              <> You have {result.maxAttempts - result.attemptsUsed} attempt{result.maxAttempts - result.attemptsUsed !== 1 ? 's' : ''} left.</>
            )}
          </p>
        </>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setShowAnswers(v => !v)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {showAnswers ? 'Hide' : 'Review'} Answers
        </button>
        {onRetry && !result.passed && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            <RotateCcw className="h-4 w-4" /> Retry Quiz
          </button>
        )}
      </div>

      {/* Answer review */}
      {showAnswers && (
        <div className="mt-6 w-full text-left space-y-4">
          {questions.map((q, i) => {
            const fb = result.feedback[q.id]
            return (
              <div
                key={q.id}
                className={cn(
                  'rounded-xl border p-4',
                  fb?.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                )}
              >
                <div className="flex items-start gap-2 mb-2">
                  {fb?.correct
                    ? <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    : <XCircle    className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  }
                  <p className="text-sm font-medium text-gray-900">
                    Q{i + 1}: {q.text}
                  </p>
                </div>
                <div className="ml-6 space-y-1">
                  {q.options.map(opt => {
                    const wasSelected = fb?.selectedOptionIds.includes(opt.id)
                    const isCorrect   = fb?.correctOptionIds.includes(opt.id)
                    return (
                      <div
                        key={opt.id}
                        className={cn(
                          'text-xs rounded-lg px-2 py-1',
                          isCorrect   && 'bg-green-100 text-green-700 font-medium',
                          wasSelected && !isCorrect && 'bg-red-100 text-red-600 line-through',
                          !isCorrect  && !wasSelected && 'text-gray-500'
                        )}
                      >
                        {isCorrect && '✓ '}{wasSelected && !isCorrect && '✗ '}{opt.text}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
