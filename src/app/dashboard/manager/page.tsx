import { redirect } from 'next/navigation'
import { getPageSession } from '@/lib/auth'
import ManagerStats from './ManagerStats'

export default async function ManagerDashboard() {
  const session = await getPageSession()
  if (!session) redirect('/login')
  if (!['ADMIN', 'MANAGER', 'SUPER_ADMIN'].includes(session.role)) {
    redirect('/dashboard/learner')
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Team Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Last 30 days</p>
      </div>

      {/* Stats — loaded client-side to avoid session cookie complexity in RSC fetch */}
      <ManagerStats />
    </main>
  )
}
