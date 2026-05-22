import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createClient } from '@/lib/supabase/server'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const adminUser = await getAdminUser()

  if (!adminUser) {
    // Not logged in at all → go to login
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    // Logged in but not admin → send them to their own dashboard
    redirect('/dashboard')
  }

  return (
    <AdminLayoutClient userEmail={adminUser.email}>
      {children}
    </AdminLayoutClient>
  )
}
