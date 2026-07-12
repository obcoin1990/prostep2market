'use client'

import React, { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Search, Pencil, Trash2, X, Save, ChevronLeft, ChevronRight } from 'lucide-react'
import type { SubscriptionRow, BillingStats } from './page'

interface Props {
  initialSubscriptions: SubscriptionRow[]
  initialTotal: number
  initialStats: BillingStats
}

const PLAN_COLORS: Record<string, string> = {
  free: 'default',
  pro: 'warning',
  enterprise: 'success',
}

const STATUS_COLORS: Record<string, 'default' | 'success' | 'warning' | 'error' | 'outline'> = {
  active: 'success',
  trialing: 'warning',
  past_due: 'error',
  cancelled: 'outline',
  paused: 'default',
}

const PAGE_SIZE = 20

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm text-gray-500 mt-2">{label}</p>
        <p className="text-3xl font-bold text-[#0A0F1C] mt-1">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </CardContent>
    </Card>
  )
}

function PlanBar({ plan, count, total }: { plan: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  const color = plan === 'enterprise' ? '#2E7D32' : plan === 'pro' ? '#E53935' : '#9E9E9E'
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium capitalize text-gray-700">{plan}</span>
        <span className="text-gray-500">{count} ({pct}%)</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

interface EditFormState {
  subId: string
  plan: string
  status: string
}

export function BillingManagerClient({ initialSubscriptions, initialTotal, initialStats }: Props) {
  const [tab, setTab] = useState('overview')
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>(initialSubscriptions)
  const [total, setTotal] = useState(initialTotal)
  const [stats] = useState<BillingStats>(initialStats)

  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const [editForm, setEditForm] = useState<EditFormState | null>(null)
  const [editSaving, setEditSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const fetchSubscriptions = useCallback(
    async (p: number, pl: string, st: string, s: string) => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: String(PAGE_SIZE),
          plan: pl,
          status: st,
          search: s,
        })
        const res = await fetch(`/api/admin/billing?${params}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Failed to fetch')
        setSubscriptions(json.subscriptions)
        setTotal(json.total)
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Error fetching subscriptions')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  async function applyFilters() {
    setPage(1)
    await fetchSubscriptions(1, planFilter, statusFilter, search)
  }

  async function goPage(p: number) {
    setPage(p)
    await fetchSubscriptions(p, planFilter, statusFilter, search)
  }

  async function handleEditSave() {
    if (!editForm) return
    setEditSaving(true)
    try {
      const res = await fetch(`/api/admin/billing/${editForm.subId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: editForm.plan, status: editForm.status }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to update')
      setSubscriptions((prev) => prev.map((s) => (s.id === editForm.subId ? { ...s, ...json.data } : s)))
      toast.success('Subscription updated')
      setEditForm(null)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error updating subscription')
    } finally {
      setEditSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this subscription record? This cannot be undone.')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/billing/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to delete')
      setSubscriptions((prev) => prev.filter((s) => s.id !== id))
      setTotal((prev) => prev - 1)
      toast.success('Subscription deleted')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error deleting subscription')
    } finally {
      setDeletingId(null)
    }
  }

  // Compute stats
  const totalSubs = Object.values(stats.byPlan).reduce((a, b) => a + b, 0)
  const activePro = (stats.byStatus['active'] && stats.byPlan['pro'])
    ? Math.min(stats.byPlan['pro'] ?? 0, stats.byStatus['active'] ?? 0)
    : (stats.byPlan['pro'] ?? 0)
  const activeEnterprise = stats.byPlan['enterprise'] ?? 0
  const cancelled = stats.byStatus['cancelled'] ?? 0
  // Simple MRR estimate
  const mrrEstimate = ((stats.byPlan['pro'] ?? 0) * 29 + (stats.byPlan['enterprise'] ?? 0) * 199)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0A0F1C]">Billing & Subscriptions</h1>
        <p className="text-sm text-gray-500 mt-1">Manage user subscriptions and revenue</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="mt-4 space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Subscriptions" value={totalSubs} />
              <StatCard label="Active Pro" value={activePro} />
              <StatCard label="Active Enterprise" value={activeEnterprise} />
              <StatCard label="Cancelled" value={cancelled} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* MRR */}
              <Card>
                <CardHeader>
                  <CardTitle>MRR Estimate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-[#0A0F1C]">${mrrEstimate.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Based on {stats.byPlan['pro'] ?? 0} Pro × $29 + {stats.byPlan['enterprise'] ?? 0} Enterprise × $199
                  </p>
                </CardContent>
              </Card>

              {/* Plan distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.byPlan).length === 0 ? (
                      <p className="text-sm text-gray-400">No data yet</p>
                    ) : (
                      Object.entries(stats.byPlan).map(([plan, count]) => (
                        <PlanBar key={plan} plan={plan} count={count} total={totalSubs} />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(stats.byStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                      <Badge variant={STATUS_COLORS[status] ?? 'default'}>{status}</Badge>
                      <span className="text-sm font-semibold text-gray-700">{count}</span>
                    </div>
                  ))}
                  {Object.keys(stats.byStatus).length === 0 && (
                    <p className="text-sm text-gray-400">No data yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions">
          <div className="mt-4 space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-end">
              <div className="relative flex-1 sm:min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  aria-label="Search by email"
                  placeholder="Search by email..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                />
              </div>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                aria-label="Filter by plan"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
              >
                <option value="all">All Plans</option>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="trialing">Trialing</option>
                <option value="past_due">Past Due</option>
                <option value="cancelled">Cancelled</option>
                <option value="paused">Paused</option>
              </select>
              <Button variant="primary" onClick={applyFilters} disabled={loading}>
                {loading ? 'Loading...' : 'Apply'}
              </Button>
            </div>

            {/* Edit inline form */}
            {editForm && (
              <Card className="border border-[#E53935]/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Edit Subscription</CardTitle>
                    <button onClick={() => setEditForm(null)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                      <select
                        value={editForm.plan}
                        onChange={(e) => setEditForm((prev) => prev ? { ...prev, plan: e.target.value } : null)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm((prev) => prev ? { ...prev, status: e.target.value } : null)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                      >
                        <option value="active">Active</option>
                        <option value="trialing">Trialing</option>
                        <option value="past_due">Past Due</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="paused">Paused</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <Button variant="outline" onClick={() => setEditForm(null)} disabled={editSaving}>Cancel</Button>
                    <Button variant="primary" onClick={handleEditSave} disabled={editSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {editSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left px-4 py-3 font-medium text-gray-600">User Email</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Plan</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Provider</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Period End</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Cancel EOT</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={8} className="text-center py-12 text-gray-400">Loading...</td>
                        </tr>
                      ) : subscriptions.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-12 text-gray-400">No subscriptions found.</td>
                        </tr>
                      ) : (
                        subscriptions.map((sub) => (
                          <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3 text-gray-700 text-xs max-w-[180px] truncate">
                              {sub.user_email ?? <code className="text-xs font-mono text-gray-500" title={sub.user_id}>{sub.user_id.slice(0, 8)}…</code>}
                            </td>
                            <td className="px-4 py-3">
                              {sub.plan ? (
                                <Badge variant={(PLAN_COLORS[sub.plan] ?? 'default') as 'default' | 'success' | 'warning' | 'error' | 'outline'}>
                                  {sub.plan}
                                </Badge>
                              ) : '—'}
                            </td>
                            <td className="px-4 py-3">
                              {sub.status ? (
                                <Badge variant={STATUS_COLORS[sub.status] ?? 'default'}>{sub.status}</Badge>
                              ) : '—'}
                            </td>
                            <td className="px-4 py-3 text-gray-500 capitalize">{sub.provider ?? '—'}</td>
                            <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                              {sub.current_period_end
                                ? new Date(sub.current_period_end).toLocaleDateString()
                                : '—'}
                            </td>
                            <td className="px-4 py-3">
                              {sub.cancel_at_period_end ? (
                                <Badge variant="warning">Yes</Badge>
                              ) : (
                                <span className="text-gray-400 text-xs">No</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                              {new Date(sub.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    setEditForm({
                                      subId: sub.id,
                                      plan: sub.plan ?? 'free',
                                      status: sub.status ?? 'active',
                                    })
                                  }
                                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#E53935] transition-colors"
                                  title="Edit"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(sub.id)}
                                  disabled={deletingId === sub.id}
                                  className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Page {page} of {totalPages} ({total} total)
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goPage(page - 1)}
                        disabled={page <= 1 || loading}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goPage(page + 1)}
                        disabled={page >= totalPages || loading}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
