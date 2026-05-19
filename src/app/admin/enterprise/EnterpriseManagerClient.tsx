'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import {
  Building2, Plus, X, Edit2, Trash2, Users, Globe,
  ToggleLeft, ToggleRight, ChevronDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { EnterpriseTenant } from './page'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TenantForm {
  name: string
  slug: string
  domain: string
  contact_email: string
  plan: 'enterprise' | 'white_label'
  max_users: number
  notes: string
  primary_color: string
  secondary_color: string
  accent_color: string
  logo_url: string
  platform_name: string
  custom_css: string
}

const EMPTY_FORM: TenantForm = {
  name: '',
  slug: '',
  domain: '',
  contact_email: '',
  plan: 'enterprise',
  max_users: 100,
  notes: '',
  primary_color: '#E53935',
  secondary_color: '#0A0F1C',
  accent_color: '#FF6F00',
  logo_url: '',
  platform_name: '',
  custom_css: '',
}

function tenantToForm(t: EnterpriseTenant): TenantForm {
  return {
    name: t.name,
    slug: t.slug,
    domain: t.domain ?? '',
    contact_email: t.contact_email ?? '',
    plan: (t.plan as 'enterprise' | 'white_label') ?? 'enterprise',
    max_users: t.max_users ?? 100,
    notes: t.notes ?? '',
    primary_color: t.primary_color ?? '#E53935',
    secondary_color: t.secondary_color ?? '#0A0F1C',
    accent_color: t.accent_color ?? '#FF6F00',
    logo_url: t.logo_url ?? '',
    platform_name: t.platform_name ?? '',
    custom_css: t.custom_css ?? '',
  }
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─── Plan Badge ───────────────────────────────────────────────────────────────

function PlanBadge({ plan }: { plan: string }) {
  if (plan === 'white_label') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
        White Label
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
      Enterprise
    </span>
  )
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  tenant: EnterpriseTenant
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}

function ConfirmDialog({ tenant, onConfirm, onCancel, loading }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-[#0A0F1C] mb-2">Delete Tenant</h2>
        <p className="text-sm text-gray-600 mb-1">
          Are you sure you want to delete <strong>{tenant.name}</strong>?
        </p>
        <p className="text-xs text-red-600 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Tenant Form Modal ────────────────────────────────────────────────────────

interface TenantModalProps {
  editingTenant: EnterpriseTenant | null
  onClose: () => void
  onSaved: (tenant: EnterpriseTenant) => void
  onCreated: (tenant: EnterpriseTenant) => void
}

function TenantModal({ editingTenant, onClose, onSaved, onCreated }: TenantModalProps) {
  const [form, setForm] = useState<TenantForm>(
    editingTenant ? tenantToForm(editingTenant) : EMPTY_FORM
  )
  const [saving, setSaving] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const set = <K extends keyof TenantForm>(key: K, val: TenantForm[K]) =>
    setForm((f) => ({ ...f, [key]: val }))

  const handleNameChange = (val: string) => {
    setForm((f) => ({
      ...f,
      name: val,
      slug: editingTenant ? f.slug : slugify(val),
    }))
  }

  const handleSubmit = useCallback(async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error('Name and slug are required')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        domain: form.domain.trim() || null,
        contact_email: form.contact_email.trim() || null,
        plan: form.plan,
        max_users: Number(form.max_users),
        notes: form.notes.trim() || null,
        primary_color: form.primary_color,
        secondary_color: form.secondary_color,
        accent_color: form.accent_color,
        logo_url: form.logo_url.trim() || null,
        platform_name: form.platform_name.trim() || null,
        custom_css: form.custom_css.trim() || null,
      }

      const url = editingTenant
        ? `/api/admin/enterprise/${editingTenant.id}`
        : '/api/admin/enterprise'
      const method = editingTenant ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Request failed')

      toast.success(editingTenant ? 'Tenant updated' : 'Tenant created')
      if (editingTenant) {
        onSaved(json.data)
      } else {
        onCreated(json.data)
      }
      onClose()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save tenant')
    } finally {
      setSaving(false)
    }
  }, [form, editingTenant, onClose, onSaved, onCreated])

  const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/30 focus:border-[#E53935]'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold text-[#0A0F1C]">
            {editingTenant ? 'Edit Tenant' : 'Add Tenant'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className={labelCls}>Tenant Name *</label>
            <input
              type="text"
              className={inputCls}
              placeholder="Acme Trading Corp"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          {/* Slug */}
          <div>
            <label className={labelCls}>Slug *</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 font-mono">/t/</span>
              <input
                type="text"
                className={`${inputCls} flex-1`}
                placeholder="acme-trading"
                value={form.slug}
                onChange={(e) => set('slug', slugify(e.target.value))}
              />
            </div>
          </div>

          {/* Domain */}
          <div>
            <label className={labelCls}>Domain</label>
            <input
              type="text"
              className={inputCls}
              placeholder="trading.acmecorp.com"
              value={form.domain}
              onChange={(e) => set('domain', e.target.value)}
            />
          </div>

          {/* Contact Email */}
          <div>
            <label className={labelCls}>Contact Email</label>
            <input
              type="email"
              className={inputCls}
              placeholder="admin@acmecorp.com"
              value={form.contact_email}
              onChange={(e) => set('contact_email', e.target.value)}
            />
          </div>

          {/* Plan + Max Users */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Plan</label>
              <select
                className={inputCls}
                value={form.plan}
                onChange={(e) => set('plan', e.target.value as 'enterprise' | 'white_label')}
              >
                <option value="enterprise">Enterprise</option>
                <option value="white_label">White Label</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Max Users</label>
              <input
                type="number"
                min={1}
                className={inputCls}
                value={form.max_users}
                onChange={(e) => set('max_users', Number(e.target.value))}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Internal notes about this tenant…"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </div>

          {/* Primary Color */}
          <div>
            <label className={labelCls}>Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                value={form.primary_color}
                onChange={(e) => set('primary_color', e.target.value)}
              />
              <input
                type="text"
                className={`${inputCls} flex-1 font-mono`}
                value={form.primary_color}
                onChange={(e) => set('primary_color', e.target.value)}
              />
            </div>
          </div>

          {/* Advanced toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            />
            Advanced options
          </button>

          {showAdvanced && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              {/* Secondary / Accent color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-9 h-9 rounded border border-gray-300 cursor-pointer"
                      value={form.secondary_color}
                      onChange={(e) => set('secondary_color', e.target.value)}
                    />
                    <input
                      type="text"
                      className={`${inputCls} flex-1 font-mono`}
                      value={form.secondary_color}
                      onChange={(e) => set('secondary_color', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-9 h-9 rounded border border-gray-300 cursor-pointer"
                      value={form.accent_color}
                      onChange={(e) => set('accent_color', e.target.value)}
                    />
                    <input
                      type="text"
                      className={`${inputCls} flex-1 font-mono`}
                      value={form.accent_color}
                      onChange={(e) => set('accent_color', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <label className={labelCls}>Logo URL</label>
                <input
                  type="url"
                  className={inputCls}
                  placeholder="https://cdn.acme.com/logo.png"
                  value={form.logo_url}
                  onChange={(e) => set('logo_url', e.target.value)}
                />
              </div>

              {/* Platform name */}
              <div>
                <label className={labelCls}>Platform Name</label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="AcmeTrade Pro"
                  value={form.platform_name}
                  onChange={(e) => set('platform_name', e.target.value)}
                />
              </div>

              {/* Custom CSS */}
              <div>
                <label className={labelCls}>Custom CSS</label>
                <textarea
                  rows={4}
                  className={`${inputCls} resize-none font-mono text-xs`}
                  placeholder=":root { --brand: #E53935; }"
                  value={form.custom_css}
                  onChange={(e) => set('custom_css', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#E53935] hover:bg-[#C62828] text-white"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Saving…' : editingTenant ? 'Update Tenant' : 'Create Tenant'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Tenant Card ──────────────────────────────────────────────────────────────

interface TenantCardProps {
  tenant: EnterpriseTenant
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
  toggling: boolean
}

function TenantCard({ tenant, onEdit, onDelete, onToggleActive, toggling }: TenantCardProps) {
  const usagePct = tenant.max_users > 0
    ? Math.min(100, Math.round((tenant.user_count / tenant.max_users) * 100))
    : 0

  return (
    <Card className="relative overflow-hidden border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
      {/* Color accent strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: tenant.primary_color ?? '#E53935' }}
      />

      <CardContent className="pt-5 pb-4 px-5 space-y-4">
        {/* Top row: name + badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-bold text-[#0A0F1C] text-base leading-tight truncate">
              {tenant.name}
            </h3>
            {tenant.platform_name && (
              <p className="text-xs text-gray-400 mt-0.5 truncate">{tenant.platform_name}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <PlanBadge plan={tenant.plan} />
          </div>
        </div>

        {/* Slug */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            /t/{tenant.slug}
          </span>
        </div>

        {/* Domain */}
        {tenant.domain && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Globe className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{tenant.domain}</span>
          </div>
        )}

        {/* User count */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              <span>
                <strong className="text-[#0A0F1C]">{tenant.user_count}</strong>
                {' / '}
                <strong className="text-[#0A0F1C]">{tenant.max_users}</strong>
                {' users'}
              </span>
            </div>
            <span className="text-xs text-gray-400">{usagePct}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${usagePct >= 90 ? 'bg-red-500' : usagePct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
        </div>

        {/* Primary color swatch */}
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full border border-gray-200 flex-shrink-0"
            style={{ backgroundColor: tenant.primary_color ?? '#E53935' }}
          />
          <span className="text-xs font-mono text-gray-400">
            {tenant.primary_color ?? '#E53935'}
          </span>
        </div>

        {/* Contact email */}
        {tenant.contact_email && (
          <p className="text-xs text-gray-400 truncate">{tenant.contact_email}</p>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Actions */}
        <div className="flex items-center justify-between">
          {/* Active toggle */}
          <button
            onClick={onToggleActive}
            disabled={toggling}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors disabled:opacity-50"
            style={{ color: tenant.active ? '#2E7D32' : '#9E9E9E' }}
          >
            {tenant.active ? (
              <>
                <ToggleRight className="w-4 h-4 text-emerald-600" />
                Active
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-gray-400" />
                Inactive
              </>
            )}
          </button>

          {/* Edit / Delete */}
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Edit2 className="w-3.5 h-3.5 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={onDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Client Component ────────────────────────────────────────────────────

interface Props {
  initialTenants: EnterpriseTenant[]
}

export function EnterpriseManagerClient({ initialTenants }: Props) {
  const [tenants, setTenants] = useState<EnterpriseTenant[]>(initialTenants)
  const [showModal, setShowModal] = useState(false)
  const [editingTenant, setEditingTenant] = useState<EnterpriseTenant | null>(null)
  const [deletingTenant, setDeletingTenant] = useState<EnterpriseTenant | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // ── Stats ────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = tenants.length
    const active = tenants.filter((t) => t.active).length
    const whiteLabel = tenants.filter((t) => t.plan === 'white_label').length
    const totalUsers = tenants.reduce((sum, t) => sum + (t.user_count ?? 0), 0)
    return { total, active, whiteLabel, totalUsers }
  }, [tenants])

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSaved = useCallback((updated: EnterpriseTenant) => {
    setTenants((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
  }, [])

  const handleCreated = useCallback((created: EnterpriseTenant) => {
    setTenants((prev) => [{ ...created, user_count: 0 }, ...prev])
  }, [])

  const handleToggleActive = useCallback(async (tenant: EnterpriseTenant) => {
    setTogglingId(tenant.id)
    try {
      const res = await fetch(`/api/admin/enterprise/${tenant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !tenant.active }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Toggle failed')
      setTenants((prev) =>
        prev.map((t) => (t.id === tenant.id ? { ...t, active: !tenant.active } : t))
      )
      toast.success(`Tenant ${!tenant.active ? 'activated' : 'deactivated'}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to toggle status')
    } finally {
      setTogglingId(null)
    }
  }, [])

  const handleDelete = useCallback(async () => {
    if (!deletingTenant) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/enterprise/${deletingTenant.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Delete failed')
      setTenants((prev) => prev.filter((t) => t.id !== deletingTenant.id))
      toast.success('Tenant deleted')
      setDeletingTenant(null)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete tenant')
    } finally {
      setDeleting(false)
    }
  }, [deletingTenant])

  const openAdd = () => {
    setEditingTenant(null)
    setShowModal(true)
  }

  const openEdit = (t: EnterpriseTenant) => {
    setEditingTenant(t)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingTenant(null)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const statCards = [
    { label: 'Total Tenants', value: stats.total, color: '#0284C7' },
    { label: 'Active Tenants', value: stats.active, color: '#2E7D32' },
    { label: 'White Label', value: stats.whiteLabel, color: '#7C3AED' },
    { label: 'Enterprise Users', value: stats.totalUsers, color: '#E53935' },
  ]

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E53935]/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#E53935]" />
              </div>
              <h1 className="text-2xl font-bold text-[#0A0F1C]">Enterprise Manager</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1 ml-12">
              Manage enterprise tenants and white-label configurations
            </p>
          </div>
          <Button
            className="bg-[#E53935] hover:bg-[#C62828] text-white self-start sm:self-auto"
            onClick={openAdd}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tenant
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {s.label}
                </p>
                <p className="text-3xl font-bold" style={{ color: s.color }}>
                  {s.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tenants grid */}
        {tenants.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No enterprise tenants yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Click "Add Tenant" to create your first enterprise tenant.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tenants.map((tenant) => (
              <TenantCard
                key={tenant.id}
                tenant={tenant}
                onEdit={() => openEdit(tenant)}
                onDelete={() => setDeletingTenant(tenant)}
                onToggleActive={() => handleToggleActive(tenant)}
                toggling={togglingId === tenant.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tenant form modal */}
      {showModal && (
        <TenantModal
          editingTenant={editingTenant}
          onClose={closeModal}
          onSaved={handleSaved}
          onCreated={handleCreated}
        />
      )}

      {/* Delete confirm dialog */}
      {deletingTenant && (
        <ConfirmDialog
          tenant={deletingTenant}
          onConfirm={handleDelete}
          onCancel={() => setDeletingTenant(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
