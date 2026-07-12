'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0e11] px-6">
      <div className="text-center max-w-md">
        <div className="text-[100px] mb-4">⚠️</div>
        <h1 className="text-2xl font-semibold text-white mb-2">Something went wrong</h1>
        <p className="text-white/60 mb-8">
          An unexpected error occurred. Try again, or contact support if the issue persists.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#fcd535] text-[#181a20] font-medium hover:bg-[#f0b90b] transition-colors cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
