'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Plus, Pencil, Trash2, X, Save, ToggleLeft, ToggleRight } from 'lucide-react'
import type { PlatformBrandingRow, EnterpriseTenantRow } from './page'

interface Props {
  initialBranding: PlatformBrandingRow | null
  initialTenants: EnterpriseTenantRow[]
}

const defaultBranding = {
  primary_color: '#E53935',
  secondary_color: '#0A0F1C',
  accent_color: '#FFC107',
  bg_color: '#FFFFFF',
  dark_bg_color: '#0A0F1C',
  logo_url: '',
  favicon_url: '',
  platform_name: '',
  tagline: '',
  custom_css: '',
}

const emptyTenantForm = () => ({
  name: '',
  slug: '',
  domain: '',
  contact_email: '',
  plan: 'enterprise',
  primary_color: '#E53935',
  secondary_color: '#0A0F1C',
  accent_color: '#FFC107',
  logo_url: '',
  platform_name: '',
  custom_css: '',
  max_users: '',
  notes: '',
  active: true,
})

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function ColorField({
  label,
  name,
  value,
  onChange,
}: {
  label: string
  name: string
  value: string
  onChange: (name: string, value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(name, e.target.value)}
          className="h-9 w-12 rounded border border-gray-300 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder="#000000"
          maxLength={7}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E53935]"
        />
      </div>
    </div>
  )
}

export function BrandingManagerClient({ initialBranding, initialTenants }: Props) {
  const [tab, setTab] = useState('platform')
  const [branding, setBranding] = useState({
    ...defaultBranding,
    ...(initialBranding ?? {}),
    primary_color: initialBranding?.primary_color ?? defaultBranding.primary_color,
    secondary_color: initialBranding?.secondary_color ?? defaultBranding.secondary_color,
    accent_color: initialBranding?.accent_color ?? defaultBranding.accent_color,
    bg_color: initialBranding?.bg_color ?? defaultBranding.bg_color,
    dark_bg_color: initialBranding?.dark_bg_color ?? defaultBranding.dark_bg_color,
    logo_url: initialBranding?.logo_url ?? '',
    favicon_url: initialBranding?.favicon_url ?? '',
    platform_name: initialBranding?.platform_name ?? '',
    tagline: initialBranding?.tagline ?? '',
    custom_css: initialBranding?.custom_css ?? '',
  })
  const [brandingSaving, setBrandingSaving] = useState(false)

  const [tenants, setTenants] = useState<EnterpriseTenantRow[]>(initialTenants)
  const [showTenantForm, setShowTenantForm] = useState(false)
  const [editingTenantId, setEditingTenantId] = useState<string | null>(null)
  const [tenantForm, setTenantForm] = useState(emptyTenantForm())
  const [tenantSaving, setTenantSaving] = useState(false)
  const [deletingTenantId, setDeletingTenantId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Branding handlers
  function handleBrandingColor(name: string, value: string) {
    setBranding((prev) => ({ ...prev, [name]: value }))
  }

  function handleBrandingField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setBranding((prev) => ({ ...prev, [name]: value }))
  }

  async function saveBranding() {
    setBrandingSaving(true)
    try {
      const res = await fetch('/api/admin/branding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branding),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to save')
      toast.success('Branding settings saved')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving branding')
    } finally {
      setBrandingSaving(false)
    }
  }

  // Tenant form handlers
  function handleTenantChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    setTenantForm((prev) => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value }
      if (name === 'name') updated.slug = slugify(value)
      return updated
    })
  }

  function handleTenantColor(name: string, value: string) {
    setTenantForm((prev) => ({ ...prev, [name]: value }))
  }

  function openAddTenant() {
    setEditingTenantId(null)
    setTenantForm(emptyTenantForm())
    setShowTenantForm(true)
  }

  function openEditTenant(t: EnterpriseTenantRow) {
    setEditingTenantId(t.id)
    setTenantForm({
      name: t.name,
      slug: t.slug,
      domain: t.domain ?? '',
      contact_email: t.contact_email ?? '',
      plan: t.plan ?? 'enterprise',
      primary_color: t.primary_color ?? '#E53935',
      secondary_color: t.secondary_color ?? '#0A0F1C',
      accent_color: t.accent_color ?? '#FFC107',
      logo_url: t.logo_url ?? '',
      platform_name: t.platform_name ?? '',
      custom_css: t.custom_css ?? '',
      max_users: t.max_users != null ? String(t.max_users) : '',
      notes: t.notes ?? '',
      active: t.active,
    })
    setShowTenantForm(true)
  }

  function closeTenantForm() {
    setShowTenantForm(false)
    setEditingTenantId(null)
    setTenantForm(emptyTenantForm())
  }

  async function saveTenant() {
    if (!tenantForm.name.trim() || !tenantForm.slug.trim()) {
      toast.error('Name and slug are required')
      return
    }
    setTenantSaving(true)
    const payload = {
      ...tenantForm,
      max_users: tenantForm.max_users ? parseInt(tenantForm.max_users, 10) : null,
    }
    try {
      if (editingTenantId) {
        const res = await fetch(`/api/admin/branding/tenants/${editingTenantId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Failed to update')
        setTenants((prev) => prev.map((t) => (t.id === editingTenantId ? json.data : t)))
        toast.success('Tenant updated')
      } else {
        const res = await fetch('/api/admin/branding/tenants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Failed to create')
        setTenants((prev) => [json.data, ...prev])
        toast.success('Tenant created')
      }
      closeTenantForm()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving tenant')
    } finally {
      setTenantSaving(false)
    }
  }

  async function deleteTenant(id: string) {
    if (!confirm('Delete this tenant? This cannot be undone.')) return
    setDeletingTenantId(id)
    try {
      const res = await fetch(`/api/admin/branding/tenants/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to delete')
      setTenants((prev) => prev.filter((t) => t.id !== id))
      toast.success('Tenant deleted')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error deleting tenant')
    } finally {
      setDeletingTenantId(null)
    }
  }

  async function toggleTenantActive(tenant: EnterpriseTenantRow) {
    setTogglingId(tenant.id)
    try {
      const res = await fetch(`/api/admin/branding/tenants/${tenant.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !tenant.active }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to update')
      setTenants((prev) => prev.map((t) => (t.id === tenant.id ? json.data : t)))
      toast.success(`Tenant ${!tenant.active ? 'activated' : 'deactivated'}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error toggling tenant')
    } finally {
      setTogglingId(null)
    }
  }

  const planBadgeVariant = (plan: string | null) => {
    if (plan === 'enterprise') return 'success'
    if (plan === 'pro') return 'warning'
    return 'default'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0A0F1C]">Branding & Theme Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Configure platform appearance and enterprise tenant themes</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="platform">Platform Defaults</TabsTrigger>
          <TabsTrigger value="tenants">Enterprise Tenants</TabsTrigger>
        </TabsList>

        {/* Platform Defaults Tab */}
        <TabsContent value="platform">
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Colors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ColorField label="Primary Color" name="primary_color" value={branding.primary_color} onChange={handleBrandingColor} />
                    <ColorField label="Secondary Color" name="secondary_color" value={branding.secondary_color} onChange={handleBrandingColor} />
                    <ColorField label="Accent Color" name="accent_color" value={branding.accent_color} onChange={handleBrandingColor} />
                    <ColorField label="Background Color" name="bg_color" value={branding.bg_color} onChange={handleBrandingColor} />
                    <ColorField label="Dark Background" name="dark_bg_color" value={branding.dark_bg_color} onChange={handleBrandingColor} />
                  </div>
                </CardContent>
              </Card>

              {/* Identity */}
              <Card>
                <CardHeader>
                  <CardTitle>Identity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                      <input
                        type="text"
                        name="platform_name"
                        value={branding.platform_name}
                        onChange={handleBrandingField}
                        placeholder="ProStep2Market"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                      <input
                        type="text"
                        name="tagline"
                        value={branding.tagline}
                        onChange={handleBrandingField}
                        placeholder="Your trading edge starts here"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                      <input
                        type="text"
                        name="logo_url"
                        value={branding.logo_url}
                        onChange={handleBrandingField}
                        placeholder="https://..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
                      <input
                        type="text"
                        name="favicon_url"
                        value={branding.favicon_url}
                        onChange={handleBrandingField}
                        placeholder="https://..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Custom CSS */}
              <Card>
                <CardHeader>
                  <CardTitle>Custom CSS</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    name="custom_css"
                    value={branding.custom_css}
                    onChange={handleBrandingField}
                    rows={10}
                    placeholder="/* Custom CSS overrides */"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E53935] resize-y"
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button variant="primary" onClick={saveBranding} disabled={brandingSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {brandingSaving ? 'Saving...' : 'Save Branding'}
                </Button>
              </div>
            </div>

            {/* Color Preview */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Color Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: 'Primary', key: 'primary_color' },
                      { label: 'Secondary', key: 'secondary_color' },
                      { label: 'Accent', key: 'accent_color' },
                      { label: 'Background', key: 'bg_color' },
                      { label: 'Dark Background', key: 'dark_bg_color' },
                    ].map(({ label, key }) => {
                      const color = branding[key as keyof typeof branding] as string
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg border border-gray-200 flex-shrink-0"
                            style={{ backgroundColor: color || '#f0f0f0' }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-700">{label}</p>
                            <p className="text-xs text-gray-400 font-mono">{color || 'not set'}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {branding.platform_name && (
                    <div
                      className="mt-4 rounded-lg p-4"
                      style={{ backgroundColor: branding.primary_color || '#E53935' }}
                    >
                      <p className="text-white font-bold text-lg">{branding.platform_name}</p>
                      {branding.tagline && (
                        <p className="text-white/80 text-sm mt-1">{branding.tagline}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Enterprise Tenants Tab */}
        <TabsContent value="tenants">
          <div className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button variant="primary" onClick={openAddTenant}>
                <Plus className="w-4 h-4 mr-2" />
                Add Tenant
              </Button>
            </div>

            {/* Tenant Form */}
            {showTenantForm && (
              <Card className="border border-[#E53935]/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{editingTenantId ? 'Edit Tenant' : 'Add Enterprise Tenant'}</CardTitle>
                    <button onClick={closeTenantForm} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-[#E53935]">*</span></label>
                      <input type="text" name="name" value={tenantForm.name} onChange={handleTenantChange}
                        placeholder="Acme Corp" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-[#E53935]">*</span></label>
                      <input type="text" name="slug" value={tenantForm.slug} onChange={handleTenantChange}
                        placeholder="acme-corp" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E53935]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                      <input type="text" name="domain" value={tenantForm.domain} onChange={handleTenantChange}
                        placeholder="acme.prostep2market.com" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                      <input type="email" name="contact_email" value={tenantForm.contact_email} onChange={handleTenantChange}
                        placeholder="admin@acme.com" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                      <select name="plan" value={tenantForm.plan} onChange={handleTenantChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]">
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Users</label>
                      <input type="number" name="max_users" value={tenantForm.max_users} onChange={handleTenantChange}
                        placeholder="100" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                      <input type="text" name="platform_name" value={tenantForm.platform_name} onChange={handleTenantChange}
                        placeholder="Acme Trading Platform" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                      <input type="text" name="logo_url" value={tenantForm.logo_url} onChange={handleTenantChange}
                        placeholder="https://..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]" />
                    </div>

                    {/* Color pickers */}
                    <ColorField label="Primary Color" name="primary_color" value={tenantForm.primary_color} onChange={handleTenantColor} />
                    <ColorField label="Secondary Color" name="secondary_color" value={tenantForm.secondary_color} onChange={handleTenantColor} />
                    <ColorField label="Accent Color" name="accent_color" value={tenantForm.accent_color} onChange={handleTenantColor} />

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea name="notes" value={tenantForm.notes} onChange={handleTenantChange} rows={2}
                        placeholder="Internal notes about this tenant..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935] resize-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Custom CSS</label>
                      <textarea name="custom_css" value={tenantForm.custom_css} onChange={handleTenantChange} rows={4}
                        placeholder="/* Tenant-specific CSS */"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E53935] resize-y" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={closeTenantForm} disabled={tenantSaving}>Cancel</Button>
                    <Button variant="primary" onClick={saveTenant} disabled={tenantSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {tenantSaving ? 'Saving...' : 'Save Tenant'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tenants Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Domain</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Plan</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Max Users</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Active</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenants.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-gray-400">
                            No tenants yet.{' '}
                            <button onClick={openAddTenant} className="text-[#E53935] hover:underline">Add one.</button>
                          </td>
                        </tr>
                      ) : (
                        tenants.map((t) => (
                          <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-[#0A0F1C]">{t.name}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.slug}</td>
                            <td className="px-4 py-3 text-gray-600 text-xs">{t.domain ?? '—'}</td>
                            <td className="px-4 py-3">
                              <Badge variant={planBadgeVariant(t.plan)}>{t.plan ?? 'n/a'}</Badge>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{t.max_users ?? '∞'}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => toggleTenantActive(t)}
                                disabled={togglingId === t.id}
                                className="text-gray-500 hover:text-[#E53935] disabled:opacity-50 transition-colors"
                                title={t.active ? 'Deactivate' : 'Activate'}
                              >
                                {t.active ? (
                                  <ToggleRight className="w-6 h-6 text-[#2E7D32]" />
                                ) : (
                                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                                )}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button onClick={() => openEditTenant(t)}
                                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#E53935] transition-colors">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => deleteTenant(t.id)}
                                  disabled={deletingTenantId === t.id}
                                  className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50">
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
