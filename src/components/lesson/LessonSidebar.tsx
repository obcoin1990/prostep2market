'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronDown, ChevronRight, CheckCircle2,
  PlayCircle, FileText, HelpCircle, Menu, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LessonProgress {
  lessonId:  string
  completed: boolean
}

interface Lesson {
  id:          string
  title:       string
  type:        'VIDEO' | 'TEXT' | 'INTERACTIVE'
  durationSec: number
  isFree:      boolean
  quiz:        { id: string } | null
}

interface Module {
  id:      string
  title:   string
  order:   number
  lessons: Lesson[]
}

interface Props {
  courseId:       string
  courseTitle:    string
  modules:        Module[]
  lessonProgress: LessonProgress[]
  activeLessonId: string
}

const TYPE_ICON = {
  VIDEO:       PlayCircle,
  TEXT:        FileText,
  INTERACTIVE: HelpCircle,
}

export function LessonSidebar({
  courseId,
  courseTitle,
  modules,
  lessonProgress,
  activeLessonId,
}: Props) {
  const progressMap = Object.fromEntries(lessonProgress.map(p => [p.lessonId, p.completed]))
  const [expanded, setExpanded]   = useState<Set<string>>(
    new Set(
      modules.filter(m => m.lessons.some(l => l.id === activeLessonId)).map(m => m.id)
    )
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleModule = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const totalLessons    = modules.flatMap(m => m.lessons).length
  const completedCount  = modules.flatMap(m => m.lessons).filter(l => progressMap[l.id]).length
  const courseProgress  = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const sidebar = (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Course title + progress */}
      <div className="px-4 py-4 border-b border-gray-100">
        <Link href={`/courses/${courseId}`} className="text-xs text-brand-500 hover:underline mb-1 block">
          ← Back to course
        </Link>
        <p className="text-sm font-semibold text-gray-900 line-clamp-2">{courseTitle}</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-gray-100">
            <div
              className="h-1.5 rounded-full bg-brand-500 transition-all"
              style={{ width: `${courseProgress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {completedCount}/{totalLessons}
          </span>
        </div>
      </div>

      {/* Modules */}
      <nav className="flex-1 overflow-y-auto py-2">
        {modules.map(module => {
          const isOpen = expanded.has(module.id)
          const moduleDone = module.lessons.every(l => progressMap[l.id])

          return (
            <div key={module.id}>
              <button
                onClick={() => toggleModule(module.id)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 transition"
              >
                <span className="flex items-center gap-2 min-w-0">
                  {moduleDone && <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />}
                  <span className="text-xs font-semibold text-gray-700 truncate">
                    {module.order}. {module.title}
                  </span>
                </span>
                {isOpen
                  ? <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  : <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                }
              </button>

              {isOpen && (
                <div className="pb-1">
                  {module.lessons.map(lesson => {
                    const isActive    = lesson.id === activeLessonId
                    const isDone      = progressMap[lesson.id] ?? false
                    const Icon        = TYPE_ICON[lesson.type]
                    const durationMin = Math.round(lesson.durationSec / 60)

                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${courseId}/lessons/${lesson.id}`}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'flex items-start gap-2.5 px-6 py-2.5 text-xs transition',
                          isActive
                            ? 'bg-brand-50 border-l-2 border-brand-500'
                            : 'hover:bg-gray-50 border-l-2 border-transparent'
                        )}
                      >
                        <span className="flex-shrink-0 mt-0.5">
                          {isDone
                            ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            : <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-brand-500' : 'text-gray-400')} />
                          }
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className={cn(
                            'block truncate',
                            isActive ? 'text-brand-700 font-medium' : 'text-gray-600'
                          )}>
                            {lesson.title}
                          </span>
                          {lesson.durationSec > 0 && (
                            <span className="text-gray-400">{durationMin}m</span>
                          )}
                          {lesson.quiz && (
                            <span className="ml-2 text-brand-400">· Quiz</span>
                          )}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(v => !v)}
        className="fixed bottom-4 right-4 z-50 lg:hidden flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
      >
        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        {sidebarOpen ? 'Close' : 'Lessons'}
      </button>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72">{sidebar}</div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0 h-full">{sidebar}</div>
    </>
  )
}
