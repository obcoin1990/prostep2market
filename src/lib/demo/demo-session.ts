import { cookies, headers } from 'next/headers'
import { DEMO_EMAIL } from './demo-data'

const DEMO_COOKIE_NAME = 'p2m_demo_session'

export interface DemoSession {
  email: string
  fullName: string
  isDemo: boolean
}

export async function getDemoSession(): Promise<DemoSession | null> {
  try {
    // Try reading from the Cookie header directly as a fallback
    const h = await headers()
    const rawCookie = h.get('cookie') || ''
    if (rawCookie.includes(DEMO_COOKIE_NAME + '=') || rawCookie.includes(DEMO_COOKIE_NAME + '=%3E')) {
      return { email: DEMO_EMAIL, fullName: 'Demo Trader', isDemo: true }
    }
  } catch {
    // headers() not available
  }

  try {
    const cookieStore = await cookies()
    const demoCookie = cookieStore.get(DEMO_COOKIE_NAME)
    if (demoCookie?.value) {
      return { email: DEMO_EMAIL, fullName: 'Demo Trader', isDemo: true }
    }
  } catch {
    // cookies() not available
  }

  return null
}
