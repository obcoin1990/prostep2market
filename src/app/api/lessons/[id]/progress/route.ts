import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api'

type Params = { params: { id: string } }

const ProgressSchema = z.object({
  watchedSec:   z.number().min(0),
  completed:    z.boolean().optional(),
  enrollmentId: z.string(),
})

// PATCH /api/lessons/[id]/progress — update watch progress
export async function PATCH(req: NextRequest, { params }: Params) {
  const { session, error } = await requireAuth()
  if (error) return error

  const body = await req.json()
  const { watchedSec, completed, enrollmentId } = ProgressSchema.parse(body)

  // Verify enrollment belongs to user
  const enrollment = await prisma.enrollment.findFirst({
    where: { id: enrollmentId, userId: session!.user.id },
  })
  if (!enrollment) return apiError('Enrollment not found', 404)

  // Get lesson to compute completion threshold (90% of video)
  const lesson = await prisma.lesson.findUnique({ where: { id: params.id } })
  if (!lesson)  return apiError('Lesson not found', 404)

  const autoComplete =
    completed ??
    (lesson.durationSec > 0 && watchedSec >= lesson.durationSec * 0.9)

  const progress = await prisma.lessonProgress.upsert({
    where:  { enrollmentId_lessonId: { enrollmentId, lessonId: params.id } },
    update: {
      watchedSec,
      completed:   autoComplete,
      completedAt: autoComplete ? new Date() : undefined,
    },
    create: {
      enrollmentId,
      lessonId:    params.id,
      watchedSec,
      completed:   autoComplete,
      completedAt: autoComplete ? new Date() : undefined,
    },
  })

  // Recalculate course progress
  const courseId = (
    await prisma.module.findFirst({
      where:  { lessons: { some: { id: params.id } } },
      select: { courseId: true },
    })
  )?.courseId

  if (courseId) {
    const [totalLessons, completedLessons] = await Promise.all([
      prisma.lesson.count({ where: { module: { courseId } } }),
      prisma.lessonProgress.count({
        where: { enrollmentId, completed: true },
      }),
    ])

    const courseProgress = totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0

    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data:  {
        progress:    courseProgress,
        status:      courseProgress === 100 ? 'COMPLETED' : 'ACTIVE',
        completedAt: courseProgress === 100 ? new Date() : undefined,
      },
    })

    // Auto-issue certificate if completed
    if (courseProgress === 100) {
      const existingCert = await prisma.certificate.findUnique({
        where: { userId_courseId: { userId: session!.user.id, courseId } },
      })
      if (!existingCert) {
        await prisma.certificate.create({
          data: { userId: session!.user.id, courseId, title: 'Certificate of Completion' },
        })
        const course = await prisma.course.findUnique({
          where: { id: courseId }, select: { title: true },
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
      }
    }

    return apiSuccess({ progress: courseProgress, lessonProgress: progress })
  }

  return apiSuccess({ lessonProgress: progress })
}

// GET /api/lessons/[id]/progress — get progress for a specific lesson
export async function GET(req: NextRequest, { params }: Params) {
  const { session, error } = await requireAuth()
  if (error) return error

  const { searchParams } = new URL(req.url)
  const enrollmentId = searchParams.get('enrollmentId')
  if (!enrollmentId) return apiError('enrollmentId required')

  const progress = await prisma.lessonProgress.findUnique({
    where: { enrollmentId_lessonId: { enrollmentId, lessonId: params.id } },
  })

  return apiSuccess(progress ?? { watchedSec: 0, completed: false })
}
