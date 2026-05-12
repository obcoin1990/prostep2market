import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api'
import { format } from 'date-fns'
import { CertificatePDF } from '@/components/certificate/CertificatePDF'

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
