import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UserManagement } from '@/components/admin/UserManagement'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean)

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if user is authenticated
  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  if (!ADMIN_EMAILS.includes(user.email ?? '')) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h1>
            <p className="text-red-700 mb-4">
              You don&apos;t have permission to access the admin panel.
            </p>
            <p className="text-sm text-red-600">
              Contact the system administrator if you believe this is an error.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <UserManagement />
      </div>
    </div>
  )
}
