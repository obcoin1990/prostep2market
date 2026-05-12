import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CertificateList } from '@/components/certificate/CertificateList'
import { Award } from 'lucide-react'

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const certs = await prisma.certificate.findMany({
    where:   { userId: session.user.id },
    orderBy: { issueDate: 'desc' },
    include: { user: { select: { name: true } } },
  })

  const courseIds = certs.map(c => c.courseId)
  const courses   = await prisma.course.findMany({
    where:  { id: { in: courseIds } },
    select: { id: true, title: true, author: { select: { name: true } } },
  })
  const courseMap = Object.fromEntries(courses.map(c => [c.id, c]))

  const org = session.user.organizationId
    ? await prisma.organization.findUnique({
        where:  { id: session.user.organizationId },
        select: { name: true },
      })
    : null

  const enriched = certs.map(cert => ({
    ...cert,
    issueDate:      cert.issueDate.toISOString(),
    course:         courseMap[cert.courseId] ?? null,
    instructorName: courseMap[cert.courseId]?.author?.name ?? 'ProStep Instructor',
    orgName:        org?.name ?? 'ProStep',
  }))

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-brand-50 p-2.5">
          <Award className="h-5 w-5 text-brand-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-sm text-gray-500">{certs.length} certificate{certs.length !== 1 ? 's' : ''} earned</p>
        </div>
      </div>

      <CertificateList certs={enriched as any} />
    </main>
  )
}
