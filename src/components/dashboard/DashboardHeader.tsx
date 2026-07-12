'use client'

import { usePathname } from 'next/navigation'
import { Menu, Bell } from 'lucide-react'

interface DashboardHeaderProps {
  onMenuClick: () => void
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard/overview': 'Dashboard Overview',
  '/dashboard/profile': 'Profile & Account',
  '/dashboard/activity': 'Activity Center',
  '/dashboard/notifications': 'Notifications',
  '/dashboard/analytics': 'Analytics & Trading',
  '/dashboard/analytics/trades': 'Trade Analytics',
  '/dashboard/analytics/behavioral': 'Behavioral Analytics',
  '/dashboard/analytics/risk': 'Risk Analytics',
  '/dashboard/analytics/reports': 'Reports & Export',
  '/dashboard/trades': 'Trades',
  '/dashboard/trader-dna': 'Trader DNA',
  '/dashboard/risk-guardian': 'Risk Guardian',
  '/dashboard/education': 'Education',
  '/dashboard/strategy-lab': 'Strategy Lab',
  '/dashboard/team': 'Team Overview',
  '/dashboard/connections': 'Account Connections',
  '/dashboard/settings': 'Settings',
  '/dashboard/settings/security': 'Security Settings',
  '/dashboard/settings/notifications': 'Notification Preferences',
  '/dashboard/settings/api-keys': 'API Keys & Webhooks',
  '/dashboard/billing': 'Billing & Subscription',
  '/dashboard/billing/history': 'Billing History',
  '/dashboard/admin-dash': 'Admin Dashboard',
  '/dashboard/user': 'User Dashboard',
  '/dashboard/education-progress': 'Education Progress',
}

const PAGE_DESCRIPTIONS: Record<string, string> = {
  '/dashboard/overview': 'Your personalized trading performance overview',
  '/dashboard/profile': 'Manage your personal information and preferences',
  '/dashboard/activity': 'Complete history of your account activity',
  '/dashboard/notifications': 'Stay updated with alerts and platform activity',
  '/dashboard/analytics': 'Deep analysis of your trading data and patterns',
  '/dashboard/analytics/trades': 'Detailed breakdown by instrument and time',
  '/dashboard/analytics/behavioral': 'AI-powered behavioral pattern detection',
  '/dashboard/analytics/risk': 'Drawdown analysis and risk metrics',
  '/dashboard/analytics/reports': 'Generate, schedule, and download reports',
  '/dashboard/trades': 'View, filter, and manage your trade history',
  '/dashboard/trader-dna': 'Your psychological trading profile',
  '/dashboard/risk-guardian': 'Real-time behavioral risk monitoring',
  '/dashboard/education': 'Track your learning journey and certifications',
  '/dashboard/strategy-lab': 'Build, test, and refine trading strategies',
  '/dashboard/team': 'Manage your team and monitor performance',
  '/dashboard/connections': 'Manage your MT4/MT5 and broker connections',
  '/dashboard/settings': 'Manage account, preferences, and integrations',
  '/dashboard/settings/security': 'Password, 2FA, and active sessions',
  '/dashboard/settings/notifications': 'Control how you receive notifications',
  '/dashboard/settings/api-keys': 'API access tokens and webhooks',
  '/dashboard/billing': 'Manage your plan, usage, and payments',
  '/dashboard/billing/history': 'View past invoices and payment records',
  '/dashboard/admin-dash': 'Platform administration and system overview',
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const pathname = usePathname()
  const title = Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k))?.[1] ?? 'Dashboard'
  const desc = Object.entries(PAGE_DESCRIPTIONS).find(([k]) => pathname.startsWith(k))?.[1] ?? ''

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/10 bg-[#0b0e11] px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenuClick} className="lg:hidden p-1.5 rounded-md hover:bg-white/10 text-white/60">
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-white">{title}</h1>
          {desc && <p className="text-[11px] text-white/60 hidden sm:block">{desc}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className="relative p-2 rounded-lg hover:bg-white/10 text-white/60 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#f6465d] text-[9px] font-bold text-white">3</span>
        </button>
      </div>
    </header>
  )
}
