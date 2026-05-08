'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Menu, User, LogOut, ChevronDown } from 'lucide-react'
import { ProfileBadge } from '@/components/trader-dna/profile-badge'
import { TraderProfile } from '@/types/trader-dna'

interface HeaderProps {
  onMenuClick?: () => void
  profile?: TraderProfile | null
}

export function Header({ onMenuClick, profile }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-gray-50 rounded-[6px]"
        >
          <Menu className="w-5 h-5 text-[#1F2933]" />
        </button>
        <h1 className="text-lg font-semibold text-[#0B0B0B]">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Profile Badge */}
        <ProfileBadge profile={profile || null} />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-[6px]"
          >
            <div className="w-8 h-8 bg-[#E53935] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-[12px] shadow-lg border border-gray-100 py-1 z-20">
                <button
                  onClick={() => { router.push('/profile'); setShowUserMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-[#1F2933] hover:bg-gray-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-[#E53935] hover:bg-gray-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}