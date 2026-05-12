import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { StatCard } from '@/components/dashboard/StatCard'
import { Users, BookOpen, Award, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) redirect('/dashboard/learner')

  const orgId = session.user.organizationId!

  const [userCount, courseCount, certCount, enrollmentCount] = await Promise.all([
    prisma.user.count({ where: { organizationId: orgId } }),
    prisma.course.count({ where: { organizationId: orgId } }),
    prisma.certificate.count({ where: { user: { organizationId: orgId } } }),
    prisma.enrollment.count({ where: { user: { organizationId: orgId } } }),
  ])

  const recentUsers = await prisma.user.findMany({
    where:   { organizationId: orgId },
    orderBy: { createdAt: 'desc' },
    take:    5,
    select:  { id: true, name: true, email: true, role: true, createdAt: true },
  })

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Organization overview</p>
        </div>
        <Link
          href="/dashboard/admin/users/invite"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          + Invite Users
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Users"    value={userCount}      icon={Users}     color="brand" />
        <StatCard label="Courses"        value={courseCount}    icon={BookOpen}  color="green" />
        <StatCard label="Enrollments"    value={enrollmentCount}icon={DollarSign}color="yellow"/>
        <StatCard label="Certificates"   value={certCount}      icon={Award}     color="brand" />
      </div>

      {/* Recent Users */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Recent Users</h2>
          <Link href="/dashboard/admin/users" className="text-xs text-brand-500 hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentUsers.map(u => (
            <div key={u.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{u.name ?? '—'}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Manage Users',    href: '/dashboard/admin/users' },
          { label: 'Manage Courses',  href: '/dashboard/admin/courses' },
          { label: 'Analytics',       href: '/dashboard/admin/analytics' },
          { label: 'Settings',        href: '/dashboard/admin/settings' },
        ].map(l => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-xl border border-gray-200 bg-white p-4 text-center text-sm font-medium text-gray-700 shadow-sm hover:border-brand-300 hover:text-brand-600 transition"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </main>
  )
}
