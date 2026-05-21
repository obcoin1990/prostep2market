'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import {
  LayoutDashboard, BookOpen, BarChart2, Users,
  Settings, LogOut, Sparkles, Award, Bell, User as UserIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = {
  LEARNER: [
    { href: '/dashboard/learner',      label: 'My Dashboard',    icon: LayoutDashboard },
    { href: '/courses',                label: 'Explore Courses', icon: BookOpen },
    { href: '/dashboard/learner/path', label: 'My Learning Path',icon: Sparkles },
    { href: '/dashboard/learner/certs',label: 'Certificates',    icon: Award },
  ],
  MANAGER: [
    { href: '/dashboard/manager',             label: 'Overview',    icon: LayoutDashboard },
    { href: '/dashboard/manager/team',        label: 'My Team',     icon: Users },
    { href: '/dashboard/manager/analytics',   label: 'Analytics',   icon: BarChart2 },
    { href: '/courses',                       label: 'Courses',     icon: BookOpen },
  ],
  ADMIN: [
    { href: '/dashboard/admin',           label: 'Overview',    icon: LayoutDashboard },
    { href: '/dashboard/admin/users',     label: 'Users',       icon: Users },
    { href: '/dashboard/admin/courses',   label: 'Courses',     icon: BookOpen },
    { href: '/dashboard/admin/analytics', label: 'Analytics',   icon: BarChart2 },
    { href: '/dashboard/admin/settings',  label: 'Settings',    icon: Settings },
  ],
  SUPER_ADMIN: [
    { href: '/dashboard/admin',           label: 'Overview',    icon: LayoutDashboard },
    { href: '/dashboard/admin/users',     label: 'Users',       icon: Users },
    { href: '/dashboard/admin/courses',   label: 'Courses',     icon: BookOpen },
    { href: '/dashboard/admin/analytics', label: 'Analytics',   icon: BarChart2 },
    { href: '/dashboard/admin/settings',  label: 'Settings',    icon: Settings },
  ],
} as const

type RoleKey = keyof typeof NAV_ITEMS

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  if (email) return email[0].toUpperCase()
  return '?'
}

export function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const [user, setUser]   = useState<User | null>(null)
  const [role, setRole]   = useState<RoleKey>('LEARNER')
  const [avatarError, setAvatarError] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Load current user from Supabase session
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      setUser(data.user)
      // Role is stored in user_metadata (set at registration via admin API)
      const metaRole = data.user.user_metadata?.role as RoleKey | undefined
      if (metaRole && metaRole in NAV_ITEMS) {
        setRole(metaRole)
      }
    })

    // Keep user state in sync with auth changes (e.g. sign-out in another tab)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null)
        return
      }
      setUser(session.user)
      const metaRole = session.user.user_metadata?.role as RoleKey | undefined
      if (metaRole && metaRole in NAV_ITEMS) {
        setRole(metaRole)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const items = NAV_ITEMS[role] ?? NAV_ITEMS.LEARNER

  const userName  = user?.user_metadata?.name as string | undefined
  const userEmail = user?.email
  const userImage = user?.user_metadata?.avatar_url as string | undefined
  const initials  = getInitials(userName, userEmail)
  const showPhoto = userImage && !avatarError

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center px-5 border-b border-gray-100">
        <Sparkles className="h-5 w-5 text-brand-500 mr-2" />
        <span className="text-lg font-bold text-gray-900">ProStep</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-100 p-3 space-y-1">
        <Link
          href="/dashboard/notifications"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <Bell className="h-4 w-4" />
          Notifications
        </Link>

        {/* User row */}
        {user && (
          <div className="flex items-center gap-2 rounded-lg px-3 py-2">
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-red-500 flex items-center justify-center">
              {showPhoto ? (
                <Image
                  src={userImage!}
                  alt={userName ?? userEmail ?? 'User'}
                  width={28}
                  height={28}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : initials !== '?' ? (
                <span className="text-[11px] font-bold text-white select-none">{initials}</span>
              ) : (
                <UserIcon className="w-4 h-4 text-white" />
              )}
            </div>

            {/* Name / email */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">
                {userName ?? userEmail ?? 'Account'}
              </p>
              {userName && userEmail && (
                <p className="text-[10px] text-gray-400 truncate">{userEmail}</p>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
