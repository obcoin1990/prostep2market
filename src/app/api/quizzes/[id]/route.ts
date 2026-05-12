import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api'

type Params = { params: { id: string } }

// GET /api/quizzes/[id] — fetch quiz with questions (no correct answers exposed)
export async function GET(_req: NextRequest, { params }: Params) {
  const { error } = await requireAuth()
  if (error) return error

  const quiz = await prisma.quiz.findUnique({
    where:   { id: params.id },
    include: {
      questions: {
        orderBy: { order: 'asc' },
        include: {
          options: {
            orderBy: { order: 'asc' },
            // Never expose isCorrect to the client
            select: { id: true, text: true, order: true },
          },
        },
      },
      lesson: {
        select: {
          id:    true,
          title: true,
          module: { select: { courseId: true } },
        },
      },
    },
  })

  if (!quiz) return apiError('Quiz not found', 404)

  return apiSuccess(quiz)
}
