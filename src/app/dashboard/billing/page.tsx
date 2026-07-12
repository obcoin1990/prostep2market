'use client'

import { CreditCard, DollarSign, TrendingUp, Activity, CheckCircle2, ArrowRight, Download, Shield, Clock, Zap, Users, AlertCircle } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Subscription {
  id: string
  user_id: string
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'paused'
  provider: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  amount_cents: number | null
  currency: string | null
  created_at: string
}

const PLAN_DETAILS: Record<string, { name: string; price: string; period: string; features: string[] }> = {
  free: {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: [
      'Basic trade journaling',
      'Limited analytics (30 days)',
      'Trader DNA assessment',
      'Community access',
    ],
  },
  pro: {
    name: 'Pro Trader',
    price: '$29',
    period: '/month',
    features: [
      'Unlimited trade journaling',
      'AI-powered analytics',
      'Risk Guardian monitoring',
      'Trader DNA assessment',
      'Strategy Lab access',
      'Team collaboration (up to 5)',
      'Priority support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'SSO / SAML',
      'White-label options',
    ],
  },
}

const STATUS_VARIANTS: Record<string, 'active' | 'warning' | 'danger' | 'info'> = {
  active: 'active',
  cancelled: 'danger',
  past_due: 'warning',
  trialing: 'info',
  paused: 'warning',
}

export default function BillingPage() {
  const supabase = createClient()

  const { data: subscription, loading: subLoading } = useRealtimeData<Subscription | null>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()
      return data ?? null
    },
    [],
  )

  const { data: invoices, loading: invoicesLoading } = useRealtimeData<any[]>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      return data ?? []
    },
    [],
  )

  const { data: settings, loading: settingsLoading } = useRealtimeData<any | null>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      const { data } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()
      return data ?? null
    },
    [],
  )

  const { data: tradeCount, loading: tradeLoading } = useRealtimeData<number>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return 0
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const { count } = await supabase
        .from('trades')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('open_time', monthStart)
      return count ?? 0
    },
    [],
  )

  const loading = subLoading || invoicesLoading || settingsLoading || tradeLoading

  const plan = subscription?.plan ?? 'free'
  const planDetails = PLAN_DETAILS[plan] ?? PLAN_DETAILS.free
  const subStatus = subscription?.status ?? 'active'

  const paidCount = invoices?.filter((i) => i.status === 'paid').length ?? 0
  const totalSpent = invoices?.filter((i) => i.status === 'paid').reduce((sum, i) => sum + (i.amount_cents ?? 0), 0) ?? 0
  const failedCount = invoices?.filter((i) => i.status === 'failed').length ?? 0

  const USAGE_STATS = [
    { label: 'Trades This Month', value: `${tradeCount ?? 0}`, icon: Activity, color: '#0ecb81' },
    { label: 'Invoices Paid', value: `${paidCount}`, icon: CheckCircle2, color: '#00B4D8' },
    { label: 'Total Spent', value: `$${(totalSpent / 100).toFixed(2)}`, icon: DollarSign, color: '#fcd535' },
    { label: 'Failed Payments', value: `${failedCount}`, icon: AlertCircle, color: failedCount > 0 ? '#f6465d' : '#0ecb81' },
  ]

  const billingPeriodStart = subscription?.current_period_start
    ? new Date(subscription.current_period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'
  const billingPeriodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'

  const nextBillingDate = subscription?.current_period_end
    ? new Date(new Date(subscription.current_period_end).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'

  const displayPrice = subscription?.amount_cents != null
    ? `$${(subscription.amount_cents / 100).toFixed(0)}`
    : planDetails.price

  const displayCurrency = subscription?.currency?.toUpperCase() ?? 'USD'

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Billing & Subscription"
          description="Manage your plan, usage, and payment methods"
          icon={CreditCard}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
        <Skeleton className="h-24 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Billing & Subscription"
        description="Manage your plan, usage, and payment methods"
        icon={CreditCard}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {USAGE_STATS.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} variant="compact" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard className="lg:col-span-2">
          <DashboardCardHeader className="flex items-center justify-between">
            <DashboardCardTitle>Current Plan</DashboardCardTitle>
            <StatusBadge
              label={subStatus.charAt(0).toUpperCase() + subStatus.slice(1)}
              variant={STATUS_VARIANTS[subStatus] ?? 'info'}
            />
          </DashboardCardHeader>
          <DashboardCardBody>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-white">{displayPrice}</span>
              <span className="text-white/60">{planDetails.period}</span>
              <span className="text-lg font-semibold text-[#fcd535] ml-3">{planDetails.name}</span>
            </div>
            <div className="space-y-3 mb-6">
              {planDetails.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-white/70">
                  <CheckCircle2 className="h-4 w-4 text-[#0ecb81] shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            {subscription?.cancel_at_period_end && (
              <div className="mb-4 rounded-lg bg-[#f6465d]/10 border border-[#f6465d]/20 px-4 py-3">
                <p className="text-sm text-[#f6465d]">Your subscription will cancel at the end of the current billing period ({billingPeriodEnd}).</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              {plan === 'free' ? (
                <Link href="/pricing" className="rounded-lg bg-[#fcd535] px-4 py-2 text-xs font-semibold text-[#181a20] hover:bg-[#f0b90b] transition-colors">
                  Upgrade Plan
                </Link>
              ) : (
                <>
                  <button className="rounded-lg border border-white/10 px-4 py-2 text-xs text-white/60 hover:bg-white/5 transition-colors">
                    Change Plan
                  </button>
                  <button className="rounded-lg border border-[#f6465d]/30 px-4 py-2 text-xs text-[#f6465d] hover:bg-[#f6465d]/10 transition-colors">
                    Cancel Subscription
                  </button>
                </>
              )}
            </div>
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>Current Billing Period</DashboardCardTitle>
            <p className="text-xs text-white/60 mt-0.5">{billingPeriodStart} – {billingPeriodEnd}</p>
          </DashboardCardHeader>
          <DashboardCardBody className="space-y-4">
            {plan !== 'free' && (
              <div className="rounded-lg bg-white/5 p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Provider</span>
                  <span className="text-white font-medium capitalize">{subscription?.provider ?? '—'}</span>
                </div>
              </div>
            )}
            <div className="rounded-lg bg-white/5 p-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Next Billing Date</span>
                <span className="text-white font-medium">{nextBillingDate}</span>
              </div>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Amount Due</span>
                <span className="text-white font-medium">{displayPrice}{planDetails.period ? '.00' : ''}</span>
              </div>
            </div>
            <Link href="/dashboard/billing/history">
              <button className="w-full flex items-center justify-center gap-1 rounded-lg border border-white/10 px-4 py-2 text-xs text-white/60 hover:bg-white/5 transition-colors">
                View Billing History <ArrowRight className="h-3 w-3" />
              </button>
            </Link>
          </DashboardCardBody>
        </DashboardCard>
      </div>

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardTitle>Payment Method</DashboardCardTitle>
        </DashboardCardHeader>
        <DashboardCardBody>
          {settings?.default_currency ? (
            <div className="flex items-center justify-between rounded-lg border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">
                  {settings.default_currency.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Default currency: {settings.default_currency.toUpperCase()}</p>
                  <p className="text-xs text-white/60">Manage payment methods via {subscription?.provider ?? 'your provider'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge label="Default" variant="success" />
                <button className="text-xs text-[#fcd535] hover:underline">Change</button>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No payment method"
              description="Add a payment method to upgrade to a paid plan."
            />
          )}
        </DashboardCardBody>
      </DashboardCard>
    </div>
  )
}
