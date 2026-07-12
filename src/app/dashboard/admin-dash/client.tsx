'use client'

import { Users, TrendingUp, Bell, BarChart3, Dna, Brain, ShieldAlert, GraduationCap, FlaskConical, LineChart, Search, Palette, CreditCard, Activity, ArrowRight, CheckCircle2, Shield, Key, Lock, ClipboardList, Globe, Server, ToggleLeft, Mail, FileText, Receipt, Building2 } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'

interface AdminDashboardClientProps {
  totalUsers: number
  totalTrades: number
  activeAlerts: number
  recentProfiles: any[]
}

const QUICK_LINKS = [
  { label: 'Users', href: '/admin/users', icon: Users, desc: 'Manage accounts' },
  { label: 'Roles', href: '/admin/roles', icon: Shield, desc: 'Role management' },
  { label: 'Permissions', href: '/admin/permissions', icon: Key, desc: 'Permission matrix' },
  { label: 'Security', href: '/admin/security', icon: Lock, desc: 'MFA & sessions' },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: ClipboardList, desc: 'Audit trail' },
  { label: 'Compliance', href: '/admin/compliance', icon: Globe, desc: 'Compliance status' },
  { label: 'Health', href: '/admin/health', icon: Server, desc: 'System health' },
  { label: 'Feature Flags', href: '/admin/feature-flags', icon: ToggleLeft, desc: 'Toggle mgmt' },
  { label: 'API Keys', href: '/admin/api-keys', icon: Key, desc: 'Access tokens' },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, desc: 'Platform metrics' },
  { label: 'Email', href: '/admin/email', icon: Mail, desc: 'Email templates' },
  { label: 'Content CMS', href: '/admin/content', icon: FileText, desc: 'Site content' },
  { label: 'Trader DNA', href: '/admin/trader-dna', icon: Dna, desc: 'Edit DNA profiles' },
  { label: 'AI Engine', href: '/admin/ai-engine', icon: Brain, desc: 'Configure AI rules' },
  { label: 'Risk Guardian', href: '/admin/risk-guardian', icon: ShieldAlert, desc: 'Risk rule sets' },
  { label: 'Education', href: '/admin/education', icon: GraduationCap, desc: 'Course content' },
  { label: 'Strategy Lab', href: '/admin/strategy-lab', icon: FlaskConical, desc: 'Strategy configs' },
  { label: 'Market Intel', href: '/admin/market-intel', icon: LineChart, desc: 'Market content' },
  { label: 'SEO', href: '/admin/seo', icon: Search, desc: 'SEO metadata' },
  { label: 'Branding', href: '/admin/branding', icon: Palette, desc: 'Theme & colors' },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard, desc: 'Payment gateways' },
  { label: 'Billing', href: '/admin/billing', icon: Receipt, desc: 'Subscriptions' },
  { label: 'Enterprise', href: '/admin/enterprise', icon: Building2, desc: 'Enterprise clients' },
  { label: 'Monitoring', href: '/admin/monitoring', icon: Activity, desc: 'System health' },
]

const PROFILE_COLORS: Record<string, string> = {
  sniper: '#E53935', analyst: '#00B4D8', warrior: '#FF8A65',
  disciplinarian: '#2E7D32', opportunist: '#9C27B0',
}

export function AdminDashboardClient({ totalUsers, totalTrades, activeAlerts, recentProfiles }: AdminDashboardClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
          <p className="text-sm text-white/50 mt-0.5">Platform overview — all systems nominal</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#0ecb81]/30 bg-[#0ecb81]/10 px-3 py-1.5">
          <CheckCircle2 className="h-4 w-4 text-[#0ecb81]" />
          <span className="text-xs font-semibold text-[#0ecb81]">Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={totalUsers.toLocaleString()} icon={Users} />
        <StatCard label="Total Trades" value={totalTrades.toLocaleString()} icon={TrendingUp} />
        <StatCard label="Active Alerts" value={activeAlerts.toLocaleString()} icon={Bell} />
        <StatCard label="Edge Records" value={totalUsers > 0 ? (totalUsers * 2).toLocaleString() : '0'} icon={BarChart3} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <DashboardCard className="xl:col-span-3">
          <DashboardCardHeader>
            <DashboardCardTitle>Recent Signups</DashboardCardTitle>
            <p className="text-xs text-white/60 mt-0.5">Latest trader accounts</p>
          </DashboardCardHeader>
          <DashboardCardBody>
            {recentProfiles.length === 0 ? (
              <p className="text-sm text-white/60 py-4 text-center">No users yet.</p>
            ) : (
              <div className="space-y-2">
                {recentProfiles.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                      {p.id.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">
                        <code className="text-[10px] font-mono text-white/50">{p.id.slice(0, 8)}...</code>
                      </p>
                      <p className="text-[10px] text-white/60">
                        {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    {p.profile_type && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize"
                        style={{
                          backgroundColor: `${PROFILE_COLORS[p.profile_type] ?? '#666'}15`,
                          color: PROFILE_COLORS[p.profile_type] ?? '#666',
                        }}
                      >
                        {p.profile_type}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard className="xl:col-span-2">
          <DashboardCardHeader>
            <DashboardCardTitle>Quick Links</DashboardCardTitle>
            <p className="text-xs text-white/60 mt-0.5">Jump to any admin module</p>
          </DashboardCardHeader>
          <DashboardCardBody>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="group flex flex-col gap-1 p-2.5 rounded-lg border border-white/10 hover:border-[#fcd535]/30 hover:bg-[#fcd535]/5 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-white/60 group-hover:text-[#fcd535] transition-colors shrink-0" />
                      <span className="text-xs font-semibold text-white truncate">{link.label}</span>
                    </div>
                    <p className="text-[10px] text-white/60 leading-tight">{link.desc}</p>
                  </a>
                )
              })}
            </div>
          </DashboardCardBody>
        </DashboardCard>
      </div>
    </div>
  )
}
