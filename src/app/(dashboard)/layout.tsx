import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayoutClient } from '@/components/dashboard/DashboardLayoutClient'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <DashboardLayoutClient
      userEmail={user.email ?? null}
      userFullName={user.user_metadata?.full_name ?? user.user_metadata?.name ?? null}
    >
      {children}
    </DashboardLayoutClient>
  )
}
