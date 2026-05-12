import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiError } from '@/lib/api'
import { format } from 'date-fns'
import { CertificatePDF } from '@/components/certificate/CertificatePDF'

type Params = { params: { id: string } }

// GET /api/certificates/[id]/pdf — stream PDF download
export async function GET(req: NextRequest, { params }: Params) {
  const { session, error } = await requireAuth()
  if (error) return error

  const cert = await prisma.certificate.findUnique({
    where:   { id: params.id },
    include: {
      user: { select: { name: true, email: true } },
    },
  })
  if (!cert) return apiError('Certificate not found', 404)

  // Only the cert owner or an admin can download
  if (cert.userId !== session!.user.id && session!.user.role === 'LEARNER') {
    return apiError('Forbidden', 403)
  }

  const course = await prisma.course.findUnique({
    where:  { id: cert.courseId },
    select: { title: true, author: { select: { name: true } } },
  })

  const org = await prisma.organization.findFirst({
    where:  { users: { some: { id: cert.userId } } },
    select: { name: true },
  })

  const pdfBuffer = await renderToBuffer(
    createElement(CertificatePDF, {
      recipientName:  cert.user?.name ?? 'Learner',
      courseTitle:    course?.title ?? 'Course',
      issueDate:      format(cert.issueDate, 'MMMM d, yyyy'),
      verifyToken:    cert.verifyToken,
      appUrl:         process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.prostep.io',
      instructorName: course?.author?.name ?? 'Instructor',
      orgName:        org?.name ?? 'ProStep',
    })
  )

  const filename = `certificate-${cert.verifyToken.slice(0, 8)}.pdf`

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length':      pdfBuffer.byteLength.toString(),
    },
  })
}
