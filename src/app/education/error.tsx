'use client'

import { RouteError } from '@/components/ui/route-error'

export default function EducationError({
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
      title="Education error"
      description="Failed to load learning content. Your progress is saved — try again."
    />
  )
}
