'use client'

import { useState, useEffect, useCallback } from 'react'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useRealtimeData<T>(
  fetcher: () => Promise<T> | PromiseLike<T>,
  deps: unknown[] = [],
  options?: { onError?: (err: Error) => void },
): AsyncState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const data = await fetcher()
      setState({ data, loading: false, error: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data'
      setState({ data: null, loading: false, error: message })
      options?.onError?.(err instanceof Error ? err : new Error(message))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { ...state, refetch: fetchData }
}
