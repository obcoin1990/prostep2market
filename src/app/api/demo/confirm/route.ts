import { NextResponse } from 'next/server'
import { DEMO_EMAIL, DEMO_USER_ID } from '@/lib/demo/demo-data'

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY not configured' },
      { status: 503 }
    )
  }

  const { createClient } = await import('@supabase/supabase-js')
  const adminClient = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Look up the demo user
  const { data: users } = await adminClient.auth.admin.listUsers()
  const demoUser = users?.users?.find(u => u.email === DEMO_EMAIL)

  if (!demoUser) {
    return NextResponse.json(
      { error: 'Demo user not found. Click Launch Demo Account first.' },
      { status: 404 }
    )
  }

  // Confirm email if not already confirmed
  if (!demoUser.email_confirmed_at) {
    const { error } = await adminClient.auth.admin.updateUserById(demoUser.id, {
      email_confirm: true,
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
