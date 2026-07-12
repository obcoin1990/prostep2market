'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import * as Sentry from '@sentry/nextjs'

interface RouteErrorProps {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
  description?: string
}

export function RouteError({
  error,
  reset,
  title = 'Something went wrong',
  description,
}: RouteErrorProps) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4 text-center">
      <div className="rounded-full bg-red-500/10 p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
      <p className="text-sm text-white/60 max-w-md mb-6">
        {description || error.message || 'An unexpected error occurred.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  )
}
