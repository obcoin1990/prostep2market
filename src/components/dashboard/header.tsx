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
    <header className="h-16 bg-[#0A0F1C] border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between px-3 sm:px-4 md:px-6">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-3 -mx-1 hover:bg-[rgba(255,255,255,0.1)] rounded-[6px] transition-colors active:bg-[rgba(255,255,255,0.2)]"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-[rgba(255,255,255,0.7)]" />
        </button>
        <h1 className="text-lg font-semibold text-[#00B4D8]">Dashboard</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Profile Badge */}
        <ProfileBadge profile={profile || null} />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-[6px] transition-colors active:bg-[rgba(255,255,255,0.2)]"
            aria-label="User menu"
          >
            <div className="w-8 h-8 bg-[#00B4D8] rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <ChevronDown className="w-4 h-4 text-[rgba(255,255,255,0.7)] hidden md:block" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-[#0A0F1C] rounded-[12px] shadow-lg border border-[rgba(255,255,255,0.1)] py-1 z-20">
                <button
                  onClick={() => { router.push('/profile'); setShowUserMenu(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.1)] hover:text-white flex items-center gap-2 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.1)] hover:text-white flex items-center gap-2 transition-colors"
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