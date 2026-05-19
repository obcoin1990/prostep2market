'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'
import { Pencil, Trash2, Plus, X, Save, Search } from 'lucide-react'
import type { SEOSettingRow } from './page'

interface Props {
  initialSettings: SEOSettingRow[]
}

const emptyForm = (): Omit<SEOSettingRow, 'id' | 'updated_at' | 'updated_by'> => ({
  page_path: '',
  title: '',
  description: '',
  keywords: '',
  og_title: '',
  og_description: '',
  og_image: '',
  canonical_url: '',
  no_index: false,
})

export function SEOManagerClient({ initialSettings }: Props) {
  const [settings, setSettings] = useState<SEOSettingRow[]>(initialSettings)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = settings.filter(
    (s) =>
      s.page_path.toLowerCase().includes(search.toLowerCase()) ||
      (s.title ?? '').toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm())
    setShowForm(true)
  }

  function openEdit(row: SEOSettingRow) {
    setEditingId(row.id)
    setForm({
      page_path: row.page_path,
      title: row.title ?? '',
      description: row.description ?? '',
      keywords: row.keywords ?? '',
      og_title: row.og_title ?? '',
      og_description: row.og_description ?? '',
      og_image: row.og_image ?? '',
      canonical_url: row.canonical_url ?? '',
      no_index: row.no_index,
    })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm())
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleSave() {
    if (!form.page_path.trim()) {
      toast.error('Page path is required')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/seo/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Failed to update')
        setSettings((prev) => prev.map((s) => (s.id === editingId ? json.data : s)))
        toast.success('SEO settings updated')
      } else {
        const res = await fetch('/api/admin/seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Failed to create')
        setSettings((prev) => [...prev, json.data])
        toast.success('SEO page added')
      }
      closeForm()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this SEO setting?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/seo/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to delete')
      setSettings((prev) => prev.filter((s) => s.id !== id))
      toast.success('SEO setting deleted')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0F1C]">SEO Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Manage meta tags for each page of the platform</p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Page
        </Button>
      </div>

      {/* Info alert */}
      <Alert variant="info">
        <span className="text-sm text-blue-800">
          Changes apply to meta tags served on each page. Deploy needed for static pages.
        </span>
      </Alert>

      {/* Form modal / inline panel */}
      {showForm && (
        <Card className="border border-[#E53935]/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? 'Edit SEO Settings' : 'Add Page SEO Settings'}</CardTitle>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Path <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="text"
                  name="page_path"
                  value={form.page_path}
                  onChange={handleChange}
                  placeholder="/blog/post-1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title ?? ''}
                  onChange={handleChange}
                  placeholder="Page title"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                <input
                  type="text"
                  name="keywords"
                  value={form.keywords ?? ''}
                  onChange={handleChange}
                  placeholder="keyword1, keyword2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description ?? ''}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Page meta description"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935] resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
                <input
                  type="text"
                  name="og_title"
                  value={form.og_title ?? ''}
                  onChange={handleChange}
                  placeholder="Open Graph title"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                <input
                  type="text"
                  name="og_image"
                  value={form.og_image ?? ''}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
                <textarea
                  name="og_description"
                  value={form.og_description ?? ''}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Open Graph description"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935] resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                <input
                  type="text"
                  name="canonical_url"
                  value={form.canonical_url ?? ''}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                />
              </div>
              <div className="flex items-center gap-3 mt-6">
                <input
                  type="checkbox"
                  id="no_index"
                  name="no_index"
                  checked={form.no_index}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#E53935]"
                />
                <label htmlFor="no_index" className="text-sm font-medium text-gray-700">
                  No Index (tell search engines not to index this page)
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={closeForm} disabled={saving}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pages..."
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Page Path</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">No Index</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Last Updated</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      No SEO settings found.{' '}
                      <button onClick={openAdd} className="text-[#E53935] hover:underline">
                        Add the first one.
                      </button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-[#0A0F1C]">{row.page_path}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-[160px] truncate">{row.title ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[200px]">
                        <span className="line-clamp-2 block">
                          {row.description ? (row.description.length > 80 ? row.description.slice(0, 80) + '…' : row.description) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {row.no_index ? (
                          <Badge variant="warning">No Index</Badge>
                        ) : (
                          <Badge variant="default">Indexed</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {row.updated_at ? new Date(row.updated_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(row)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#E53935] transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            disabled={deletingId === row.id}
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
        </CardContent>
      </Card>
    </div>
  )
}
