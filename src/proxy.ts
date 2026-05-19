import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Skip middleware if Supabase env vars are not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  const response = NextResponse.next({ request })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // Refresh session if expired
    const { data: { user } } = await supabase.auth.getUser()

    // Define protected routes
    const protectedPrefixes = [
      '/dashboard',
      '/journal',
      '/analysis',
      '/strategy-lab',
      '/education',
      '/profile',
      '/trader-dna',
      '/admin',
    ]
    const isProtectedRoute = protectedPrefixes.some(prefix =>
      request.nextUrl.pathname.startsWith(prefix)
    )

    // Define auth routes (should redirect to dashboard if already logged in)
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/signup') ||
      request.nextUrl.pathname.startsWith('/reset-password')

    if (isProtectedRoute && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } catch (error) {
    // If Supabase fails, continue without auth
    console.error('Middleware auth error:', error)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}