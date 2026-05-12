'use client'

import { useState } from 'react'
import { CertificatePreview } from '@/components/certificate/CertificatePreview'
import { Award } from 'lucide-react'

interface Cert {
  id:            string
  issueDate:     string
  verifyToken:   string
  courseId:      string
  course:        { title: string; author: { name: string | null } | null } | null
  user:          { name: string | null } | null
  instructorName?: string
  orgName?:        string
}

interface Props { certs: Cert[] }

export function CertificateList({ certs }: Props) {
  const [selected, setSelected] = useState<Cert | null>(null)
  const [downloading, setDownloading] = useState(false)

  async function handleDownload(cert: Cert) {
    setDownloading(true)
    try {
      const res = await fetch(`/api/certificates/${cert.id}/pdf`)
      if (!res.ok) throw new Error('Failed')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `certificate-${cert.verifyToken.slice(0, 8)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  if (certs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Award className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-sm font-medium text-gray-500">No certificates yet</p>
        <p className="text-xs text-gray-400 mt-1">Complete a course to earn your first certificate.</p>
      </div>
    )
  }

  if (selected) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-brand-500 hover:underline"
        >
          ← Back to all certificates
        </button>
        <CertificatePreview
          recipientName={selected.user?.name ?? 'Learner'}
          courseTitle={selected.course?.title ?? 'Course'}
          issueDate={selected.issueDate}
          verifyToken={selected.verifyToken}
          orgName={selected.orgName ?? 'ProStep'}
          instructorName={selected.instructorName ?? selected.course?.author?.name ?? 'Instructor'}
          onDownload={() => handleDownload(selected)}
          downloading={downloading}
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {certs.map((cert) => (
        <button
          key={cert.id}
          onClick={() => setSelected(cert)}
          className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm hover:border-brand-300 hover:shadow-md transition group"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-brand-50 p-2.5">
              <Award className="h-5 w-5 text-brand-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-600">
                {cert.course?.title ?? 'Course'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(cert.issueDate).toLocaleDateString('en', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
