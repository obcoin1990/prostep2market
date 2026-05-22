'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Dna,
  Brain,
  ShieldAlert,
  GraduationCap,
  FlaskConical,
  LineChart,
  Search,
  Palette,
  CreditCard,
  Receipt,
  Building2,
  Activity,
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

interface NavSection {
  title: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'User Management',
    items: [
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'Trader DNA Editor', href: '/admin/trader-dna', icon: Dna },
    ],
  },
  {
    title: 'Platform Settings',
    items: [
      { label: 'AI Engine', href: '/admin/ai-engine', icon: Brain },
      { label: 'Risk Guardian Rules', href: '/admin/risk-guardian', icon: ShieldAlert },
      { label: 'Education Manager', href: '/admin/education', icon: GraduationCap },
      { label: 'Strategy Lab', href: '/admin/strategy-lab', icon: FlaskConical },
    ],
  },
  {
    title: 'Content & Market',
    items: [
      { label: 'Market Intelligence', href: '/admin/market-intel', icon: LineChart },
      { label: 'SEO Manager', href: '/admin/seo', icon: Search },
      { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    ],
  },
  {
    title: 'Business',
    items: [
      { label: 'Branding & Theme', href: '/admin/branding', icon: Palette },
      { label: 'Payment Gateways', href: '/admin/payments', icon: CreditCard },
      { label: 'Billing & Subscriptions', href: '/admin/billing', icon: Receipt },
      { label: 'Enterprise', href: '/admin/enterprise', icon: Building2 },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Monitoring', href: '/admin/monitoring', icon: Activity },
    ],
  },
]

interface AdminSidebarProps {
  userEmail?: string
  isOpen?: boolean
  onClose?: () => void
}

export function AdminSidebar({ userEmail, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0A0F1C] text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-[#E53935] flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm text-white leading-tight truncate">Super Admin</p>
          <p className="text-[10px] text-white/40 truncate">ProStep2Market</p>
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button onClick={onClose} className="ml-auto text-white/40 hover:text-white md:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_SECTIONS.map((section) => {
          const isCollapsed = collapsedSections.has(section.title)
          return (
            <div key={section.title} className="mb-2">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-semibold text-white/40 uppercase tracking-wider hover:text-white/60 transition-colors"
              >
                {section.title}
                {isCollapsed ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5 mt-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          active
                            ? 'bg-[#E53935]/20 text-[#E53935] border border-[#E53935]/30'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-3 py-4 space-y-2">
        <div className="px-3 py-2 rounded-lg bg-white/5">
          <p className="text-[11px] text-white/60 font-medium truncate">{userEmail}</p>
          <p className="text-[10px] text-[#E53935] font-semibold">Super Admin</p>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-red-400 hover:bg-red-900/20 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 min-h-screen flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 z-50 md:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}

export function AdminMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
    >
      <Menu className="w-5 h-5" />
    </button>
  )
}
