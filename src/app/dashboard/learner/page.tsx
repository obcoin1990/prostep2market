import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CourseCard } from '@/components/course/CourseCard'
import { StatCard } from '@/components/dashboard/StatCard'
import { BookOpen, Award, Clock, TrendingUp } from 'lucide-react'

export default async function LearnerDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = session.user.id

  const [enrollments, certificates, learningPath] = await Promise.all([
    prisma.enrollment.findMany({
      where:   { userId },
      orderBy: { enrolledAt: 'desc' },
      take:    6,
      include: {
        course: {
          include: {
            author:  { select: { id: true, name: true, avatarUrl: true } },
            _count:  { select: { enrollments: true, modules: true } },
          },
        },
      },
    }),
    prisma.certificate.count({ where: { userId } }),
    prisma.learningPath.findUnique({
      where:   { userId },
      include: { courses: { take: 3, orderBy: { order: 'asc' }, include: { course: true } } },
    }),
  ])

  const avgProgress =
    enrollments.length > 0
      ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length)
      : 0

  const completed = enrollments.filter(e => e.status === 'COMPLETED').length

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Welcome back, {session.user.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Continue where you left off</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Enrolled Courses"  value={enrollments.length} icon={BookOpen}   color="brand" />
        <StatCard label="Completed"          value={completed}          icon={TrendingUp}  color="green" />
        <StatCard label="Certificates"       value={certificates}       icon={Award}       color="yellow" />
        <StatCard label="Avg Progress"       value={avgProgress}        icon={Clock}       suffix="%" color="brand" />
      </div>

      {/* Learning Path CTA */}
      {!learningPath && (
        <div className="rounded-xl border-2 border-dashed border-brand-200 bg-brand-50 p-6 text-center">
          <p className="text-sm font-semibold text-brand-700">No learning path yet</p>
          <p className="text-xs text-brand-500 mt-1">
            Let AI build a personalized roadmap based on your career goal.
          </p>
          <a
            href="/dashboard/learner/path"
            className="mt-3 inline-block rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Generate My Path
          </a>
        </div>
      )}

      {/* My Courses */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">My Courses</h2>
        {enrollments.length === 0 ? (
          <p className="text-sm text-gray-400">No courses yet. Browse the catalog to enroll.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((e) => (
              <CourseCard
                key={e.id}
                course={e.course as any}
                progress={e.progress}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
