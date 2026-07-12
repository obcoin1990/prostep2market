/**
 * Vitest test setup — runs before each test file.
 * Mocks global browser APIs, Next.js navigation, and Supabase clients.
 */

import { vi, beforeEach } from 'vitest'

// ─── Next.js Navigation ──────────────────────────────────────────────────────
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
  notFound: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: () => ({
    getAll: () => [],
    get: () => undefined,
    set: vi.fn(),
  }),
  headers: () => new Map(),
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => ({ type: 'a', props: { href, ...props, children } }),
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => ({ type: 'img', props: { src, alt, ...props } }),
}))

vi.mock('next/script', () => ({
  default: ({ children, ...props }: any) => ({ type: 'script', props: { ...props, children } }),
}))

// ─── Sentry ──────────────────────────────────────────────────────────────────
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  captureRouterTransitionStart: vi.fn(),
  browserTracingIntegration: vi.fn(() => ({})),
  replayIntegration: vi.fn(() => ({})),
  feedbackIntegration: vi.fn(() => ({})),
  startSpan: vi.fn((opts, fn) => fn({ setAttribute: vi.fn(), end: vi.fn() })),
  init: vi.fn(),
  withSentryConfig: vi.fn((config) => config),
}))

// ─── ResizeObserver / IntersectionObserver (for Recharts) ────────────────────
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
;(global as any).ResizeObserver = MockResizeObserver

class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])
}
;(global as any).IntersectionObserver = MockIntersectionObserver

// ─── matchMedia ───────────────────────────────────────────────────────────────
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// ─── Reset mocks between tests ──────────────────────────────────────────────
beforeEach(() => {
  vi.clearAllMocks()
})
