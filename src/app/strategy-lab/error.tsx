'use client'

import { RouteError } from '@/components/ui/route-error'

export default function StrategyLabError({
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
      title="Strategy Lab error"
      description="Failed to load the Strategy Lab. Try again or check your connection."
    />
  )
}
