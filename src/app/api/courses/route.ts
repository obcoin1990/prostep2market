import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireRole, apiError, apiSuccess } from '@/lib/api'

const CreateCourseSchema = z.object({
  title:       z.string().min(3),
  description: z.string().min(10),
  category:    z.string(),
  level:       z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  tags:        z.array(z.string()).optional(),
  durationMins: z.number().optional(),
})

// GET /api/courses — list all published courses (+ org private ones)
export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error

  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const level    = searchParams.get('level')
  const search   = searchParams.get('q')
  const page     = parseInt(searchParams.get('page') ?? '1')
  const perPage  = 12

  const where: any = {
    AND: [
      {
        OR: [
          { published: true, organizationId: null },
          { organizationId: session!.user.organizationId },
        ],
      },
      category ? { category } : {},
      level    ? { level }    : {},
      search   ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { has: search.toLowerCase() } },
        ],
      } : {},
    ],
  }

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        author:  { select: { id: true, name: true, avatarUrl: true } },
        _count:  { select: { enrollments: true, modules: true } },
      },
    }),
    prisma.course.count({ where }),
  ])

  return apiSuccess({ courses, total, page, totalPages: Math.ceil(total / perPage) })
}

// POST /api/courses — create a course (ADMIN or MANAGER)
export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(['ADMIN', 'MANAGER', 'SUPER_ADMIN'])
  if (error) return error

  try {
    const body = await req.json()
    const data = CreateCourseSchema.parse(body)

    const course = await prisma.course.create({
      data: {
        ...data,
        tags:           data.tags ?? [],
        authorId:       session!.user.id,
        organizationId: session!.user.organizationId ?? undefined,
      },
    })

    return apiSuccess(course, 201)
  } catch (err: any) {
    if (err.name === 'ZodError') return apiError(err.errors, 422)
    console.error(err)
    return apiError('Internal server error', 500)
  }
}
