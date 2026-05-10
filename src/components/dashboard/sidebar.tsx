'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  TrendingUp
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
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  const SidebarContent = () => (
    <aside className="w-64 bg-[#0A0F1C] border-r border-[rgba(255,255,255,0.1)] flex flex-col h-full">
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

      <div className="p-4 border-t border-[rgba(255,255,255,0.1)]">
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-[6px] text-sm font-medium text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors active:bg-[rgba(255,255,255,0.2)]"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">Settings</span>
        </Link>
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile overlay - only visible when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop Sidebar - always visible on md+, static positioning */}
      <div className="hidden md:block md:flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - slides in from left on mobile when open */}
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