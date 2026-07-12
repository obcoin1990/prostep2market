'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()
      setAuthed(!!data.session)
      setChecking(false)
    }
    check()
  }, [])

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="h-6 w-6 rounded-full border-2 border-white/20 border-t-yellow-400 animate-spin" />
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
        <p className="text-sm text-white/60">Verifying session...</p>
      </div>
    )
  }

  return <>{children}</>
}
