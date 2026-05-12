import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole, apiError, apiSuccess } from '@/lib/api'

type Params = { params: Promise<{ id: string }> }

// GET /api/courses/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const { error } = await requireAuth()
  if (error) return error

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      author:  { select: { id: true, name: true, avatarUrl: true, jobTitle: true } },
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            include: { quiz: { select: { id: true, title: true, passMark: true } } },
          },
        },
      },
      _count: { select: { enrollments: true } },
    },
  })

  if (!course) return apiError('Course not found', 404)
  return apiSuccess(course)
}

// PATCH /api/courses/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const { session, error } = await requireRole(['ADMIN', 'MANAGER', 'SUPER_ADMIN'])
  if (error) return error

  const body = await req.json()

  const course = await prisma.course.findUnique({ where: { id } })
  if (!course) return apiError('Course not found', 404)

  // Only author or admin can edit
  if (course.authorId !== session!.user.id && session!.user.role !== 'ADMIN') {
    return apiError('Forbidden', 403)
  }

  const updated = await prisma.course.update({
    where: { id },
    data:  body,
  })

  return apiSuccess(updated)
}

// DELETE /api/courses/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const { error } = await requireRole(['ADMIN', 'SUPER_ADMIN'])
  if (error) return error

  await prisma.course.delete({ where: { id } })
  return apiSuccess({ deleted: true })
}
