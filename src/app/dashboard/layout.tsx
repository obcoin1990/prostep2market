import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardLayoutClient } from '@/components/dashboard/DashboardLayoutClient'
import { DEMO_EMAIL } from '@/lib/demo/demo-data'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let isDemo = false
  let userEmail: string | null = null
  let userFullName: string | null = null

  // Check demo session
  try {
    const c = await cookies()
    if (c.get('p2m_demo_session')?.value) {
      isDemo = true
      userEmail = DEMO_EMAIL
      userFullName = 'Demo Trader'
    }
  } catch {
    console.error('DashboardLayout: cookies() threw')
  }

  if (!isDemo) {
    // Fall back to Supabase auth
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        userEmail = user.email ?? null
        userFullName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? null
      }
    } catch {
      // Supabase unreachable
    }
  }

  // If we have a user (demo or real), render the dashboard
  if (userEmail) {
    return (
      <DashboardLayoutClient userEmail={userEmail} userFullName={userFullName}>
        {children}
      </DashboardLayoutClient>
    )
  }

  redirect('/login')
}
