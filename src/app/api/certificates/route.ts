import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api'

// GET /api/certificates — list current user's certificates
export async function GET(_req: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error

  const certs = await prisma.certificate.findMany({
    where:   { userId: session!.user.id },
    orderBy: { issueDate: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
    },
  })

  // Attach course info manually (no FK on Certificate to course currently —
  // we store courseId for reference)
  const courseIds = certs.map(c => c.courseId)
  const courses   = await prisma.course.findMany({
    where:  { id: { in: courseIds } },
    select: {
      id:     true,
      title:  true,
      author: { select: { name: true } },
    },
  })

  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]))

  const result = certs.map(cert => ({
    ...cert,
    course: courseMap[cert.courseId] ?? null,
  }))

  return apiSuccess(result)
}

// POST /api/certificates — issue certificate (called internally after course completion)
export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error

  const { courseId } = await req.json()
  if (!courseId) return apiError('courseId is required')

  // Verify user completed the course
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session!.user.id, courseId } },
  })
  if (!enrollment)           return apiError('Not enrolled in this course', 404)
  if (enrollment.progress < 100) return apiError('Course not yet completed', 400)

  // Idempotent — return existing if already issued
  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId: session!.user.id, courseId } },
  })
  if (existing) return apiSuccess(existing)

  const cert = await prisma.certificate.create({
    data: {
      userId:   session!.user.id,
      courseId,
      title:    'Certificate of Completion',
    },
  })

  // Notify
  const course = await prisma.course.findUnique({
    where:  { id: courseId },
    select: { title: true },
  })
  await prisma.notification.create({
    data: {
      userId: session!.user.id,
      type:   'CERT_EARNED',
      title:  'Certificate earned!',
      body:   `You earned a certificate for "${course?.title}"`,
      link:   `/dashboard/learner/certs`,
    },
  })

  return apiSuccess(cert, 201)
}
