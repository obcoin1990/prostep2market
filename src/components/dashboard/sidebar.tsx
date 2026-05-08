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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-100
        transform transition-transform duration-200 ease-in-out
        md:transform-none md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#E53935]">P2M</span>
          </Link>
          <button onClick={onClose} className="md:hidden p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
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
                  transition-colors
                  ${isActive
                    ? 'bg-[#E53935]/10 text-[#E53935]'
                    : 'text-[#1F2933] hover:bg-gray-50'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-[6px] text-sm font-medium text-[#1F2933] hover:bg-gray-50"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>
      </aside>
    </>
  )
}