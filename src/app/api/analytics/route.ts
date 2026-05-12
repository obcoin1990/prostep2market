import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole, apiError, apiSuccess } from '@/lib/api'

// GET /api/analytics — ROI dashboard data for managers/admins
export async function GET(req: NextRequest) {
  const { session, error } = await requireRole(['ADMIN', 'MANAGER', 'SUPER_ADMIN'])
  if (error) return error

  const orgId = session!.user.organizationId
  if (!orgId) return apiError('No organization', 400)

  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') ?? '30')
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    activeUsers,
    totalEnrollments,
    completedEnrollments,
    avgProgress,
    topCourses,
    completionsByDay,
    skillImprovements,
    overdueCount,
  ] = await Promise.all([
    // Total users in org
    prisma.user.count({ where: { organizationId: orgId } }),

    // Users active in period (has lesson progress)
    prisma.user.count({
      where: {
        organizationId: orgId,
        enrollments: {
          some: { lessonProgress: { some: { completedAt: { gte: since } } } },
        },
      },
    }),

    // Total enrollments
    prisma.enrollment.count({
      where: { user: { organizationId: orgId } },
    }),

    // Completed enrollments in period
    prisma.enrollment.count({
      where: {
        user:        { organizationId: orgId },
        status:      'COMPLETED',
        completedAt: { gte: since },
      },
    }),

    // Average progress
    prisma.enrollment.aggregate({
      where:   { user: { organizationId: orgId }, status: 'ACTIVE' },
      _avg:    { progress: true },
    }),

    // Top 5 courses by completion rate
    prisma.course.findMany({
      where:   { organizationId: orgId },
      orderBy: { enrollments: { _count: 'desc' } },
      take:    5,
      include: {
        _count: { select: { enrollments: true } },
      },
    }),

    // Completions per day (last N days)
    prisma.enrollment.groupBy({
      by:      ['completedAt'],
      where:   {
        user:        { organizationId: orgId },
        status:      'COMPLETED',
        completedAt: { gte: since },
      },
      _count:  { completedAt: true },
      orderBy: { completedAt: 'asc' },
    }),

    // Skill assessment improvements
    prisma.skillAssessment.groupBy({
      by:      ['skill'],
      where:   { user: { organizationId: orgId }, assessedAt: { gte: since } },
      _avg:    { score: true },
      orderBy: { _avg: { score: 'desc' } },
      take:    5,
    }),

    // Overdue courses
    prisma.enrollment.count({
      where: {
        user:    { organizationId: orgId },
        status:  'ACTIVE',
        dueDate: { lt: new Date() },
      },
    }),
  ])

  return apiSuccess({
    summary: {
      totalUsers,
      activeUsers,
      activeRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
      totalEnrollments,
      completedEnrollments,
      completionRate:
        totalEnrollments > 0
          ? Math.round((completedEnrollments / totalEnrollments) * 100)
          : 0,
      avgProgress: Math.round(avgProgress._avg.progress ?? 0),
      overdueCount,
    },
    topCourses,
    completionsByDay,
    skillImprovements,
  })
}
