import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { CheckCircle, XCircle } from 'lucide-react'

interface Props {
  params: { token: string }
}

export default async function VerifyPage({ params }: Props) {
  const cert = await prisma.certificate.findUnique({
    where:   { verifyToken: params.token },
    include: {
      user: { select: { name: true } },
    },
  })

  const valid = !!cert

  const course = valid
    ? await prisma.course.findUnique({
        where:  { id: cert!.courseId },
        select: { title: true, author: { select: { name: true } } },
      })
    : null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white shadow-lg p-8 text-center">
        {valid ? (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">Certificate Valid</h1>
            <p className="text-sm text-gray-500 mb-6">
              This certificate has been verified as authentic.
            </p>

            <div className="rounded-xl bg-gray-50 p-5 text-left space-y-3 mb-6">
              <Row label="Recipient"   value={cert!.user?.name ?? '—'} />
              <Row label="Course"      value={course?.title ?? '—'} />
              <Row label="Instructor"  value={course?.author?.name ?? 'ProStep'} />
              <Row label="Issue Date"  value={format(cert!.issueDate, 'MMMM d, yyyy')} />
              {cert!.expiresAt && (
                <Row label="Expires"   value={format(cert!.expiresAt, 'MMMM d, yyyy')} />
              )}
            </div>

            <p className="text-xs text-gray-400">
              Verification ID: <span className="font-mono text-brand-500">{params.token}</span>
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">Certificate Not Found</h1>
            <p className="text-sm text-gray-500">
              This certificate link is invalid or has been revoked.
            </p>
          </>
        )}

        <a
          href="/"
          className="mt-6 inline-block text-sm text-brand-500 hover:underline"
        >
          Go to ProStep
        </a>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  )
}
