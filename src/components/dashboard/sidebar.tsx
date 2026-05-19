'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  FileText,
  Brain,
  Shield,
  Trophy,
  GraduationCap,
  Settings,
  X,
  FlaskConical,
  LogOut,
  User,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard',     label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/journal',       label: 'Trade Journal', icon: FileText,     dataTour: 'sidebar-journal' },
  { href: '/analysis',      label: 'AI Analysis',   icon: Brain },
  { href: '/education',     label: 'Education',     icon: GraduationCap },
  { href: '/strategy-lab',  label: 'Strategy Lab',  icon: FlaskConical },
  { href: '/risk-guardian', label: 'Risk Guardian', icon: Shield },
  { href: '/leaderboard',   label: 'Leaderboard',   icon: Trophy },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
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

export function Sidebar({
  isOpen = false,
  onClose,
  userEmail,
  userAvatarUrl,
  userFullName,
}: SidebarProps) {
  const pathname = usePathname()
  const [avatarError, setAvatarError] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.replace('/login')
  }

  const initials = getInitials(userFullName, userEmail)
  const showPhoto = userAvatarUrl && !avatarError

  const SidebarContent = () => (
    <aside
      className="w-64 flex flex-col h-full"
      style={{ backgroundColor: '#0b0e11', borderRight: '1px solid #2b3139' }}
    >
      {/* ── Logo / brand ────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 h-16 flex-shrink-0"
        style={{ borderBottom: '1px solid #2b3139' }}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          onClick={onClose}
        >
          {/* P2M wordmark in Binance Yellow */}
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: '#fcd535', fontFamily: 'var(--font-sans)' }}
          >
            P2M
          </span>
          <span
            className="text-sm font-medium hidden lg:block"
            style={{ color: '#707a8a' }}
          >
            ProStep2Market
          </span>
        </Link>

        {/* Mobile close */}
        <button
          onClick={onClose}
          className="md:hidden p-2 -mr-1 rounded-[6px] transition-colors"
          style={{ color: '#707a8a' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e2329')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ── Navigation ──────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              data-tour={item.dataTour}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-sm font-medium transition-colors"
              style={
                isActive
                  ? {
                      backgroundColor: 'rgba(252,213,53,0.08)',
                      color: '#fcd535',
                    }
                  : {
                      color: '#707a8a',
                    }
              }
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#1e2329'
                  e.currentTarget.style.color = '#eaecef'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#707a8a'
                }
              }}
            >
              <item.icon
                className="w-5 h-5 flex-shrink-0"
                style={{ color: isActive ? '#fcd535' : '#707a8a' }}
              />
              <span className="truncate">{item.label}</span>
              {/* Yellow left accent bar for active item */}
              {isActive && (
                <span
                  className="ml-auto w-1 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: '#fcd535' }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Bottom: settings + user ──────────────────── */}
      <div
        className="px-3 py-3 flex-shrink-0 space-y-0.5"
        style={{ borderTop: '1px solid #2b3139' }}
      >
        {/* Settings */}
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-sm font-medium transition-colors"
          style={{ color: '#707a8a' }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#1e2329'
            e.currentTarget.style.color = '#eaecef'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#707a8a'
          }}
        >
          <Settings className="w-5 h-5 flex-shrink-0" style={{ color: '#707a8a' }} />
          <span className="truncate">Settings</span>
        </Link>

        {/* User row */}
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-[6px]"
          style={{ borderTop: '1px solid #2b3139', marginTop: '4px', paddingTop: '12px' }}
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: '#fcd535', color: '#181a20' }}
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

          {/* Name / email */}
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-semibold truncate"
              style={{ color: '#eaecef' }}
            >
              {userFullName ?? userEmail ?? 'Account'}
            </p>
            {userFullName && userEmail && (
              <p
                className="text-[10px] truncate"
                style={{ color: '#707a8a' }}
              >
                {userEmail}
              </p>
            )}
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            title="Sign out"
            className="p-1.5 rounded-[6px] flex-shrink-0 transition-colors flex items-center gap-1.5 text-xs font-medium"
            style={{ color: '#f6465d' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(246,70,93,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <LogOut className="w-4 h-4" />
            <span>{signingOut ? '...' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={onClose}
        />
      )}

      {/* Desktop */}
      <div className="hidden md:block md:flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed md:hidden inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>
    </>
  )
}
