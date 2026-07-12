'use client'

import { useState, useEffect, useRef } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardHeader } from './DashboardHeader'

interface DashboardLayoutClientProps {
  children: React.ReactNode
  userEmail: string | null
  userFullName: string | null
}

export function DashboardLayoutClient({ children, userEmail, userFullName }: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#0b0e11]"
      onTouchStart={(e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }}
      onTouchEnd={(e) => {
        if (!touchStart.current) return
        const dx = touchStart.current.x - e.changedTouches[0].clientX
        const dy = Math.abs(touchStart.current.y - e.changedTouches[0].clientY)
        if (dx > 50 && dy < 50 && sidebarOpen) setSidebarOpen(false)
        touchStart.current = null
      }}
    >
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userEmail={userEmail}
        userFullName={userFullName}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
