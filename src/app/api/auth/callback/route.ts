import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  if (!token_hash || !type) {
    return NextResponse.redirect(new URL('/login?error=invalid_params', request.url))
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type,
  })

  if (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url))
  }

  // For password reset, redirect to update password page
  if (type === 'recovery') {
    return NextResponse.redirect(new URL('/update-password', request.url))
  }

  return NextResponse.redirect(new URL(next, request.url))
}