/**
 * Tests for Learning Paths (EDU-04, EDU-07)
 *
 * Validates path discovery, course grouping, and metadata retrieval.
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
  const createClient = vi.fn(async () => ({ from: fromMock }))
  return { supabase: { setResponse, createClient, fromMock, queues } }
})

vi.mock('@/lib/supabase/server', () => ({
  createClient: supabase.createClient,
}))

import {
  getLearningPaths,
  getLearningPath,
  getPathInfo,
  getAllPathIds,
} from '@/lib/education/paths'

describe('Learning Paths', () => {
  const courseRow = {
    id: 'course-1',
    path: 'beginner',
    title: 'Trading 101',
    description: 'Introduction to trading',
    type: 'video',
    duration_minutes: 60,
    order_index: 1,
    certificate_eligible: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getLearningPaths', () => {
    it('should return all 4 learning paths', async () => {
      supabase.setResponse('courses', { data: [], error: null })

      const paths = await getLearningPaths()
      expect(paths).toHaveLength(4)
    })

    it('should include beginner, intermediate, advanced, psychology-first', async () => {
      supabase.setResponse('courses', { data: [], error: null })

      const paths = await getLearningPaths()
      const ids = paths.map((p) => p.id)
      expect(ids).toContain('beginner')
      expect(ids).toContain('intermediate')
      expect(ids).toContain('advanced')
      expect(ids).toContain('psychology-first')
    })

    it('should group courses by path', async () => {
      const beginnerCourse = { ...courseRow, id: 'b-1', path: 'beginner' }
      const advancedCourse = { ...courseRow, id: 'a-1', path: 'advanced' }
      supabase.setResponse('courses', { data: [beginnerCourse, advancedCourse], error: null })

      const paths = await getLearningPaths()
      const beginner = paths.find((p) => p.id === 'beginner')!
      const advanced = paths.find((p) => p.id === 'advanced')!

      expect(beginner.courses).toHaveLength(1)
      expect(beginner.courses[0].id).toBe('b-1')
      expect(advanced.courses).toHaveLength(1)
      expect(advanced.courses[0].id).toBe('a-1')
    })

    it('should return empty paths array on error (fails closed)', async () => {
      supabase.setResponse('courses', { data: null, error: { message: 'DB error' } })

      const paths = await getLearningPaths()
      // paths.ts returns empty array on DB error (fails closed)
      expect(paths).toEqual([])
    })

    it('should provide metadata for each path', async () => {
      supabase.setResponse('courses', { data: [], error: null })

      const paths = await getLearningPaths()
      const beginner = paths.find((p) => p.id === 'beginner')

      expect(beginner).toBeDefined()
      expect(beginner?.name).toBe('Beginner Trader')
      expect(beginner?.description).toBeTruthy()
      expect(beginner?.recommendedFor).toBeInstanceOf(Array)
      expect(beginner?.recommendedFor.length).toBeGreaterThan(0)
    })
  })

  describe('getLearningPath', () => {
    it('should return a specific path by ID', async () => {
      supabase.setResponse('courses', { data: [], error: null })

      const path = await getLearningPath('beginner')
      expect(path).not.toBeNull()
      expect(path?.id).toBe('beginner')
      expect(path?.name).toBe('Beginner Trader')
    })

    it('should return null for unknown path', async () => {
      supabase.setResponse('courses', { data: [], error: null })

      const path = await getLearningPath('nonexistent')
      expect(path).toBeNull()
    })
  })

  describe('getPathInfo', () => {
    it('should return metadata for a valid path', () => {
      const info = getPathInfo('beginner')
      expect(info).not.toBeNull()
      expect(info?.id).toBe('beginner')
      expect(info?.name).toBe('Beginner Trader')
      expect(info?.courses).toBeUndefined() // should be omitted
    })

    it('should return null for invalid path', () => {
      const info = getPathInfo('invalid' as any)
      expect(info).toBeNull()
    })
  })

  describe('getAllPathIds', () => {
    it('should return all 4 path IDs', () => {
      const ids = getAllPathIds()
      expect(ids).toEqual(['beginner', 'intermediate', 'advanced', 'psychology-first'])
    })
  })
})
