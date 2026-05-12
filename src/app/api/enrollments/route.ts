import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api'

// POST /api/enrollments — enroll current user in a course
export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error

  const { courseId, dueDate } = await req.json()
  if (!courseId) return apiError('courseId is required')

  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course || !course.published) return apiError('Course not found', 404)

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session!.user.id, courseId } },
  })
  if (existing) return apiError('Already enrolled', 409)

  const enrollment = await prisma.enrollment.create({
    data: {
      userId:   session!.user.id,
      courseId,
      dueDate:  dueDate ? new Date(dueDate) : undefined,
    },
    include: { course: { select: { title: true } } },
  })

  // Notify user
  await prisma.notification.create({
    data: {
      userId: session!.user.id,
      type:   'COURSE_ASSIGNED',
      title:  'New course available',
      body:   `You've been enrolled in "${enrollment.course.title}"`,
      link:   `/courses/${courseId}`,
    },
  })

  return apiSuccess(enrollment, 201)
}

// GET /api/enrollments — get current user's enrollments
export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error

  const enrollments = await prisma.enrollment.findMany({
    where:   { userId: session!.user.id },
    orderBy: { enrolledAt: 'desc' },
    include: {
      course: {
        include: {
          _count: { select: { modules: true } },
        },
      },
    },
  })

  return apiSuccess(enrollments)
}
