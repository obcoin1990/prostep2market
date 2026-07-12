/**
 * Tests for Course Player functionality
 *
 * Validates course fetching, lesson navigation, and progress tracking.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { CourseRow, LessonRow, QuizQuestionRow } from '@/types/education'

const { supabase, mockFn } = vi.hoisted(() => {
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
      neq: vi.fn(() => chain),
      gt: vi.fn(() => chain),
      gte: vi.fn(() => chain),
      lt: vi.fn(() => chain),
      lte: vi.fn(() => chain),
      like: vi.fn(() => chain),
      ilike: vi.fn(() => chain),
      in: vi.fn(() => chain),
      is: vi.fn(() => chain),
      not: vi.fn(() => chain),
      or: vi.fn(() => chain),
      and: vi.fn(() => chain),
      match: vi.fn(() => chain),
      order: vi.fn(() => chain),
      limit: vi.fn(() => chain),
      range: vi.fn(() => chain),
      single: vi.fn(async () => response),
      maybeSingle: vi.fn(async () => response),
      insert: vi.fn(() => chain),
      update: vi.fn(() => chain),
      upsert: vi.fn(() => chain),
      delete: vi.fn(() => chain),
    }
    chain.then = (onF: any, onR?: any) => Promise.resolve(response).then(onF, onR)
    chain.catch = (onR: any) => Promise.resolve(response).catch(onR)
    return chain
  }
  const fromMock = vi.fn((table: string) => makeChain(getResponse(table)))
  const setResponse = (table: string, ...responses: any[]) => { queues[table] = [...responses] }
  const createClient = vi.fn(async () => ({
    from: fromMock,
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(async () => ({ data: { path: 'mock' }, error: null })),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/mock.pdf' } })),
      })),
    },
    auth: {
      getUser: vi.fn(async () => ({ data: { user: { id: 'test-user-id', email: 'test@example.com' } }, error: null })),
      getSession: vi.fn(async () => ({ data: { session: { access_token: 'test-token' } }, error: null })),
      admin: {
        createUser: vi.fn(async () => ({ data: { user: { id: 'new-id', email: 'new@example.com' } }, error: null })),
        deleteUser: vi.fn(async () => ({ error: null })),
        listUsers: vi.fn(async () => ({ data: { users: [] }, error: null })),
      },
    },
  }))
  return { supabase: { setResponse, createClient, fromMock, queues }, mockFn: { fromMock, queues } }
})

vi.mock('@/lib/supabase/server', () => ({
  createClient: supabase.createClient,
}))

import {
  getCoursesByPath,
  getCourseById,
  getLessonsByCourse,
  getLessonById,
  getQuizByCourse,
  getAllCourses,
} from '@/lib/education/courses'

describe('Course Player', () => {
  const courseRow: CourseRow = {
    id: 'course-1',
    path: 'beginner',
    title: 'Trading 101',
    description: 'Introduction to trading',
    type: 'video',
    duration_minutes: 60,
    order_index: 1,
    certificate_eligible: true,
  }

  const lessonRow: LessonRow = {
    id: 'lesson-1',
    course_id: 'course-1',
    title: 'Lesson 1',
    content: 'Lesson content here',
    type: 'video',
    duration_minutes: 15,
    order_index: 1,
  }

  const quizQuestionRow: QuizQuestionRow = {
    id: 'q-1',
    quiz_id: 'quiz-1',
    question_text: 'What is a stop loss?',
    options: ['A', 'B', 'C'],
    correct_index: 0,
    explanation: 'A stop loss limits losses',
    order_index: 1,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCoursesByPath', () => {
    it('should fetch courses filtered by learning path', async () => {
      supabase.setResponse('courses', { data: [courseRow], error: null })

      const courses = await getCoursesByPath('beginner')

      expect(courses).toHaveLength(1)
      expect(courses[0].id).toBe('course-1')
      expect(courses[0].path).toBe('beginner')
      expect(courses[0].title).toBe('Trading 101')
    })

    it('should return empty array on error', async () => {
      supabase.setResponse('courses', { data: null, error: { message: 'DB error' } })

      const courses = await getCoursesByPath('beginner')
      expect(courses).toEqual([])
    })

    it('should return empty array when no courses found', async () => {
      supabase.setResponse('courses', { data: [], error: null })

      const courses = await getCoursesByPath('advanced')
      expect(courses).toEqual([])
    })

    it('should map database rows to Course type correctly', async () => {
      supabase.setResponse('courses', { data: [courseRow], error: null })

      const courses = await getCoursesByPath('beginner')
      expect(courses[0]).toMatchObject({
        id: 'course-1',
        path: 'beginner',
        title: 'Trading 101',
        description: 'Introduction to trading',
        type: 'video',
        durationMinutes: 60,
        orderIndex: 1,
        certificateEligible: true,
      })
    })
  })

  describe('getCourseById', () => {
    it('should return null when course not found', async () => {
      supabase.setResponse('courses', { data: null, error: { message: 'not found' } })

      const course = await getCourseById('nonexistent')
      expect(course).toBeNull()
    })

    it('should fetch course with lessons and quiz', async () => {
      supabase.setResponse('courses', { data: courseRow, error: null })
      supabase.setResponse('lessons', { data: [lessonRow], error: null })
      supabase.setResponse('quizzes', { data: { id: 'quiz-1', course_id: 'course-1', passing_score: 70, max_attempts: 3 }, error: null })
      supabase.setResponse('quiz_questions', { data: [quizQuestionRow], error: null })

      const course = await getCourseById('course-1')

      expect(course).not.toBeNull()
      expect(course?.id).toBe('course-1')
      expect(course?.lessons).toHaveLength(1)
      expect(course?.quiz).toBeDefined()
      expect(course?.quiz?.questions).toHaveLength(1)
    })

    it('should handle course with no quiz', async () => {
      supabase.setResponse('courses', { data: courseRow, error: null })
      supabase.setResponse('lessons', { data: [lessonRow], error: null })
      supabase.setResponse('quizzes', { data: null, error: { message: 'no quiz' } })

      const course = await getCourseById('course-1')

      expect(course).not.toBeNull()
      expect(course?.quiz).toBeUndefined()
    })
  })

  describe('getLessonsByCourse', () => {
    it('should fetch lessons ordered by order_index', async () => {
      const lesson1 = { ...lessonRow, order_index: 1 }
      const lesson2 = { ...lessonRow, id: 'lesson-2', order_index: 2 }
      supabase.setResponse('lessons', { data: [lesson1, lesson2], error: null })

      const lessons = await getLessonsByCourse('course-1')

      expect(lessons).toHaveLength(2)
      expect(lessons[0].id).toBe('lesson-1')
      expect(lessons[1].id).toBe('lesson-2')
    })

    it('should return empty array on error', async () => {
      supabase.setResponse('lessons', { data: null, error: { message: 'DB error' } })

      const lessons = await getLessonsByCourse('course-1')
      expect(lessons).toEqual([])
    })

    it('should map lesson rows correctly', async () => {
      supabase.setResponse('lessons', { data: [lessonRow], error: null })

      const lessons = await getLessonsByCourse('course-1')
      expect(lessons[0]).toMatchObject({
        id: 'lesson-1',
        courseId: 'course-1',
        order: 1,
        title: 'Lesson 1',
        content: 'Lesson content here',
        type: 'video',
        durationMinutes: 15,
      })
    })
  })

  describe('getLessonById', () => {
    it('should return lesson by ID', async () => {
      supabase.setResponse('lessons', { data: lessonRow, error: null })

      const lesson = await getLessonById('lesson-1')

      expect(lesson).not.toBeNull()
      expect(lesson?.id).toBe('lesson-1')
    })

    it('should return null when not found', async () => {
      supabase.setResponse('lessons', { data: null, error: { message: 'not found' } })

      const lesson = await getLessonById('nonexistent')
      expect(lesson).toBeNull()
    })
  })

  describe('getQuizByCourse', () => {
    it('should return quiz with questions for a course', async () => {
      supabase.setResponse('quizzes', { data: { id: 'quiz-1', course_id: 'course-1', passing_score: 70, max_attempts: 3 }, error: null })
      supabase.setResponse('quiz_questions', { data: [quizQuestionRow], error: null })

      const quiz = await getQuizByCourse('course-1')

      expect(quiz).not.toBeNull()
      expect(quiz?.id).toBe('quiz-1')
      expect(quiz?.courseId).toBe('course-1')
      expect(quiz?.passingScore).toBe(70)
      expect(quiz?.maxAttempts).toBe(3)
      expect(quiz?.questions).toHaveLength(1)
    })

    it('should return null when quiz not found', async () => {
      supabase.setResponse('quizzes', { data: null, error: { message: 'not found' } })

      const quiz = await getQuizByCourse('course-1')
      expect(quiz).toBeNull()
    })

    it('should return null on questions fetch error', async () => {
      supabase.setResponse('quizzes', { data: { id: 'quiz-1', course_id: 'course-1', passing_score: 70, max_attempts: 3 }, error: null })
      supabase.setResponse('quiz_questions', { data: null, error: { message: 'DB error' } })

      const quiz = await getQuizByCourse('course-1')
      expect(quiz).toBeNull()
    })
  })

  describe('getAllCourses', () => {
    it('should return all courses sorted by path and order', async () => {
      supabase.setResponse('courses', { data: [courseRow], error: null })

      const courses = await getAllCourses()
      expect(courses).toHaveLength(1)
      expect(courses[0].id).toBe('course-1')
    })

    it('should return empty array on error', async () => {
      supabase.setResponse('courses', { data: null, error: { message: 'DB error' } })

      const courses = await getAllCourses()
      expect(courses).toEqual([])
    })
  })
})
