'use client'

import { useState } from 'react'
import { AdminSidebar, AdminMenuButton } from '@/components/admin/AdminSidebar'

interface AdminLayoutClientProps {
  children: React.ReactNode
  userEmail?: string
}

export function AdminLayoutClient({ children, userEmail }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <AdminSidebar
        userEmail={userEmail}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-[#0A0F1C] border-b border-white/10">
          <AdminMenuButton onClick={() => setSidebarOpen(true)} />
          <span className="text-white font-semibold text-sm">Super Admin</span>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
