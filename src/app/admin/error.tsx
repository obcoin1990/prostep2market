'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4 text-center">
      <div className="rounded-full bg-red-500/10 p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <h2 className="text-lg font-semibold text-white mb-2">Admin area error</h2>
      <p className="text-sm text-white/60 max-w-md mb-6">
        {error.message || 'An unexpected error occurred in the admin area.'}
      </p>
      <button type="button" onClick={reset} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  )
}
