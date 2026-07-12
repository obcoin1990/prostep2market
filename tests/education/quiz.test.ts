/**
 * Tests for Quiz functionality (EDU-06)
 *
 * Validates quiz fetching, scoring, attempts, and result generation.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

const { supabase } = vi.hoisted(() => {
  const queues: Record<string, any> = {}
  const getResponse = (table: string) => {
    const q = queues[table]
    if (q && q.length > 0) return q.shift()!
    return { data: null, error: null }
  }
  const makeChain = (response: any) => {
    const chain: any = {
      select: vi.fn(() => chain),
      eq: vi.fn(() => chain),
      order: vi.fn(() => chain),
      limit: vi.fn(() => chain),
      single: vi.fn(async () => response),
      maybeSingle: vi.fn(async () => response),
      upsert: vi.fn(() => chain),
    }
    chain.then = (onF: any, onR?: any) => Promise.resolve(response).then(onF, onR)
    chain.catch = (onR: any) => Promise.resolve(response).catch(onR)
    return chain
  }
  const fromMock = vi.fn((table: string) => makeChain(getResponse(table)))
  const setResponse = (table: string, ...responses: any[]) => { queues[table] = [...responses] }
  const createClient = vi.fn(async () => ({ from: fromMock }))
  return { supabase: { setResponse, createClient, fromMock, queues } }
})

vi.mock('@/lib/supabase/server', () => ({
  createClient: supabase.createClient,
}))

import { getQuizById, getQuizByCourse } from '@/lib/education/courses'
import {
  markLessonComplete,
  updateQuizScore,
  markCourseCompleted,
  getCourseProgress,
  getAllUserProgress,
  calculatePathProgress,
} from '@/lib/education/progress'

const progressRow = {
  id: 'p-1',
  user_id: 'user-1',
  course_id: 'course-1',
  lessons_completed: ['lesson-1'],
  quiz_score: 80,
  quiz_attempts: 1,
  completed_at: null,
  certificate_issued: false,
  certificate_url: null,
  created_at: '2026-01-01T00:00:00Z',
}

describe('Quiz System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getQuizById', () => {
    it('should fetch quiz with questions by ID', async () => {
      supabase.setResponse('quizzes', { data: { id: 'quiz-1', course_id: 'c-1', passing_score: 70, max_attempts: 3 }, error: null })
      supabase.setResponse('quiz_questions', {
        data: [
          { id: 'q-1', quiz_id: 'quiz-1', question_text: 'Q1?', options: ['A', 'B'], correct_index: 0, explanation: null, order_index: 1 },
          { id: 'q-2', quiz_id: 'quiz-1', question_text: 'Q2?', options: ['A', 'B'], correct_index: 1, explanation: null, order_index: 2 },
        ],
        error: null,
      })

      const quiz = await getQuizById('quiz-1')

      expect(quiz).not.toBeNull()
      expect(quiz?.id).toBe('quiz-1')
      expect(quiz?.questions).toHaveLength(2)
      expect(quiz?.questions[0].text).toBe('Q1?')
    })

    it('should return null when quiz not found', async () => {
      supabase.setResponse('quizzes', { data: null, error: { message: 'not found' } })

      const quiz = await getQuizById('nonexistent')
      expect(quiz).toBeNull()
    })

    it('should return null when questions fetch fails', async () => {
      supabase.setResponse('quizzes', { data: { id: 'quiz-1', course_id: 'c-1', passing_score: 70, max_attempts: 3 }, error: null })
      supabase.setResponse('quiz_questions', { data: null, error: { message: 'DB error' } })

      const quiz = await getQuizById('quiz-1')
      expect(quiz).toBeNull()
    })
  })

  describe('getQuizByCourse', () => {
    it('should fetch quiz by course ID', async () => {
      supabase.setResponse('quizzes', { data: { id: 'quiz-1', course_id: 'c-1', passing_score: 80, max_attempts: 2 }, error: null })
      supabase.setResponse('quiz_questions', { data: [], error: null })

      const quiz = await getQuizByCourse('c-1')
      expect(quiz).not.toBeNull()
      expect(quiz?.passingScore).toBe(80)
      expect(quiz?.maxAttempts).toBe(2)
    })
  })

  describe('markLessonComplete', () => {
    it('should mark a lesson complete for new progress entry', async () => {
      // First: existing query returns null (no existing progress)
      // Second: upsert returns the new progress row
      supabase.setResponse('course_progress',
        { data: null, error: { code: 'PGRST116' } }, // no existing
        { data: { ...progressRow, lessons_completed: ['lesson-1'] }, error: null },
      )

      const result = await markLessonComplete('user-1', 'course-1', 'lesson-1')
      expect(result).not.toBeNull()
      expect(result?.lessonsCompleted).toContain('lesson-1')
    })

    it('should return existing progress when lesson is already completed', async () => {
      // existing has the lesson, so refetch returns the existing row
      supabase.setResponse('course_progress',
        { data: { lessons_completed: ['lesson-1'] }, error: null }, // existing
        { data: { ...progressRow, lessons_completed: ['lesson-1'] }, error: null }, // refetch
      )

      const result = await markLessonComplete('user-1', 'course-1', 'lesson-1')
      expect(result).not.toBeNull()
      expect(result?.lessonsCompleted).toEqual(['lesson-1'])
    })

    it('should return null on database error during refetch', async () => {
      supabase.setResponse('course_progress',
        { data: { lessons_completed: ['lesson-1'] }, error: null }, // existing
        { data: null, error: { message: 'refetch error' } }, // refetch fails
      )

      // The function will throw on the refetch error (per WR-09 fix)
      await expect(
        markLessonComplete('user-1', 'course-1', 'lesson-1')
      ).rejects.toBeDefined()
    })
  })

  describe('updateQuizScore', () => {
    it('should update quiz score and attempts', async () => {
      supabase.setResponse('course_progress', { data: { ...progressRow, quiz_score: 85, quiz_attempts: 1 }, error: null })

      const result = await updateQuizScore('user-1', 'course-1', 85, 1)
      expect(result).not.toBeNull()
      expect(result?.quizScore).toBe(85)
    })
  })

  describe('markCourseCompleted', () => {
    it('should mark course as completed with timestamp', async () => {
      supabase.setResponse('course_progress', { data: { ...progressRow, completed_at: '2026-01-02T00:00:00Z' }, error: null })

      const result = await markCourseCompleted('user-1', 'course-1')
      expect(result).not.toBeNull()
      expect(result?.completedAt).toBeDefined()
    })
  })

  describe('getCourseProgress', () => {
    it('should return null when no progress exists', async () => {
      supabase.setResponse('course_progress', { data: null, error: { message: 'not found' } })

      const progress = await getCourseProgress('user-1', 'course-1')
      expect(progress).toBeNull()
    })
  })

  describe('getAllUserProgress', () => {
    it('should return empty array on error', async () => {
      supabase.setResponse('course_progress', { data: null, error: { message: 'DB error' } })

      const progress = await getAllUserProgress('user-1')
      expect(progress).toEqual([])
    })
  })

  describe('calculatePathProgress', () => {
    it('should return 0 when no courses in path', async () => {
      supabase.setResponse('courses', { data: [], error: null })

      const progress = await calculatePathProgress('user-1', 'beginner')
      expect(progress).toBe(0)
    })
  })
})
