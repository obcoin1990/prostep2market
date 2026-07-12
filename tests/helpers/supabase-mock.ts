/**
 * Helpers for mocking Supabase clients in tests.
 *
 * The Supabase JS client returns a chainable, thenable query builder.
 * `select()`/`eq()`/etc. return a builder; awaiting the builder resolves
 * with `{ data, error }`. `.single()` returns a single row.
 *
 * This helper builds a chainable that resolves with a queued response.
 *
 * Usage:
 * ```ts
 * import { setupSupabaseMock } from '../helpers/supabase-mock'
 * const { supabase } = setupSupabaseMock()
 *
 * vi.mock('@/lib/supabase/server', () => ({
 *   createClient: supabase.createClient,
 * }))
 *
 * supabase.setResponse('courses', { data: [...], error: null })
 * ```
 */

import { vi } from 'vitest'

type Response = { data: any; error: any }

/** Build a chainable, thenable Supabase query mock. */
export function makeQueryChain<T = any>(response: Response = { data: null, error: null }): any {
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
  chain.then = (onFulfilled: any, onRejected?: any) =>
    Promise.resolve(response).then(onFulfilled, onRejected)
  chain.catch = (onRejected: any) => Promise.resolve(response).catch(onRejected)
  return chain
}

export interface SupabaseMock {
  setResponse: (table: string, ...responses: Response[]) => void
  createClient: ReturnType<typeof vi.fn>
  fromMock: ReturnType<typeof vi.fn>
  storageUpload: ReturnType<typeof vi.fn>
  storageGetPublicUrl: ReturnType<typeof vi.fn>
  _queues: Record<string, Response[]>
}

/**
 * Set up a Supabase mock and return a stable reference that can be used in
 * `vi.mock` factory. The returned object can be mutated from tests via
 * `setResponse()` to control responses.
 *
 * The function uses `vi.hoisted` semantics — the mock must be referenced
 * in the same `vi.mock` factory call. To use:
 *
 * ```ts
 * const { supabase } = setupSupabaseMock()
 * vi.mock('@/lib/supabase/server', () => ({
 *   createClient: supabase.createClient,
 * }))
 * ```
 *
 * Note: this should be called AT MODULE LEVEL (not inside describe/beforeEach).
 */
export function setupSupabaseMock() {
  const queues: Record<string, Response[]> = {}

  function getResponse(table: string): Response {
    const queue = queues[table]
    if (queue && queue.length > 0) return queue.shift()!
    return { data: null, error: null }
  }

  const setResponse = (table: string, ...responses: Response[]) => {
    queues[table] = [...responses]
  }

  const fromMock = vi.fn((table: string) => makeQueryChain(getResponse(table)))
  const storageUpload = vi.fn(async () => ({ data: { path: 'mock.pdf' }, error: null }))
  const storageGetPublicUrl = vi.fn(() => ({ data: { publicUrl: 'https://example.com/mock.pdf' } }))

  const createClient = vi.fn(async () => ({
    from: fromMock,
    storage: {
      from: vi.fn(() => ({
        upload: storageUpload,
        getPublicUrl: storageGetPublicUrl,
      })),
    },
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: { id: 'test-user-id', email: 'test@example.com' } },
        error: null,
      })),
      getSession: vi.fn(async () => ({
        data: { session: { access_token: 'test-token' } },
        error: null,
      })),
      admin: {
        createUser: vi.fn(async () => ({
          data: { user: { id: 'new-id', email: 'new@example.com' } },
          error: null,
        })),
        deleteUser: vi.fn(async () => ({ error: null })),
        listUsers: vi.fn(async () => ({ data: { users: [] }, error: null })),
      },
    },
  }))

  return {
    supabase: {
      setResponse,
      createClient,
      fromMock,
      storageUpload,
      storageGetPublicUrl,
      _queues: queues,
    },
  }
}

/** Legacy helper for non-vi.mock use cases. */
export function makeSupabaseMock() {
  const mock = setupSupabaseMock()
  return mock.supabase
}
