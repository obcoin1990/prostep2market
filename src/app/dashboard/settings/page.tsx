'use client'

import { Settings, User, Shield, Bell, Key, Palette, Globe, Monitor, Clock, ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import Link from 'next/link'

const SETTINGS_GROUPS = [
  {
    title: 'Account',
    items: [
      { label: 'Profile', desc: 'Personal info, avatar, preferences', href: '/dashboard/profile', icon: User, color: '#00B4D8' },
      { label: 'Security', desc: 'Password, two-factor authentication, sessions', href: '/dashboard/settings/security', icon: Shield, color: '#fcd535' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { label: 'Notifications', desc: 'Alert preferences, email digests, push', href: '/dashboard/settings/notifications', icon: Bell, color: '#8A2BE2' },
      { label: 'Appearance', desc: 'Theme, layout, density settings', href: '/dashboard/profile', icon: Palette, color: '#0ecb81' },
      { label: 'Regional', desc: 'Timezone, currency, date format', href: '/dashboard/profile', icon: Globe, color: '#FFC107' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { label: 'API Keys', desc: 'API access tokens, webhooks, integrations', href: '/dashboard/settings/api-keys', icon: Key, color: '#f6465d' },
      { label: 'Connected Accounts', desc: 'MT4, MT5, fxBlue connections', href: '/dashboard/connections', icon: Monitor, color: '#0ecb81' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Billing & Subscription', desc: 'Plan details, usage, invoices', href: '/dashboard/billing', icon: Bell, color: '#fcd535' },
      { label: 'Billing History', desc: 'Past invoices and payment records', href: '/dashboard/billing/history', icon: Clock, color: '#00B4D8' },
    ],
  },
]

export default function SettingsHubPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Settings"
        description="Manage your account, preferences, and integrations"
        icon={Settings}
      />

      {SETTINGS_GROUPS.map((group) => (
        <div key={group.title}>
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">{group.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {group.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${item.color}15` }}>
                  <item.icon className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white group-hover:text-[#fcd535] transition-colors">{item.label}</p>
                  <p className="text-xs text-white/60 mt-0.5">{item.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-white/50 group-hover:text-white/60 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
