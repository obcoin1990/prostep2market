import { NextResponse } from 'next/server'

export async function GET() {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://prostep2market.vercel.app'
  // WR-05: Set the demo session cookie via Set-Cookie header so that
  // /dashboard/* pages recognize the user as a demo session.
  const response = NextResponse.redirect(new URL('/demo/dashboard/user', base))
  response.cookies.set('p2m_demo_session', '1', {
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: 'lax',
  })
  return response
}
