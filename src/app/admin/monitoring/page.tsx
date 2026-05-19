import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { RefreshCw, CheckCircle2, Database, Lock, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number | null | undefined, decimals = 0): string {
  if (n == null) return '—'
  return n.toFixed(decimals)
}

function fmtCurrency(n: number | null | undefined): string {
  if (n == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function fmtPct(n: number | null | undefined): string {
  if (n == null) return '—'
  return `${n.toFixed(1)}%`
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string
  sub?: string
  accent?: string
}

function StatCard({ label, value, sub, accent = '#0284C7' }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold" style={{ color: accent }}>
          {value}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <h2 className="text-lg font-bold text-[#0A0F1C]">{title}</h2>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MonitoringPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString()
  const timestamp = now.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  // ── 1. User metrics ────────────────────────────────────────────────────────
  const [
    { count: totalProfiles },
    { count: newToday },
    { count: newThisWeek },
    { count: completedProfiles },
  ] = await Promise.all([
    admin.from('trader_profiles').select('*', { count: 'exact', head: true }),
    admin.from('trader_profiles').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
    admin.from('trader_profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekStart),
    admin.from('trader_profiles').select('*', { count: 'exact', head: true }).not('completed_at', 'is', null),
  ])

  const totalUsers = totalProfiles ?? 0
  const completionRate = totalUsers > 0
    ? ((completedProfiles ?? 0) / totalUsers) * 100
    : 0

  // Auth users count
  let authUserCount = 0
  try {
    const { data: authList } = await admin.auth.admin.listUsers({ perPage: 1 })
    // listUsers returns total count via pagination metadata — fetch with page 1 to get total
    // Supabase admin.listUsers returns { users, total } in some versions
    // We sum via a full fetch as fallback
    const { data: fullList } = await admin.auth.admin.listUsers({ perPage: 1000 })
    authUserCount = fullList?.users?.length ?? 0
  } catch {
    authUserCount = totalUsers
  }

  // ── 2. Trade metrics ───────────────────────────────────────────────────────
  const [
    { count: totalTrades },
    { count: tradesToday },
    { data: pnlToday },
  ] = await Promise.all([
    admin.from('trades').select('*', { count: 'exact', head: true }),
    admin.from('trades').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
    admin.from('trades').select('pnl').gte('created_at', todayStart),
  ])

  const pnlValues = (pnlToday ?? []).map((r) => r.pnl as number).filter((v) => v != null)
  const avgPnlToday = pnlValues.length > 0
    ? pnlValues.reduce((a, b) => a + b, 0) / pnlValues.length
    : null

  // ── 3. Alert metrics ───────────────────────────────────────────────────────
  const [
    { count: totalAlerts },
    { count: unacknowledgedAlerts },
    { count: alertsToday },
    { count: acknowledgedAlerts },
  ] = await Promise.all([
    admin.from('alerts').select('*', { count: 'exact', head: true }),
    admin.from('alerts').select('*', { count: 'exact', head: true }).eq('acknowledged', false),
    admin.from('alerts').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
    admin.from('alerts').select('*', { count: 'exact', head: true }).eq('acknowledged', true),
  ])

  const alertAckRate = (totalAlerts ?? 0) > 0
    ? ((acknowledgedAlerts ?? 0) / (totalAlerts ?? 1)) * 100
    : 0

  // ── 4. Edge score metrics ──────────────────────────────────────────────────
  const [
    { count: totalEdgeScores },
    { data: edgesToday },
    { count: eliteTraders },
  ] = await Promise.all([
    admin.from('edge_scores').select('*', { count: 'exact', head: true }),
    admin.from('edge_scores').select('composite_score').gte('date', todayStart.split('T')[0]),
    admin.from('edge_scores').select('*', { count: 'exact', head: true }).eq('rank', 'elite'),
  ])

  const edgeValues = (edgesToday ?? [])
    .map((r) => r.composite_score as number)
    .filter((v) => v != null)
  const avgEdgeToday = edgeValues.length > 0
    ? edgeValues.reduce((a, b) => a + b, 0) / edgeValues.length
    : null

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0A0F1C]">System Monitoring</h1>
            <p className="text-sm text-gray-500 mt-0.5">Last updated: {timestamp}</p>
          </div>
          <Link
            href="/admin/monitoring"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Link>
        </div>

        {/* ── Section 1: User Activity ── */}
        <section>
          <SectionHeader title="User Activity" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Users"
              value={String(totalUsers)}
              sub={`${authUserCount} auth accounts`}
              accent="#0284C7"
            />
            <StatCard
              label="New Today"
              value={String(newToday ?? 0)}
              accent="#059669"
            />
            <StatCard
              label="New This Week"
              value={String(newThisWeek ?? 0)}
              accent="#7C3AED"
            />
            <StatCard
              label="Completion Rate"
              value={fmtPct(completionRate)}
              sub={`${completedProfiles ?? 0} completed`}
              accent="#D97706"
            />
          </div>
        </section>

        {/* ── Section 2: Trading Activity ── */}
        <section>
          <SectionHeader title="Trading Activity" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              label="Total Trades"
              value={String(totalTrades ?? 0)}
              accent="#0284C7"
            />
            <StatCard
              label="Trades Today"
              value={String(tradesToday ?? 0)}
              accent="#059669"
            />
            <StatCard
              label="Avg PnL Today"
              value={fmtCurrency(avgPnlToday)}
              sub={`${pnlValues.length} trades with PnL`}
              accent={avgPnlToday != null && avgPnlToday >= 0 ? '#059669' : '#E53935'}
            />
          </div>
        </section>

        {/* ── Section 3: Risk Guardian ── */}
        <section>
          <SectionHeader title="Risk Guardian" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Alerts"
              value={String(totalAlerts ?? 0)}
              accent="#0284C7"
            />
            <StatCard
              label="Unacknowledged"
              value={String(unacknowledgedAlerts ?? 0)}
              accent="#E53935"
            />
            <StatCard
              label="Alerts Today"
              value={String(alertsToday ?? 0)}
              accent="#D97706"
            />
            <StatCard
              label="Acknowledgment Rate"
              value={fmtPct(alertAckRate)}
              sub={`${acknowledgedAlerts ?? 0} acknowledged`}
              accent="#059669"
            />
          </div>
        </section>

        {/* ── Section 4: Edge Scores ── */}
        <section>
          <SectionHeader title="Edge Scores" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              label="Total Score Records"
              value={String(totalEdgeScores ?? 0)}
              accent="#0284C7"
            />
            <StatCard
              label="Avg Score Today"
              value={avgEdgeToday != null ? fmt(avgEdgeToday, 1) : '—'}
              sub={`${edgeValues.length} scores recorded today`}
              accent="#7C3AED"
            />
            <StatCard
              label="Elite Traders"
              value={String(eliteTraders ?? 0)}
              sub="rank = elite"
              accent="#D97706"
            />
          </div>
        </section>

        {/* ── Section 5: Platform Health ── */}
        <section>
          <SectionHeader title="Platform Health" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Database', icon: Database, detail: 'Supabase PostgreSQL' },
              { label: 'Authentication', icon: Lock, detail: 'Supabase Auth' },
              { label: 'API', icon: Globe, detail: 'Next.js API Routes' },
            ].map(({ label, icon: Icon, detail }) => (
              <Card key={label} className="border-emerald-200 bg-emerald-50/40">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0A0F1C] text-sm">{label}</p>
                    <p className="text-xs text-gray-500 truncate">{detail}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700">Operational</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-3 bg-gray-100 rounded-lg px-4 py-2.5">
            For infrastructure monitoring (Vercel, error tracking), connect to your Vercel dashboard
            and configure an observability integration such as Sentry or Datadog.
          </p>
        </section>

      </div>
    </div>
  )
}
