import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DEMO_EMAIL, DEMO_PASSWORD, DEMO_USER_ID } from '@/lib/demo/demo-data'

export async function POST() {
  const supabase = await createClient()

  // Try to sign in first
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  })

  if (signInData?.user) {
    return NextResponse.json({ success: true, user: signInData.user })
  }

  // If sign-in fails, try to create the demo user via admin API
  // Note: This requires SUPABASE_SERVICE_ROLE_KEY to be set
  const { createClient: createAdminClient } = await import('@supabase/supabase-js')

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    return NextResponse.json({
      success: false,
      error: 'Demo user not configured. Set SUPABASE_SERVICE_ROLE_KEY and run the demo seed SQL.',
      demoUserCreated: false,
    }, { status: 503 })
  }

  const adminClient = createAdminClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Create demo user
  const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: {
      full_name: 'Demo Trader',
      role: 'SUPER_ADMIN',
      avatar_url: null,
    },
  })

  if (createError) {
    return NextResponse.json({ success: false, error: createError.message }, { status: 500 })
  }

  if (!userData?.user) {
    return NextResponse.json({ success: false, error: 'Failed to create demo user' }, { status: 500 })
  }

  // Sign in with the newly created demo user
  const { data: newSignIn } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  })

  if (newSignIn?.user) {
    return NextResponse.json({
      success: true,
      user: newSignIn.user,
      message: 'Demo account created and logged in. Please run the demo seed SQL to populate data.',
    })
  }

  return NextResponse.json({
    success: true,
    message: 'Demo user created. Please sign in with demo@prostep2market.com / Demo123!',
  })
}
