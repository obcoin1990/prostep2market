'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
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
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/journal', label: 'Trade Journal', icon: FileText, dataTour: 'sidebar-journal' },
  { href: '/analysis', label: 'AI Analysis', icon: Brain },
  { href: '/education', label: 'Education', icon: GraduationCap },
  { href: '/strategy-lab', label: 'Strategy Lab', icon: FlaskConical },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  userEmail?: string | null
  userAvatarUrl?: string | null
  userFullName?: string | null
}

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  if (email) return email[0].toUpperCase()
  return '?'
}

export function Sidebar({ isOpen = false, onClose, userEmail, userAvatarUrl, userFullName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [avatarError, setAvatarError] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = getInitials(userFullName, userEmail)
  const showPhoto = userAvatarUrl && !avatarError

  const SidebarContent = () => (
    <aside className="w-64 bg-[#0A0F1C] border-r border-[rgba(255,255,255,0.1)] flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.1)]">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-xl font-bold text-[#00B4D8]">P2M</span>
        </Link>
        <button
          onClick={onClose}
          className="md:hidden p-2 -mr-2 hover:bg-[rgba(255,255,255,0.1)] rounded transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              data-tour={item.dataTour}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-[6px] text-sm font-medium
                transition-colors active:bg-[rgba(255,255,255,0.2)]
                ${isActive
                  ? 'bg-[rgba(0,180,216,0.1)] text-[#00B4D8]'
                  : 'text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.1)]'
                }
              `}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#00B4D8]' : 'text-[rgba(255,255,255,0.6)]'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.1)] space-y-1">
        {/* Settings link */}
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-[6px] text-sm font-medium text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">Settings</span>
        </Link>

        {/* User avatar + name + logout */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-[6px]">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-[#E53935] flex items-center justify-center ring-2 ring-[#E53935]/30">
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
              <span className="text-xs font-bold text-white select-none">{initials}</span>
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>

          {/* Name / email */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {userFullName ?? userEmail ?? 'Account'}
            </p>
            {userFullName && userEmail && (
              <p className="text-[10px] text-[rgba(255,255,255,0.4)] truncate">{userEmail}</p>
            )}
          </div>

          {/* Logout button */}
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            title="Sign out"
            className="p-1.5 rounded-[6px] text-[rgba(255,255,255,0.4)] hover:text-[#E53935] hover:bg-[rgba(229,57,53,0.1)] transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop */}
      <div className="hidden md:block md:flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile */}
      <div
        className={`
          fixed md:hidden inset-y-0 left-0 z-50
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <SidebarContent />
      </div>
    </>
  )
}
