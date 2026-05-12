'use client'

import { useState } from 'react'
import Link from 'next/link'
import { VideoPlayer } from '@/components/lesson/VideoPlayer'
import { QuizPlayer } from '@/components/quiz/QuizPlayer'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChevronRight, HelpCircle, BookOpen, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Lesson {
  id:          string
  title:       string
  type:        'VIDEO' | 'TEXT' | 'INTERACTIVE'
  content:     string | null
  videoId:     string | null       // Mux playback ID
  durationSec: number
  quiz: {
    id:         string
    title:      string
    passMark:   number
    maxAttempts: number
    questions:  any[]
  } | null
}

interface Props {
  lesson:         Lesson
  enrollmentId:   string
  lessonProgress: { watchedSec: number; completed: boolean } | null
  quizHistory:    { score: number; passed: boolean }[]
  nextLesson:     { id: string; title: string } | null
  courseId:       string
}

export function LessonContent({
  lesson,
  enrollmentId,
  lessonProgress,
  quizHistory,
  nextLesson,
  courseId,
}: Props) {
  const [tab, setTab]                     = useState<'content' | 'quiz'>('content')
  const [videoCompleted, setVideoCompleted] = useState(lessonProgress?.completed ?? false)
  const [quizPassed, setQuizPassed]       = useState(quizHistory.some(a => a.passed))

  const quizUnlocked = lesson.type === 'TEXT' || videoCompleted || (lessonProgress?.watchedSec ?? 0) > 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Tabs (only if quiz exists) */}
      {lesson.quiz && (
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
          {[
            { key: 'content', label: lesson.type === 'VIDEO' ? 'Video' : 'Lesson', icon: BookOpen },
            { key: 'quiz',    label: 'Quiz',    icon: HelpCircle },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              disabled={t.key === 'quiz' && !quizUnlocked}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition',
                tab === t.key
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700 disabled:opacity-40'
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              {t.key === 'quiz' && quizPassed && (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content tab */}
      {tab === 'content' && (
        <div className="space-y-4">
          {/* Video */}
          {lesson.type === 'VIDEO' && lesson.videoId && (
            <VideoPlayer
              lessonId={lesson.id}
              playbackId={lesson.videoId}
              title={lesson.title}
              durationSec={lesson.durationSec}
              enrollmentId={enrollmentId}
              initialWatched={lessonProgress?.watchedSec ?? 0}
              initialCompleted={lessonProgress?.completed ?? false}
              onComplete={() => setVideoCompleted(true)}
            />
          )}

          {/* Text content */}
          {lesson.content && (
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
              <article className="prose prose-sm prose-gray max-w-none prose-headings:font-semibold prose-a:text-brand-500">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {lesson.content}
                </ReactMarkdown>
              </article>
            </div>
          )}

          {/* Quiz prompt */}
          {lesson.quiz && videoCompleted && !quizPassed && (
            <div className="rounded-xl bg-brand-50 border border-brand-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-700">Ready for the quiz?</p>
                <p className="text-xs text-brand-500 mt-0.5">
                  Pass with {lesson.quiz.passMark}% to unlock the next lesson.
                </p>
              </div>
              <button
                onClick={() => setTab('quiz')}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Start Quiz
              </button>
            </div>
          )}

          {/* Next lesson */}
          {nextLesson && (videoCompleted || lesson.type === 'TEXT') && (!lesson.quiz || quizPassed) && (
            <Link
              href={`/courses/${courseId}/lessons/${nextLesson.id}`}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-brand-300 hover:shadow-md transition group"
            >
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Up next</p>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-600">
                  {nextLesson.title}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-brand-500" />
            </Link>
          )}
        </div>
      )}

      {/* Quiz tab */}
      {tab === 'quiz' && lesson.quiz && (
        <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
          <QuizPlayer
            quiz={lesson.quiz}
            attemptsUsed={quizHistory.length}
            onComplete={(result) => {
              if (result.passed) setQuizPassed(true)
            }}
          />
        </div>
      )}
    </div>
  )
}
