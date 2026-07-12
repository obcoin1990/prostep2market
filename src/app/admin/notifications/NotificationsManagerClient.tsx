'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import {
  Bell, Plus, X, Edit2, Trash2, Eye, Send,
  CheckCircle2, XCircle, AlertTriangle, Mail,
  RefreshCw, Filter,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { EmailTemplate, NotificationLog } from './page'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TemplateForm {
  key: string
  name: string
  subject: string
  html_body: string
  text_body: string
  variables_raw: string // comma-separated
  active: boolean
}

const EMPTY_TEMPLATE_FORM: TemplateForm = {
  key: '',
  name: '',
  subject: '',
  html_body: '',
  text_body: '',
  variables_raw: '',
  active: true,
}

function templateToForm(t: EmailTemplate): TemplateForm {
  return {
    key: t.key,
    name: t.name,
    subject: t.subject,
    html_body: t.html_body,
    text_body: t.text_body ?? '',
    variables_raw: (t.variables ?? []).join(', '),
    active: t.active,
  }
}

function parseVariables(raw: string): string[] {
  return raw
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: NotificationLog['status'] }) {
  const map: Record<string, { label: string; cls: string }> = {
    sent: { label: 'Sent', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    failed: { label: 'Failed', cls: 'bg-red-100 text-red-700 border-red-200' },
    bounced: { label: 'Bounced', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    opened: { label: 'Opened', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  }
  const { label, cls } = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600 border-gray-200' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  )
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  name: string
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}

function ConfirmDialog({ name, onConfirm, onCancel, loading }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-[#0A0F1C] mb-2">Delete Template</h2>
        <p className="text-sm text-gray-600 mb-1">
          Delete template <strong>{name}</strong>?
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

// ─── HTML Preview Modal ───────────────────────────────────────────────────────

interface PreviewModalProps {
  template: EmailTemplate
  onClose: () => void
}

function PreviewModal({ template, onClose }: PreviewModalProps) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#0A0F1C]">Preview: {template.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Variables are shown as-is (not replaced)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 border-b flex-shrink-0">
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">Subject</p>
          <p className="text-sm font-medium text-[#0A0F1C]">{template.subject}</p>
        </div>

        <div className="flex-1 overflow-hidden p-4">
          <iframe
            srcDoc={template.html_body}
            className="w-full h-full rounded-lg border border-gray-200"
            sandbox="allow-same-origin"
            title={`Preview of ${template.name}`}
          />
        </div>

        <div className="p-4 border-t flex-shrink-0 flex justify-end">
          <Button variant="outline" onClick={onClose}>Close Preview</Button>
        </div>
      </div>
    </div>
  )
}

// ─── Template Form Modal ──────────────────────────────────────────────────────

interface TemplateModalProps {
  editing: EmailTemplate | null
  onClose: () => void
  onSaved: (t: EmailTemplate) => void
  onCreated: (t: EmailTemplate) => void
}

function TemplateModal({ editing, onClose, onSaved, onCreated }: TemplateModalProps) {
  const [form, setForm] = useState<TemplateForm>(
    editing ? templateToForm(editing) : EMPTY_TEMPLATE_FORM
  )
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof TemplateForm>(key: K, val: TemplateForm[K]) =>
    setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = useCallback(async () => {
    if (!form.key.trim() || !form.name.trim() || !form.subject.trim() || !form.html_body.trim()) {
      toast.error('Key, name, subject, and HTML body are required')
      return
    }
    setSaving(true)
    try {
      const payload = {
        key: form.key.trim(),
        name: form.name.trim(),
        subject: form.subject.trim(),
        html_body: form.html_body,
        text_body: form.text_body.trim() || null,
        variables: parseVariables(form.variables_raw),
        active: form.active,
      }

      const url = editing ? `/api/admin/notifications/${editing.id}` : '/api/admin/notifications'
      const method = editing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Request failed')

      toast.success(editing ? 'Template updated' : 'Template created')
      if (editing) onSaved(json.data)
      else onCreated(json.data)
      onClose()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save template')
    } finally {
      setSaving(false)
    }
  }, [form, editing, onClose, onSaved, onCreated])

  const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/60 focus:border-[#E53935]'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold text-[#0A0F1C]">
            {editing ? 'Edit Template' : 'Add Template'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Key + Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Key (slug) *</label>
              <input
                type="text"
                className={`${inputCls} font-mono`}
                placeholder="welcome_email"
                value={form.key}
                onChange={(e) => set('key', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                disabled={!!editing}
              />
            </div>
            <div>
              <label className={labelCls}>Name *</label>
              <input
                type="text"
                className={inputCls}
                placeholder="Welcome Email"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className={labelCls}>Subject *</label>
            <input
              type="text"
              className={inputCls}
              placeholder="Welcome to {{platform_name}}, {{first_name}}!"
              value={form.subject}
              onChange={(e) => set('subject', e.target.value)}
            />
          </div>

          {/* Variables */}
          <div>
            <label className={labelCls}>Variables (comma-separated)</label>
            <input
              type="text"
              className={inputCls}
              placeholder="first_name, platform_name, reset_link"
              value={form.variables_raw}
              onChange={(e) => set('variables_raw', e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              Use {'{{variable_name}}'} syntax in subject and body
            </p>
          </div>

          {/* HTML Body */}
          <div>
            <label className={labelCls}>HTML Body *</label>
            <textarea
              rows={10}
              className={`${inputCls} font-mono text-xs resize-y`}
              placeholder="<h1>Hello {{first_name}}</h1>"
              value={form.html_body}
              onChange={(e) => set('html_body', e.target.value)}
            />
          </div>

          {/* Text Body */}
          <div>
            <label className={labelCls}>Text Body (plain text fallback)</label>
            <textarea
              rows={4}
              className={`${inputCls} font-mono text-xs resize-y`}
              placeholder="Hello {{first_name}}, ..."
              value={form.text_body}
              onChange={(e) => set('text_body', e.target.value)}
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={form.active}
              onClick={() => set('active', !form.active)}
              className={`relative inline-flex h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E53935]/60 ${form.active ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5 ${form.active ? 'translate-x-5.5 ml-0.5' : 'translate-x-0.5'}`}
                style={{ transform: form.active ? 'translateX(22px)' : 'translateX(2px)' }}
              />
            </button>
            <span className="text-sm text-gray-700">Active</span>
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#E53935] hover:bg-[#C62828] text-white"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Saving…' : editing ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Send Email Tab ───────────────────────────────────────────────────────────

interface SendEmailTabProps {
  templates: EmailTemplate[]
}

function SendEmailTab({ templates }: SendEmailTabProps) {
  const activeTemplates = templates.filter((t) => t.active)
  const [selectedKey, setSelectedKey] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [lastResult, setLastResult] = useState<{
    success: boolean
    resend_id?: string | null
    error?: string
  } | null>(null)

  const selectedTemplate = useMemo(
    () => activeTemplates.find((t) => t.key === selectedKey) ?? null,
    [activeTemplates, selectedKey]
  )

  const handleTemplateChange = (key: string) => {
    setSelectedKey(key)
    setVariableValues({})
    setLastResult(null)
  }

  const handleSend = useCallback(async () => {
    if (!selectedKey || !recipientEmail.trim()) {
      toast.error('Select a template and enter a recipient email')
      return
    }
    setSending(true)
    setLastResult(null)
    try {
      const res = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_key: selectedKey,
          recipient_email: recipientEmail.trim(),
          variables: variableValues,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setLastResult({ success: false, error: json.error ?? 'Send failed' })
        toast.error(json.error ?? 'Failed to send email')
      } else {
        setLastResult({ success: true, resend_id: json.resend_id })
        toast.success('Email sent successfully')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error'
      setLastResult({ success: false, error: msg })
      toast.error(msg)
    } finally {
      setSending(false)
    }
  }, [selectedKey, recipientEmail, variableValues])

  const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/60 focus:border-[#E53935]'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="max-w-xl space-y-5 pt-2">
      {/* Template select */}
      <div>
        <label className={labelCls}>Template *</label>
        <select
          className={inputCls}
          value={selectedKey}
          onChange={(e) => handleTemplateChange(e.target.value)}
        >
          <option value="">— select a template —</option>
          {activeTemplates.map((t) => (
            <option key={t.id} value={t.key}>
              {t.name} ({t.key})
            </option>
          ))}
        </select>
      </div>

      {/* Recipient */}
      <div>
        <label className={labelCls}>Recipient Email *</label>
        <input
          type="email"
          className={inputCls}
          placeholder="user@example.com"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
        />
      </div>

      {/* Variables */}
      {selectedTemplate && (selectedTemplate.variables ?? []).length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Template Variables</p>
          {(selectedTemplate.variables ?? []).map((variable) => (
            <div key={variable}>
              <label className="block text-xs font-medium text-gray-600 mb-1 font-mono">
                {`{{${variable}}}`}
              </label>
              <input
                type="text"
                className={inputCls}
                placeholder={`Value for ${variable}`}
                value={variableValues[variable] ?? ''}
                onChange={(e) =>
                  setVariableValues((prev) => ({ ...prev, [variable]: e.target.value }))
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Send button */}
      <Button
        className="bg-[#E53935] hover:bg-[#C62828] text-white"
        onClick={handleSend}
        disabled={sending || !selectedKey || !recipientEmail.trim()}
      >
        {sending ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Email
          </>
        )}
      </Button>

      {/* Result */}
      {lastResult && (
        <div
          className={`rounded-lg p-4 border text-sm ${
            lastResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {lastResult.success ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                Email sent!{' '}
                {lastResult.resend_id && (
                  <span className="font-mono text-xs opacity-70" title={lastResult.resend_id}>
                    Resend ID: {lastResult.resend_id.slice(0, 12)}…
                  </span>
                )}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              <span>{lastResult.error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Logs Tab ─────────────────────────────────────────────────────────────────

interface LogsTabProps {
  initialLogs: NotificationLog[]
}

type LogStatus = 'all' | 'sent' | 'failed' | 'bounced' | 'opened'

function LogsTab({ initialLogs }: LogsTabProps) {
  const [logs, setLogs] = useState<NotificationLog[]>(initialLogs)
  const [statusFilter, setStatusFilter] = useState<LogStatus>('all')
  const [loading, setLoading] = useState(false)

  const fetchLogs = useCallback(async (status: LogStatus) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (status !== 'all') params.set('status', status)
      const res = await fetch(`/api/admin/notifications/logs?${params}`)
      const json = await res.json()
      if (res.ok) setLogs(json.data ?? [])
      else toast.error(json.error ?? 'Failed to fetch logs')
    } catch {
      toast.error('Network error fetching logs')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleFilter = (s: LogStatus) => {
    setStatusFilter(s)
    fetchLogs(s)
  }

  const statuses: { value: LogStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'sent', label: 'Sent' },
    { value: 'failed', label: 'Failed' },
    { value: 'bounced', label: 'Bounced' },
    { value: 'opened', label: 'Opened' },
  ]

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">Filter:</span>
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => handleFilter(s.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              statusFilter === s.value
                ? 'bg-[#E53935] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s.label}
          </button>
        ))}
        <Button
          size="sm"
          variant="outline"
          className="ml-auto"
          onClick={() => fetchLogs(statusFilter)}
          disabled={loading}
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-0">
          <thead className="border-b bg-gray-50/60">
            <tr>
              {['Template', 'Recipient', 'Subject', 'Status', 'Resend ID', 'Sent At'].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                  {loading ? 'Loading…' : 'No logs found'}
                </td>
              </tr>
            )}
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-gray-700">{log.template_key}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 max-w-[180px] truncate">
                  {log.recipient_email}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 max-w-[200px] truncate">
                  {log.subject}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={log.status} />
                  {log.error && (
                    <p className="text-xs text-red-500 mt-0.5 max-w-[150px] truncate" title={log.error}>
                      {log.error}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  {log.resend_id ? (
                    <span className="font-mono text-xs text-gray-400" title={log.resend_id}>
                      {log.resend_id.slice(0, 12)}…
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                  {new Date(log.sent_at).toLocaleString('en-US', {
                    month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Templates Tab ────────────────────────────────────────────────────────────

interface TemplatesTabProps {
  templates: EmailTemplate[]
  setTemplates: React.Dispatch<React.SetStateAction<EmailTemplate[]>>
}

function TemplatesTab({ templates, setTemplates }: TemplatesTabProps) {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<EmailTemplate | null>(null)
  const [previewing, setPreviewing] = useState<EmailTemplate | null>(null)
  const [deleting, setDeleting] = useState<EmailTemplate | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleSaved = useCallback((t: EmailTemplate) => {
    setTemplates((prev) => prev.map((x) => (x.id === t.id ? t : x)))
  }, [setTemplates])

  const handleCreated = useCallback((t: EmailTemplate) => {
    setTemplates((prev) => [t, ...prev])
  }, [setTemplates])

  const handleDelete = useCallback(async () => {
    if (!deleting) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/admin/notifications/${deleting.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Delete failed')
      setTemplates((prev) => prev.filter((t) => t.id !== deleting.id))
      toast.success('Template deleted')
      setDeleting(null)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setDeleteLoading(false)
    }
  }, [deleting, setTemplates])

  const openAdd = () => { setEditing(null); setShowModal(true) }
  const openEdit = (t: EmailTemplate) => { setEditing(t); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditing(null) }

  return (
    <div className="space-y-4">
      {/* Add button */}
      <div className="flex justify-end">
        <Button className="bg-[#E53935] hover:bg-[#C62828] text-white" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Template
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-0">
          <thead className="border-b bg-gray-50/60">
            <tr>
              {['Key', 'Name', 'Subject', 'Variables', 'Active', 'Updated', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {templates.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                  No email templates yet. Click "Add Template" to create one.
                </td>
              </tr>
            )}
            {templates.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/70 transition-colors group">
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                    {t.key}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-[#0A0F1C]">{t.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
                  {t.subject}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {(t.variables ?? []).length}
                </td>
                <td className="px-4 py-3">
                  {t.active ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                  {new Date(t.updated_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewing(t)}
                      title="Preview HTML"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(t)}>
                      <Edit2 className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setDeleting(t)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showModal && (
        <TemplateModal
          editing={editing}
          onClose={closeModal}
          onSaved={handleSaved}
          onCreated={handleCreated}
        />
      )}
      {previewing && (
        <PreviewModal template={previewing} onClose={() => setPreviewing(null)} />
      )}
      {deleting && (
        <ConfirmDialog
          name={deleting.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  )
}

// ─── Main Client Component ────────────────────────────────────────────────────

interface Props {
  initialTemplates: EmailTemplate[]
  initialLogs: NotificationLog[]
}

export function NotificationsManagerClient({ initialTemplates, initialLogs }: Props) {
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates)

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E53935]/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#E53935]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0A0F1C]">Notifications & Email Templates</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage email templates and send transactional emails via Resend
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="templates">
          <TabsList className="bg-white border border-gray-200 rounded-xl p-1">
            <TabsTrigger value="templates" className="rounded-lg px-4">
              <Mail className="w-4 h-4 mr-2" />
              Templates
              {templates.length > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 text-xs rounded-full px-1.5 py-0.5">
                  {templates.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="send" className="rounded-lg px-4">
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </TabsTrigger>
            <TabsTrigger value="logs" className="rounded-lg px-4">
              <Bell className="w-4 h-4 mr-2" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="mt-4">
            <TemplatesTab templates={templates} setTemplates={setTemplates} />
          </TabsContent>

          <TabsContent value="send" className="mt-4">
            <Card variant="light">
              <CardHeader>
                <CardTitle className="text-base">Send Test / Manual Email</CardTitle>
              </CardHeader>
              <CardContent>
                <SendEmailTab templates={templates} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="mt-4">
            <LogsTab initialLogs={initialLogs} />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}
