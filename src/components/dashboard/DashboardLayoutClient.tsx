'use client'

import { useState, useEffect, useRef } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { TraderProfile } from '@/types/trader-dna'

interface DashboardLayoutClientProps {
  children: React.ReactNode
  profile: TraderProfile | null
}

interface TouchPosition {
  x: number
  y: number
}

export function DashboardLayoutClient({
  children,
  profile,
}: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const touchStartPos = useRef<TouchPosition | null>(null)

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [sidebarOpen])

  // Handle touch swipe to close sidebar
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return

    const touchEndPos = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    }

    const deltaX = touchStartPos.current.x - touchEndPos.x
    const deltaY = Math.abs(touchStartPos.current.y - touchEndPos.y)

    // Detect horizontal swipe (right-to-left to close sidebar)
    // Threshold: at least 50px horizontal movement, less than 50px vertical
    if (deltaX > 50 && deltaY < 50 && sidebarOpen) {
      setSidebarOpen(false)
    }

    touchStartPos.current = null
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile Sidebar (visible on mobile when open) */}
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={handleMenuClick} profile={profile} />
        <main className="flex-1 overflow-y-auto bg-[#F5F7FA] p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
