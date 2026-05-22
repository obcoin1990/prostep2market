import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

/**
 * GET /api/admin/users/[id]/full
 *
 * Returns a comprehensive profile of a single user for the admin detail drawer:
 *   - Supabase Auth metadata
 *   - Prisma User (name, role, org)
 *   - Trader DNA (trader_profiles)
 *   - Risk Guardian alerts
 *   - Strategy Lab entries
 *   - Certificates + Enrollments
 *   - Subscription info (via org)
 */
export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAdminContext()
  if (ctx instanceof NextResponse) return ctx

  const { id } = await params
  const admin = createAdminClient()

  // Fan out all fetches in parallel
  const [
    authResult,
    profileResult,
    prismaResult,
    alertsResult,
    tradesResult,
    strategiesResult,
  ] = await Promise.all([
    // Supabase Auth user
    admin.auth.admin.getUserById(id),

    // Trader DNA profile
    admin.from('trader_profiles').select('*').eq('id', id).single(),

    // Prisma: User + org + certs + enrollments
    prisma.user
      .findUnique({
        where: { id },
        include: {
          organization: {
            include: { subscription: true },
          },
          certificates: {
            orderBy: { issueDate: 'desc' },
            take: 10,
          },
          enrollments: {
            orderBy: { enrolledAt: 'desc' },
            take: 10,
            include: {
              course: { select: { id: true, title: true, level: true } },
            },
          },
        },
      })
      .catch(() => null),

    // Risk Guardian: last 10 alerts
    admin
      .from('alerts')
      .select('id, type, severity, title, message, acknowledged, triggered_at')
      .eq('user_id', id)
      .order('triggered_at', { ascending: false })
      .limit(10),

    // Trades: count + recent 5
    admin
      .from('trades')
      .select('id, symbol, result, pnl, entry_time, exit_time', { count: 'exact' })
      .eq('user_id', id)
      .order('entry_time', { ascending: false })
      .limit(5),

    // Strategy Lab: count + recent 5
    admin
      .from('strategies')
      .select('id, name, description, created_at', { count: 'exact' })
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  if (authResult.error) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Compute alert stats
  const alerts = alertsResult.data ?? []
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged).length

  // Enrich certificates with course titles (Certificate has courseId, no FK in schema)
  const courseIds = (prismaResult?.certificates ?? []).map((c) => c.courseId)
  const courses = courseIds.length
    ? await prisma.course.findMany({
        where: { id: { in: courseIds } },
        select: { id: true, title: true },
      })
    : []
  const courseMap = Object.fromEntries(courses.map((c) => [c.id, c.title]))

  return NextResponse.json({
    authUser: {
      id: authResult.data.user.id,
      email: authResult.data.user.email ?? null,
      createdAt: authResult.data.user.created_at,
      lastSignInAt: authResult.data.user.last_sign_in_at ?? null,
      emailConfirmedAt: authResult.data.user.email_confirmed_at ?? null,
      bannedUntil: (authResult.data.user as any).banned_until ?? null,
    },
    prismaUser: prismaResult
      ? {
          id: prismaResult.id,
          name: prismaResult.name,
          email: prismaResult.email,
          role: prismaResult.role,
          avatarUrl: prismaResult.avatarUrl,
          organizationId: prismaResult.organizationId,
          organization: prismaResult.organization
            ? {
                id: prismaResult.organization.id,
                name: prismaResult.organization.name,
                plan: prismaResult.organization.plan,
                subscription: prismaResult.organization.subscription ?? null,
              }
            : null,
          createdAt: prismaResult.createdAt.toISOString(),
          updatedAt: prismaResult.updatedAt.toISOString(),
        }
      : null,
    traderProfile: profileResult.data ?? null,
    alerts: {
      total: alerts.length,
      unacknowledged: unacknowledgedAlerts,
      recent: alerts,
    },
    trades: {
      total: tradesResult.count ?? 0,
      recent: tradesResult.data ?? [],
    },
    strategies: {
      total: strategiesResult.count ?? 0,
      recent: strategiesResult.data ?? [],
    },
    certificates: (prismaResult?.certificates ?? []).map((c) => ({
      id: c.id,
      courseId: c.courseId,
      title: courseMap[c.courseId] ?? c.title,
      issueDate: c.issueDate.toISOString(),
      verificationToken: c.verifyToken,
    })),
    enrollments: (prismaResult?.enrollments ?? []).map((e) => ({
      id: e.id,
      courseId: e.courseId,
      courseTitle: e.course.title,
      courseLevel: e.course.level,
      status: e.status,
      progress: e.progress,
      enrolledAt: e.enrolledAt.toISOString(),
      completedAt: e.completedAt?.toISOString() ?? null,
    })),
  })
}
