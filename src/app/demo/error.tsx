'use client'

import { RouteError } from '@/components/ui/route-error'

export default function DemoError({
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
      title="Demo error"
      description="Something went wrong in the demo environment. Try again."
    />
  )
}
