'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard, BookOpen, BarChart2, Users,
  Settings, LogOut, Sparkles, Award, Bell,
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
    { href: '/dashboard/manager',         label: 'Overview',    icon: LayoutDashboard },
    { href: '/dashboard/manager/team',    label: 'My Team',     icon: Users },
    { href: '/dashboard/manager/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/courses',                   label: 'Courses',     icon: BookOpen },
  ],
  ADMIN: [
    { href: '/dashboard/admin',           label: 'Overview',    icon: LayoutDashboard },
    { href: '/dashboard/admin/users',     label: 'Users',       icon: Users },
    { href: '/dashboard/admin/courses',   label: 'Courses',     icon: BookOpen },
    { href: '/dashboard/admin/analytics', label: 'Analytics',   icon: BarChart2 },
    { href: '/dashboard/admin/settings',  label: 'Settings',    icon: Settings },
  ],
}

export function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const role = (session?.user?.role ?? 'LEARNER') as keyof typeof NAV_ITEMS
  const items = NAV_ITEMS[role] ?? NAV_ITEMS.LEARNER

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

      {/* User */}
      <div className="border-t border-gray-100 p-3 space-y-1">
        <Link
          href="/dashboard/notifications"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <Bell className="h-4 w-4" />
          Notifications
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
