import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  TrendingUp,
  Bell,
  BarChart3,
  Activity,
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
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface RecentSignup {
  id: string
  profile_type: string | null
  created_at: string
}

interface StatCard {
  label: string
  value: number | string
  icon: React.ElementType
  color: string
  bg: string
}

interface QuickLink {
  label: string
  href: string
  icon: React.ElementType
  description: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PROFILE_TYPE_COLORS: Record<string, string> = {
  sniper: 'bg-[#E53935]/10 text-[#E53935] border-[#E53935]/30',
  analyst: 'bg-[#00B4D8]/10 text-[#00B4D8] border-[#00B4D8]/30',
  warrior: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  disciplinarian: 'bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/30',
  opportunist: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
}

const QUICK_LINKS: QuickLink[] = [
  { label: 'Users', href: '/admin/users', icon: Users, description: 'Manage platform accounts' },
  { label: 'Trader DNA', href: '/admin/trader-dna', icon: Dna, description: 'Edit DNA profiles' },
  { label: 'AI Engine', href: '/admin/ai-engine', icon: Brain, description: 'Configure AI rules' },
  { label: 'Risk Guardian', href: '/admin/risk-guardian', icon: ShieldAlert, description: 'Risk rule sets' },
  { label: 'Education', href: '/admin/education', icon: GraduationCap, description: 'Course content' },
  { label: 'Strategy Lab', href: '/admin/strategy-lab', icon: FlaskConical, description: 'Strategy configs' },
  { label: 'Market Intel', href: '/admin/market-intel', icon: LineChart, description: 'Market content' },
  { label: 'SEO Manager', href: '/admin/seo', icon: Search, description: 'SEO metadata' },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell, description: 'Push & email alerts' },
  { label: 'Branding', href: '/admin/branding', icon: Palette, description: 'Theme & colors' },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard, description: 'Payment gateways' },
  { label: 'Billing', href: '/admin/billing', icon: Receipt, description: 'Subscriptions' },
  { label: 'Enterprise', href: '/admin/enterprise', icon: Building2, description: 'Enterprise clients' },
  { label: 'Monitoring', href: '/admin/monitoring', icon: Activity, description: 'System health' },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  // Parallel stat fetches
  const [
    { count: totalUsers },
    { count: totalTrades },
    { count: activeAlerts },
    { count: totalEdgeScores },
    { data: recentSignups },
  ] = await Promise.all([
    admin.from('trader_profiles').select('*', { count: 'exact', head: true }),
    admin.from('trades').select('*', { count: 'exact', head: true }),
    admin.from('alerts').select('*', { count: 'exact', head: true }).eq('acknowledged', false),
    admin.from('edge_scores').select('*', { count: 'exact', head: true }),
    admin
      .from('trader_profiles')
      .select('id, profile_type, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats: StatCard[] = [
    {
      label: 'Total Users',
      value: totalUsers ?? 0,
      icon: Users,
      color: 'text-[#00B4D8]',
      bg: 'bg-[#00B4D8]/10',
    },
    {
      label: 'Total Trades',
      value: totalTrades ?? 0,
      icon: TrendingUp,
      color: 'text-[#2E7D32]',
      bg: 'bg-[#2E7D32]/10',
    },
    {
      label: 'Active Alerts',
      value: activeAlerts ?? 0,
      icon: Bell,
      color: 'text-[#E53935]',
      bg: 'bg-[#E53935]/10',
    },
    {
      label: 'Edge Score Records',
      value: totalEdgeScores ?? 0,
      icon: BarChart3,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0F1C]">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Platform overview — all systems nominal</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2E7D32]/10 border border-[#2E7D32]/30">
          <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
          <span className="text-xs font-semibold text-[#2E7D32]">Operational</span>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} variant="light" className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-[#0A0F1C] mt-1">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </p>
                  </div>
                  <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ── Recent Signups + Quick Links ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Recent Signups (3 cols) */}
        <Card variant="light" className="xl:col-span-3 border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[#0A0F1C]">Recent Signups</CardTitle>
            <p className="text-xs text-gray-400">Last 5 trader accounts created</p>
          </CardHeader>
          <CardContent>
            {!recentSignups || recentSignups.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No users yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide w-2/5">
                        User ID
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">
                        Profile Type
                      </th>
                      <th className="text-left py-2 font-medium text-gray-400 text-xs uppercase tracking-wide">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(recentSignups as RecentSignup[]).map((row) => {
                      const profileColor =
                        PROFILE_TYPE_COLORS[row.profile_type ?? ''] ??
                        'bg-gray-100 text-gray-600 border-gray-200'
                      const shortId = row.id.slice(0, 8) + '…'
                      const date = new Date(row.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                      return (
                        <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-2.5 pr-4">
                            <code className="text-[11px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {shortId}
                            </code>
                          </td>
                          <td className="py-2.5 pr-4">
                            {row.profile_type ? (
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${profileColor}`}
                              >
                                {row.profile_type}
                              </span>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="py-2.5 text-gray-500 text-xs">{date}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div className="pt-3 border-t border-gray-100 mt-2">
              <Link
                href="/admin/users"
                className="text-xs text-[#E53935] font-medium hover:underline inline-flex items-center gap-1"
              >
                View all users <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links (2 cols) */}
        <Card variant="light" className="xl:col-span-2 border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-[#0A0F1C]">Quick Links</CardTitle>
            <p className="text-xs text-gray-400">Jump to any admin module</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex flex-col gap-1 p-2.5 rounded-lg border border-gray-100 hover:border-[#E53935]/30 hover:bg-[#E53935]/5 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#E53935] transition-colors flex-shrink-0" />
                      <span className="text-xs font-semibold text-[#0A0F1C] truncate">
                        {link.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-tight line-clamp-1">
                      {link.description}
                    </p>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
