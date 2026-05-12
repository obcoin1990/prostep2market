'use client'

import { Award, CheckCircle, ExternalLink, Download } from 'lucide-react'
import { format } from 'date-fns'

interface CertificatePreviewProps {
  recipientName:  string
  courseTitle:    string
  issueDate:      string | Date
  verifyToken:    string
  orgName:        string
  instructorName: string
  onDownload?:    () => void
  downloading?:   boolean
}

export function CertificatePreview({
  recipientName,
  courseTitle,
  issueDate,
  verifyToken,
  orgName,
  instructorName,
  onDownload,
  downloading,
}: CertificatePreviewProps) {
  const formatted = format(new Date(issueDate), 'MMMM d, yyyy')
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${verifyToken}`

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Certificate card */}
      <div className="relative bg-white rounded-2xl border-4 border-brand-500 shadow-2xl overflow-hidden">
        {/* Inner border */}
        <div className="absolute inset-3 rounded-xl border border-brand-200 pointer-events-none" />

        {/* Verified badge */}
        <div className="absolute top-5 right-5 w-16 h-16 rounded-full bg-brand-50 border-2 border-brand-500 flex flex-col items-center justify-center">
          <Award className="h-6 w-6 text-brand-500" />
          <span className="text-[8px] font-bold text-brand-600 uppercase tracking-wide leading-tight text-center">
            Verified
          </span>
        </div>

        <div className="px-12 py-10 flex flex-col items-center text-center">
          {/* Logo */}
          <p className="text-2xl font-black text-brand-500 tracking-widest">ProStep</p>
          <p className="text-[10px] text-brand-300 tracking-[0.3em] uppercase mb-8">
            Corporate Learning Platform
          </p>

          <p className="text-xs font-semibold text-gray-400 tracking-[0.25em] uppercase mb-4">
            Certificate of Completion
          </p>

          <p className="text-sm text-gray-500 mb-2">This is to certify that</p>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">{recipientName}</h2>

          <div className="w-16 h-0.5 bg-brand-500 mb-4" />

          <p className="text-sm text-gray-500 mb-2">has successfully completed the course</p>

          <h3 className="text-xl font-bold text-brand-700 mb-2">{courseTitle}</h3>

          <p className="text-xs text-gray-400 mb-8">Issued on {formatted}</p>

          {/* Signatures */}
          <div className="w-full grid grid-cols-3 gap-4 mb-6">
            {[
              { name: instructorName, role: 'Course Instructor' },
              { name: orgName,        role: 'Organization' },
              { name: 'ProStep',      role: 'Certification Authority' },
            ].map((s) => (
              <div key={s.role} className="flex flex-col items-center">
                <div className="w-full h-px bg-gray-300 mb-2" />
                <p className="text-xs font-semibold text-gray-700">{s.name}</p>
                <p className="text-[10px] text-gray-400">{s.role}</p>
              </div>
            ))}
          </div>

          {/* Verify */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
            <span>Verify at:</span>
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-500 font-mono hover:underline"
            >
              {verifyUrl}
            </a>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4 justify-center">
        <button
          onClick={onDownload}
          disabled={downloading}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {downloading ? 'Generating PDF…' : 'Download PDF'}
        </button>
        <a
          href={verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ExternalLink className="h-4 w-4" />
          Share Link
        </a>
      </div>
    </div>
  )
}
