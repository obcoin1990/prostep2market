import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api'

type Params = { params: Promise<{ id: string }> }

const SubmitSchema = z.object({
  // { questionId: optionId[] }
  answers: z.record(z.string(), z.array(z.string())),
})

// POST /api/quizzes/[id]/attempt — submit quiz answers, get graded result
export async function POST(req: NextRequest, { params }: Params) {
  const { id: quizId } = await params
  const { session, error } = await requireAuth()
  if (error) return error

  const body = await req.json()
  const { answers } = SubmitSchema.parse(body)

  const quiz = await prisma.quiz.findUnique({
    where:   { id: quizId },
    include: {
      questions: {
        include: { options: true },
      },
      attempts: {
        where: { userId: session!.user.id },
        orderBy: { startedAt: 'desc' },
      },
      lesson: {
        select: {
          id:     true,
          module: { select: { courseId: true } },
        },
      },
    },
  })

  if (!quiz) return apiError('Quiz not found', 404)

  // Enforce max attempts
  const attemptCount = quiz.attempts.length
  if (attemptCount >= quiz.maxAttempts) {
    return apiError(`Maximum ${quiz.maxAttempts} attempts reached`, 429)
  }

  // Grade answers
  let correct = 0
  const feedback: Record<string, {
    correct: boolean
    correctOptionIds: string[]
    selectedOptionIds: string[]
  }> = {}

  for (const question of quiz.questions) {
    const correctIds  = question.options.filter(o => o.isCorrect).map(o => o.id)
    const selectedIds = answers[question.id] ?? []

    // Correct if selected set exactly matches correct set
    const isCorrect =
      correctIds.length === selectedIds.length &&
      correctIds.every(id => selectedIds.includes(id))

    if (isCorrect) correct++

    feedback[question.id] = {
      correct:           isCorrect,
      correctOptionIds:  correctIds,
      selectedOptionIds: selectedIds,
    }
  }

  const totalQuestions = quiz.questions.length
  const score          = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0
  const passed         = score >= quiz.passMark

  // Persist attempt
  const attempt = await prisma.quizAttempt.create({
    data: {
      userId:      session!.user.id,
      quizId:      quiz.id,
      score,
      passed,
      answers,
      completedAt: new Date(),
    },
  })

  // If passed, mark lesson as completed + recalculate course progress
  if (passed) {
    const lessonId = quiz.lessonId
    const courseId = quiz.lesson.module.courseId

    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: session!.user.id, courseId },
    })

    if (enrollment) {
      await prisma.lessonProgress.upsert({
        where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
        update: { completed: true, completedAt: new Date() },
        create: {
          enrollmentId: enrollment.id,
          lessonId,
          completed:    true,
          completedAt:  new Date(),
        },
      })

      // Recalculate overall course progress
      const [totalLessons, completedLessons] = await Promise.all([
        prisma.lesson.count({
          where: { module: { courseId } },
        }),
        prisma.lessonProgress.count({
          where: { enrollmentId: enrollment.id, completed: true },
        }),
      ])

      const progress = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0

      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data:  {
          progress,
          status:      progress === 100 ? 'COMPLETED' : 'ACTIVE',
          completedAt: progress === 100 ? new Date() : undefined,
        },
      })

      // Auto-issue certificate when course 100% complete
      if (progress === 100) {
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
    }
  }

  return apiSuccess({
    attemptId:    attempt.id,
    score,
    passed,
    passMark:     quiz.passMark,
    correct,
    total:        totalQuestions,
    attemptsUsed: attemptCount + 1,
    maxAttempts:  quiz.maxAttempts,
    feedback,
  })
}

// GET /api/quizzes/[id]/attempt — get user's attempt history for this quiz
export async function GET(_req: NextRequest, { params }: Params) {
  const { id: quizId } = await params
  const { session, error } = await requireAuth()
  if (error) return error

  const attempts = await prisma.quizAttempt.findMany({
    where:   { quizId, userId: session!.user.id },
    orderBy: { startedAt: 'desc' },
  })

  const quiz = await prisma.quiz.findUnique({
    where:  { id: quizId },
    select: { maxAttempts: true, passMark: true },
  })

  return apiSuccess({
    attempts,
    attemptsUsed:      attempts.length,
    maxAttempts:       quiz?.maxAttempts ?? 3,
    attemptsRemaining: Math.max(0, (quiz?.maxAttempts ?? 3) - attempts.length),
    bestScore:         attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : null,
    passed:            attempts.some(a => a.passed),
  })
}
