'use client'

import { RouteError } from '@/components/ui/route-error'

export default function JournalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <RouteError
      error={error}
      reset={reset}
      title="Journal error"
      description="Failed to load your trading journal. Your data is safe — try again."
    />
  )
}
