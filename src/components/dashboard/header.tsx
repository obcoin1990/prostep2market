'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Menu, User, LogOut, ChevronDown, Settings, Bell } from 'lucide-react'
import { TraderProfile } from '@/types/trader-dna'

interface HeaderProps {
  onMenuClick?: () => void
  profile?: TraderProfile | null
  userEmail?: string | null
  userAvatarUrl?: string | null
  userFullName?: string | null
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  if (email) return email[0].toUpperCase()
  return '?'
}

export function Header({
  onMenuClick,
  profile,
  userEmail,
  userAvatarUrl,
  userFullName,
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setShowUserMenu(false)
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.replace('/login')
  }

  const initials = getInitials(userFullName, userEmail)
  const showPhoto = userAvatarUrl && !avatarError

  return (
    <header
      className="h-16 flex items-center justify-between px-4 md:px-6 flex-shrink-0"
      style={{
        backgroundColor: '#0b0e11',
        borderBottom: '1px solid #2b3139',
      }}
    >
      {/* ── Left: hamburger + page title ── */}
      <div className="flex items-center gap-3">
<button type="button" 
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-[6px] transition-colors"
          style={{ color: '#9ea3ad' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e2329')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Yellow wordmark — replaces plain "Dashboard" text */}
        <span
          className="text-base font-bold tracking-tight hidden md:block"
          style={{ color: '#fcd535', fontFamily: 'var(--font-sans)' }}
        >
          ProStep2Market
        </span>
      </div>

      {/* ── Right: notifications + profile type chip + user ── */}
      <div className="flex items-center gap-2">
        {/* Profile type badge */}
        {profile?.type && (
          <span
            className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-semibold uppercase tracking-wide"
            style={{ backgroundColor: 'rgba(252,213,53,0.12)', color: '#fcd535' }}
          >
            {profile.type}
          </span>
        )}

        {/* Notifications (placeholder) */}
<button type="button" 
          className="relative p-2 rounded-[6px] transition-colors"
          style={{ color: '#9ea3ad' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e2329')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        {/* ── User avatar + dropdown ── */}
        <div className="relative">
  <button type="button" 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-[8px] transition-colors"
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e2329')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            aria-label="User menu"
          >
            {/* Avatar circle */}
            <div
              className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
              style={{ backgroundColor: '#fcd535' }}
            >
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
                <span
                  className="text-xs font-bold select-none"
                  style={{ color: '#181a20' }}
                >
                  {initials}
                </span>
              ) : (
                <User className="w-4 h-4" style={{ color: '#181a20' }} />
              )}
            </div>

            {/* Name — desktop only */}
            <span
              className="hidden md:block text-sm font-medium max-w-[120px] truncate"
              style={{ color: '#eaecef' }}
            >
              {userFullName ?? userEmail ?? 'Account'}
            </span>

            <ChevronDown
              className="w-3.5 h-3.5 hidden md:block flex-shrink-0"
              style={{ color: '#9ea3ad' }}
            />
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div
                className="absolute right-0 mt-2 w-56 rounded-[8px] shadow-xl py-1 z-20"
                style={{
                  backgroundColor: '#1e2329',
                  border: '1px solid #2b3139',
                }}
              >
                {/* User info header */}
                {(userFullName || userEmail) && (
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: '1px solid #2b3139' }}
                  >
                    {userFullName && (
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: '#ffffff' }}
                      >
                        {userFullName}
                      </p>
                    )}
                    {userEmail && (
                      <p
                        className="text-xs truncate mt-0.5"
                        style={{ color: '#9ea3ad' }}
                      >
                        {userEmail}
                      </p>
                    )}
                  </div>
                )}

        <button type="button" 
                  onClick={() => { router.push('/profile'); setShowUserMenu(false) }}
                  className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors"
                  style={{ color: '#eaecef' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2b3139')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Settings className="w-4 h-4" style={{ color: '#9ea3ad' }} />
                  Profile Settings
                </button>

        <button type="button" 
                  onClick={handleSignOut}
                  className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 transition-colors"
                  style={{ color: '#f6465d' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(246,70,93,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
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
