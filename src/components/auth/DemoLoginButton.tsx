'use client'

import { useState } from 'react'
import { Sparkles, Loader } from 'lucide-react'

export function DemoLoginButton() {
  const [loading, setLoading] = useState(false)

  function handleDemoLogin() {
    setLoading(true)
    // WR-03: Set the demo session cookie so that the real dashboard layout
    // (which checks for `p2m_demo_session`) treats this as a demo session
    // when the user navigates to /dashboard/* pages from the demo area.
    document.cookie = 'p2m_demo_session=1; path=/; max-age=86400; SameSite=Lax'
    window.location.replace('/demo/dashboard/user')
  }

  return (
    <div className="mt-4">
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-400">or</span>
        </div>
      </div>

<button type="button" 
        onClick={handleDemoLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#fcd535] bg-[#fcd535]/5 px-4 py-2.5 text-sm font-semibold text-[#fcd535] hover:bg-[#fcd535]/15 disabled:opacity-50 transition-all"
      >
        {loading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {loading ? 'Setting up demo...' : 'Launch Demo Account'}
      </button>

      <p className="text-center mt-2 text-xs text-gray-400">
        Pre-populated with 15+ trades, AI insights, risk alerts, education progress, and more
      </p>
    </div>
  )
}
