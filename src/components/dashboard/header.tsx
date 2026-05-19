'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Menu, User, LogOut, ChevronDown, Settings } from 'lucide-react'
import { ProfileBadge } from '@/components/trader-dna/profile-badge'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { TraderProfile } from '@/types/trader-dna'

interface HeaderProps {
  onMenuClick?: () => void
  profile?: TraderProfile | null
  userEmail?: string | null
  userAvatarUrl?: string | null
  userFullName?: string | null
}

/** Returns up to 2 uppercase initials from a name or email */
function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  if (email) return email[0].toUpperCase()
  return '?'
}

export function Header({ onMenuClick, profile, userEmail, userAvatarUrl, userFullName }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    setShowUserMenu(false)
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = getInitials(userFullName, userEmail)
  const showPhoto = userAvatarUrl && !avatarError

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-3 sm:px-4 md:px-6">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-3 -mx-1 hover:bg-muted rounded-[6px] transition-colors active:bg-[hsl(var(--muted))]"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
        </button>
        <h1 className="text-lg font-semibold text-primary">Dashboard</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Profile Badge */}
        <ProfileBadge profile={profile || null} />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 hover:bg-muted rounded-[8px] transition-colors active:bg-[hsl(var(--muted))]"
            aria-label="User menu"
          >
            {/* Avatar: photo → initials → icon */}
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-primary flex items-center justify-center ring-2 ring-primary/20">
              {showPhoto ? (
                <Image
                  src={userAvatarUrl!}
                  alt={userFullName ?? userEmail ?? 'User'}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : initials !== '?' ? (
                <span className="text-xs font-bold text-primary-foreground select-none">
                  {initials}
                </span>
              ) : (
                <User className="w-4 h-4 text-primary-foreground" />
              )}
            </div>

            {/* Name / email on desktop */}
            {(userFullName || userEmail) && (
              <span className="hidden md:block text-sm font-medium text-foreground max-w-[120px] truncate">
                {userFullName ?? userEmail}
              </span>
            )}

            <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block flex-shrink-0" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-card rounded-[12px] shadow-lg border border-border py-1 z-20">
                {/* User info header */}
                {(userFullName || userEmail) && (
                  <div className="px-4 py-3 border-b border-border">
                    {userFullName && (
                      <p className="text-sm font-semibold text-foreground truncate">{userFullName}</p>
                    )}
                    {userEmail && (
                      <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => { router.push('/profile'); setShowUserMenu(false) }}
                  className="w-full px-4 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Profile Settings
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors"
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
