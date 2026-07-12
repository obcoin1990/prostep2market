'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import {
  LayoutDashboard, Users, Shield, BarChart3, GraduationCap,
  Dna, Cable, LogOut, X, Sparkles, ChevronRight, Activity,
  User, Bell, Clock, Target, TrendingUp, FlaskConical,
  Settings, Key, CreditCard, FileText, Brain, ChevronDown,
  AlertTriangle, PieChart, BookOpen, Monitor,
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: typeof LayoutDashboard
  badge?: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const DEMO_BASE = '/demo/dashboard'
const MAIN_BASE = '/dashboard'

const GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { href: '/dashboard/overview', label: 'Dashboard Overview', icon: LayoutDashboard },
      { href: '/dashboard/profile', label: 'Profile', icon: User },
      { href: '/dashboard/activity', label: 'Activity Center', icon: Clock },
      { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
      { href: '/dashboard/team', label: 'Team Overview', icon: Users },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { href: '/dashboard/analytics', label: 'Analytics Hub', icon: BarChart3 },
      { href: '/dashboard/analytics/trades', label: 'Trade Analytics', icon: TrendingUp },
      { href: '/dashboard/analytics/behavioral', label: 'Behavioral', icon: Brain },
      { href: '/dashboard/analytics/risk', label: 'Risk Analytics', icon: AlertTriangle },
      { href: '/dashboard/analytics/reports', label: 'Reports & Export', icon: FileText },
    ],
  },
  {
    title: 'Management',
    items: [
      { href: '/dashboard/trades', label: 'Trades', icon: Activity },
      { href: '/dashboard/trader-dna', label: 'Trader DNA', icon: Dna },
      { href: '/dashboard/risk-guardian', label: 'Risk Guardian', icon: Shield },
      { href: '/dashboard/education', label: 'Education', icon: BookOpen },
      { href: '/dashboard/strategy-lab', label: 'Strategy Lab', icon: FlaskConical },
      { href: '/dashboard/connections', label: 'Connections', icon: Cable },
    ],
  },
  {
    title: 'Settings & Account',
    items: [
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
      { href: '/dashboard/settings/security', label: 'Security', icon: Shield },
      { href: '/dashboard/settings/notifications', label: 'Notifications', icon: Bell },
      { href: '/dashboard/settings/api-keys', label: 'API Keys', icon: Key },
      { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
      { href: '/dashboard/billing/history', label: 'Billing History', icon: Clock },
    ],
  },
]

const DEMO_GROUPS: NavGroup[] = GROUPS.map(group => ({
  ...group,
  items: group.items.map(item => ({
    ...item,
    href: item.href.replace('/dashboard', '/demo/dashboard'),
  })),
}))

const QUICK_LINKS = [
  { href: '/journal', label: 'Trade Journal', icon: Activity },
  { href: '/analysis', label: 'AI Analysis', icon: BarChart3 },
  { href: '/education', label: 'Education Hub', icon: GraduationCap },
]

interface DashboardSidebarProps {
  isOpen: boolean
  onClose: () => void
  userEmail?: string | null
  userFullName?: string | null
}

export function DashboardSidebar({ isOpen, onClose, userEmail, userFullName }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isDemo = pathname.startsWith('/demo/dashboard')
  const base = isDemo ? DEMO_BASE : MAIN_BASE
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    const groups = isDemo ? DEMO_GROUPS : GROUPS
    groups.forEach((g) => {
      initial[g.title] = g.items.some((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
    })
    if (Object.values(initial).every(v => !v)) initial['Overview'] = true
    return initial
  })

  async function handleSignOut() {
    if (isDemo) {
      router.push('/demo')
      return
    }
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const groups = isDemo ? DEMO_GROUPS : GROUPS

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#0b0e11] border-r border-white/10">
      <div className="flex h-14 items-center justify-between px-4 border-b border-white/10">
        <Link href={isDemo ? '/demo/dashboard/overview' : '/dashboard/overview'} className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#fcd535]" />
          <span className="text-sm font-bold text-white">ProStep</span>
        </Link>
        <button type="button" onClick={onClose} className="lg:hidden p-1 rounded-md hover:bg-white/10 text-white/60">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1" aria-label="Dashboard navigation">
        {groups.map((group) => {
          const isExpanded = expandedGroups[group.title]
          const hasActiveChild = group.items.some(
            (item) => pathname === item.href || pathname.startsWith(item.href + '/')
          )
          return (
            <div key={group.title}>
              <button
                onClick={() => setExpandedGroups(prev => ({ ...prev, [group.title]: !prev[group.title] }))}
                aria-expanded={isExpanded}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-widest transition-colors',
                  hasActiveChild ? 'text-[#fcd535]' : 'text-white/60 hover:text-white/60'
                )}
              >
                <ChevronDown
                  className={cn('h-3 w-3 transition-transform', isExpanded ? 'rotate-0' : '-rotate-90')}
                />
                <span className="flex-1 text-left">{group.title}</span>
                <span className="text-[10px] text-white/50">{group.items.length}</span>
              </button>
              {isExpanded && (
                <div className="ml-1 space-y-0.5 mt-0.5">
                  {group.items.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(item.href + '/')
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          active
                            ? 'bg-[#fcd535]/10 text-[#fcd535]'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="rounded-full bg-[#fcd535]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#fcd535]">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        <div className="my-4 border-t border-white/10" />

        <p className="px-3 text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-2">Quick Access</p>
        {QUICK_LINKS.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              <ChevronRight className="h-3 w-3 ml-auto text-white/50" />
            </Link>
          )
        })}

        {(isDemo ? DEMO_GROUPS : GROUPS).flatMap(g => g.items).find(i => i.label === 'Admin') ? null : (
          <>
            <div className="my-2 border-t border-white/10" />
            <Link
              href={isDemo ? '/demo/dashboard/admin-dash' : '/dashboard/admin-dash'}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname === (isDemo ? '/demo/dashboard/admin-dash' : '/dashboard/admin-dash')
                  ? 'bg-[#fcd535]/10 text-[#fcd535]'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              )}
            >
              <Monitor className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">Admin Dashboard</span>
              <span className="rounded-full bg-[#fcd535]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#fcd535]">Admin</span>
            </Link>
          </>
        )}
      </nav>

      <div className="border-t border-white/10 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fcd535]/20 text-[#fcd535] text-xs font-bold" aria-hidden="true">
            {(userFullName ?? userEmail ?? '?').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{userFullName ?? userEmail ?? 'User'}</p>
            {userEmail && <p className="text-[10px] text-white/60 truncate">{userEmail}</p>}
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/50 hover:bg-[#f6465d]/10 hover:text-[#f6465d] transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {isDemo ? 'Exit Demo' : 'Sign out'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:shrink-0">
        {sidebarContent}
      </aside>
      {isOpen && (
        <div className="fixed inset-0 z-[400] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 animate-in slide-in-from-left">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
