import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { apiError, apiSuccess } from '@/lib/api'

type Params = { params: { id: string } }

// GET /api/certificates/[id] — get single cert (public for verification)
export async function GET(req: NextRequest, { params }: Params) {
  const cert = await prisma.certificate.findUnique({
    where:   { id: params.id },
    include: {
      user: { select: { name: true, email: true } },
    },
  })
  if (!cert) return apiError('Certificate not found', 404)

  const course = await prisma.course.findUnique({
    where:  { id: cert.courseId },
    select: {
      title:  true,
      author: { select: { name: true } },
    },
  })

  const org = cert.user
    ? await prisma.organization.findFirst({
        where:  { users: { some: { id: cert.userId } } },
        select: { name: true },
      })
    : null

  return apiSuccess({
    ...cert,
    course,
    instructorName: course?.author?.name ?? 'ProStep Instructor',
    orgName:        org?.name ?? 'ProStep',
  })
}
