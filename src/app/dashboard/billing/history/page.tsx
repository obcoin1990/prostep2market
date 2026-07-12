'use client'

import { Clock, Download, FileText, CreditCard, Search, Filter, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

interface Invoice {
  id: string
  user_id: string
  stripe_invoice_id: string
  amount_cents: number
  currency: string
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  description: string
  invoice_url: string | null
  period_start: string
  period_end: string
  created_at: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function statusLabel(status: Invoice['status']): string {
  switch (status) {
    case 'paid': return 'Paid'
    case 'pending': return 'Pending'
    case 'failed': return 'Failed'
    case 'refunded': return 'Refunded'
    default: return status
  }
}

function statusVariant(status: Invoice['status']): 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'paid': return 'success'
    case 'pending': return 'warning'
    case 'failed': return 'danger'
    case 'refunded': return 'info'
    default: return 'info'
  }
}

export default function BillingHistoryPage() {
  const { data: invoices, loading } = useRealtimeData<Invoice[]>(
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

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Billing History"
          description="View past invoices and payment records"
          icon={Clock}
        />
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Billing History"
        description="View past invoices and payment records"
        icon={Clock}
      />

      <DashboardCard>
        <DashboardCardHeader className="flex items-center justify-between">
          <DashboardCardTitle>Invoices</DashboardCardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/60" />
              <input type="text" placeholder="Search invoices..." className="w-36 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 pl-8 text-xs text-white placeholder:text-white/50 outline-none focus:border-[#fcd535]/50" />
            </div>
            <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5 transition-colors">
              <Filter className="h-3.5 w-3.5 inline mr-1" />
              Filter
            </button>
          </div>
        </DashboardCardHeader>
        <DashboardCardBody>
          {!invoices || invoices.length === 0 ? (
            <EmptyState
              icon={<FileText className="w-6 h-6" />}
              title="No invoices yet"
              description="Your billing history will appear here once you have active subscriptions."
              variant="compact"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 font-medium text-[10px] text-white/60 uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-[10px] text-white/60 uppercase tracking-wider">Description</th>
                    <th className="text-right py-3 px-4 font-medium text-[10px] text-white/60 uppercase tracking-wider">Amount</th>
                    <th className="text-center py-3 px-4 font-medium text-[10px] text-white/60 uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-[10px] text-white/60 uppercase tracking-wider">Invoice</th>
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-sm text-white">{formatDate(inv.created_at)}</td>
                      <td className="py-3 px-4 text-sm text-white/80">{inv.description}</td>
                      <td className="py-3 px-4 text-right font-mono text-sm text-white">{formatAmount(inv.amount_cents)}</td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge
                          label={statusLabel(inv.status)}
                          variant={statusVariant(inv.status)}
                        />
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-mono text-white/60">{inv.stripe_invoice_id}</td>
                      <td className="py-3 px-4 text-right">
                        {inv.invoice_url ? (
                          <a href={inv.invoice_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white/60 transition-colors inline-block">
                            <Download className="h-4 w-4" />
                          </a>
                        ) : (
                          <button className="p-1.5 rounded-md text-white/50 cursor-not-allowed">
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DashboardCardBody>
      </DashboardCard>

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardTitle>Payment Methods</DashboardCardTitle>
        </DashboardCardHeader>
        <DashboardCardBody>
          <div className="space-y-3">
            <p className="text-sm text-white/60 text-center py-4">Manage payment methods through your billing provider&apos;s customer portal.</p>
            <p className="text-xs text-white/40 text-center">For billing inquiries, contact <span className="text-[#fcd535]">billing@prostep2market.com</span></p>
          </div>
        </DashboardCardBody>
      </DashboardCard>

      <div className="text-sm text-white/60 text-center">
        For billing inquiries, contact <span className="text-[#fcd535]">billing@prostep2market.com</span>
      </div>
    </div>
  )
}
