import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { StatCard } from '@/components/dashboard/StatCard'
import { CompletionTrendChart, TopCoursesChart, ActiveUsersPie } from '@/components/dashboard/Charts'
import { Users, TrendingUp, BookOpen, AlertTriangle } from 'lucide-react'

async function getAnalytics(orgId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/analytics?days=30`,
    { cache: 'no-store', headers: { Cookie: '' } }
  )
  if (!res.ok) return null
  const json = await res.json()
  return json.data
}

export default async function ManagerDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  if (!['ADMIN', 'MANAGER', 'SUPER_ADMIN'].includes(session.user.role)) {
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

// Client component for live stats
import ManagerStats from './ManagerStats'
