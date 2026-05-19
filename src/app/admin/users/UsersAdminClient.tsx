'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreateUserForm } from '@/components/admin/CreateUserForm'
import type { TraderProfileRow } from './page'
import {
  Users,
  Shield,
  Search,
  X,
  ChevronDown,
  Loader,
  Pencil,
  Trash2,
  UserCog,
  AlertTriangle,
  PlusCircle,
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const PROFILE_TYPES = ['sniper', 'analyst', 'warrior', 'disciplinarian', 'opportunist'] as const
type ProfileType = typeof PROFILE_TYPES[number]

const ADMIN_ROLES = ['', 'super_admin'] as const
type AdminRole = typeof ADMIN_ROLES[number]

const PROFILE_BADGE: Record<string, string> = {
  sniper: 'bg-[#E53935]/10 text-[#E53935] border-[#E53935]/30',
  analyst: 'bg-[#00B4D8]/10 text-[#00B4D8] border-[#00B4D8]/30',
  warrior: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  disciplinarian: 'bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/30',
  opportunist: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ value, color }: { value: number | null; color: string }) {
  const pct = Math.min(100, Math.max(0, value ?? 0))
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-gray-400 w-7 text-right">{pct}</span>
    </div>
  )
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

interface EditModalProps {
  user: TraderProfileRow
  onClose: () => void
  onSaved: (updated: Partial<TraderProfileRow>) => void
}

function EditModal({ user, onClose, onSaved }: EditModalProps) {
  const [profileType, setProfileType] = useState<string>(user.profile_type ?? 'analyst')
  const [adminRole, setAdminRole] = useState<string>(user.admin_role ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_type: profileType,
          admin_role: adminRole || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Failed to update user')
        return
      }
      onSaved({ profile_type: profileType, admin_role: adminRole || null })
      onClose()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <UserCog className="w-4 h-4 text-[#E53935]" />
            <h2 className="font-semibold text-[#0A0F1C]">Edit User</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">User ID</p>
            <code className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{user.id}</code>
          </div>
          {user.email && (
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Email</p>
              <p className="text-sm text-[#0A0F1C] font-medium">{user.email}</p>
            </div>
          )}

          {/* Profile Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Profile Type</label>
            <div className="relative">
              <select
                value={profileType}
                onChange={(e) => setProfileType(e.target.value)}
                className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/40 focus:border-[#E53935] pr-8"
              >
                {PROFILE_TYPES.map((t) => (
                  <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Admin Role */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Admin Role</label>
            <div className="relative">
              <select
                value={adminRole}
                onChange={(e) => setAdminRole(e.target.value)}
                className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/40 focus:border-[#E53935] pr-8"
              >
                <option value="">— None —</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="gap-2 bg-[#E53935] hover:bg-[#E53935]/90 text-white"
          >
            {saving && <Loader className="w-3.5 h-3.5 animate-spin" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────

interface DeleteDialogProps {
  user: TraderProfileRow
  onClose: () => void
  onDeleted: (id: string) => void
}

function DeleteDialog({ user, onClose, onDeleted }: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Failed to delete user')
        return
      }
      onDeleted(user.id)
      onClose()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200">
        <div className="px-6 py-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-4 h-4 text-[#E53935]" />
            </div>
            <div>
              <h2 className="font-semibold text-[#0A0F1C] text-sm">Delete User</h2>
              <p className="text-xs text-gray-400">This action cannot be undone</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Are you sure you want to permanently delete{' '}
            <span className="font-semibold text-[#0A0F1C]">{user.email || user.id.slice(0, 8) + '…'}</span>?
            Their account and all associated data will be removed.
          </p>
          {error && (
            <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-gray-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-2 bg-[#E53935] hover:bg-[#E53935]/90 text-white"
          >
            {deleting && <Loader className="w-3.5 h-3.5 animate-spin" />}
            {deleting ? 'Deleting…' : 'Delete User'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function UsersAdminClient({ initialUsers }: { initialUsers: TraderProfileRow[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [users, setUsers] = useState<TraderProfileRow[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState<TraderProfileRow | null>(null)
  const [deletingUser, setDeletingUser] = useState<TraderProfileRow | null>(null)

  // ── Derived stats ──
  const stats = useMemo(() => {
    const total = users.length
    const admins = users.filter((u) => u.admin_role === 'super_admin').length
    const typeCounts: Record<string, number> = {}
    for (const u of users) {
      const t = u.profile_type ?? 'unknown'
      typeCounts[t] = (typeCounts[t] ?? 0) + 1
    }
    return { total, admins, typeCounts }
  }, [users])

  // ── Filtered users ──
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        u.id.toLowerCase().includes(q) ||
        (u.email ?? '').toLowerCase().includes(q) ||
        (u.profile_type ?? '').toLowerCase().includes(q) ||
        (u.admin_role ?? '').toLowerCase().includes(q)
    )
  }, [users, search])

  // ── Handlers ──
  const handleUserCreated = () => {
    setShowCreateForm(false)
    startTransition(() => router.refresh())
  }

  const handleUserEdited = (id: string, updates: Partial<TraderProfileRow>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)))
  }

  const handleUserDeleted = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <>
      {/* ── Edit Modal ── */}
      {editingUser && (
        <EditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={(updates) => {
            handleUserEdited(editingUser.id, updates)
            setEditingUser(null)
          }}
        />
      )}

      {/* ── Delete Dialog ── */}
      {deletingUser && (
        <DeleteDialog
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onDeleted={handleUserDeleted}
        />
      )}

      <div className="space-y-6">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0A0F1C]">User Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">View, edit, and manage all trader accounts</p>
          </div>
          <Button
            onClick={() => setShowCreateForm((v) => !v)}
            className="gap-2 bg-[#E53935] hover:bg-[#E53935]/90 text-white self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            {showCreateForm ? 'Cancel' : 'Create User'}
          </Button>
        </div>

        {/* ── Create Form (toggle) ── */}
        {showCreateForm && (
          <div className="max-w-lg">
            <CreateUserForm onSuccess={handleUserCreated} />
          </div>
        )}

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-[#00B4D8]" />
                <span className="text-xs text-gray-500 font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold text-[#0A0F1C]">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-[#E53935]" />
                <span className="text-xs text-gray-500 font-medium">Admins</span>
              </div>
              <p className="text-2xl font-bold text-[#0A0F1C]">{stats.admins}</p>
            </CardContent>
          </Card>
          {PROFILE_TYPES.map((pt) => (
            <Card key={pt} className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      pt === 'sniper' ? 'bg-[#E53935]' :
                      pt === 'analyst' ? 'bg-[#00B4D8]' :
                      pt === 'warrior' ? 'bg-orange-400' :
                      pt === 'disciplinarian' ? 'bg-[#2E7D32]' :
                      'bg-purple-400'
                    }`}
                  />
                  <span className="text-xs text-gray-500 font-medium capitalize">{pt}</span>
                </div>
                <p className="text-2xl font-bold text-[#0A0F1C]">{stats.typeCounts[pt] ?? 0}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Search / Filter ── */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, ID, or type…"
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935]/30 focus:border-[#E53935]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ── Users Table ── */}
        <Card className="border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="pb-2 border-b border-gray-100">
            <CardTitle className="text-base font-semibold text-[#0A0F1C] flex items-center justify-between">
              <span>All Users</span>
              <span className="text-xs font-normal text-gray-400">
                {filtered.length} of {users.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Email / ID
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Profile Type
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Admin Role
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[120px]">
                      Risk Score
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[120px]">
                      Stability
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Joined
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">
                        {search ? 'No users match your search.' : 'No users found.'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((user) => {
                      const profileBadge =
                        PROFILE_BADGE[user.profile_type ?? ''] ??
                        'bg-gray-100 text-gray-500 border-gray-200'
                      const joined = new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })

                      return (
                        <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                          {/* Email / ID */}
                          <td className="px-4 py-3">
                            {user.email ? (
                              <div>
                                <p className="font-medium text-[#0A0F1C] text-xs truncate max-w-[180px]">
                                  {user.email}
                                </p>
                                <code className="text-[10px] font-mono text-gray-400">
                                  {user.id.slice(0, 8)}…
                                </code>
                              </div>
                            ) : (
                              <code className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {user.id.slice(0, 12)}…
                              </code>
                            )}
                          </td>

                          {/* Profile Type */}
                          <td className="px-4 py-3">
                            {user.profile_type ? (
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${profileBadge}`}
                              >
                                {user.profile_type}
                              </span>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>

                          {/* Admin Role */}
                          <td className="px-4 py-3">
                            {user.admin_role === 'super_admin' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-[#E53935]/10 text-[#E53935] border-[#E53935]/30">
                                <Shield className="w-2.5 h-2.5" /> Super Admin
                              </span>
                            ) : (
                              <span className="text-gray-300 text-xs">Trader</span>
                            )}
                          </td>

                          {/* Risk Score */}
                          <td className="px-4 py-3">
                            <ProgressBar
                              value={user.risk_personality_score}
                              color="bg-[#E53935]"
                            />
                          </td>

                          {/* Stability Score */}
                          <td className="px-4 py-3">
                            <ProgressBar
                              value={user.emotional_stability_score}
                              color="bg-[#2E7D32]"
                            />
                          </td>

                          {/* Joined */}
                          <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                            {joined}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-[#0A0F1C] hover:bg-gray-100 transition-all"
                                title="Edit user"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingUser(user)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-[#E53935] hover:bg-red-50 transition-all"
                                title="Delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
