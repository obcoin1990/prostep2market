'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import { Search, X, Edit2, CheckCircle, Clock, ChevronUp, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import type { TraderProfile } from './page'
import { BehavioralFlagsCard } from '@/components/risk-guardian/BehavioralFlagsCard'

// ── Types ────────────────────────────────────────────────────────────────────

interface EditForm {
  profile_type: string
  risk_personality_score: number
  emotional_stability_score: number
  decision_making_score: number
  trading_behavior_score: number
  learning_style_score: number
  learning_path: string
  admin_role: string
}

// ── Constants ────────────────────────────────────────────────────────────────

// DB constraint: profile_type IN ('sniper','analyst','warrior','disciplinarian','opportunist')
const PROFILE_TYPES = [
  'sniper', 'analyst', 'warrior', 'disciplinarian', 'opportunist',
]

const LEARNING_PATHS = [
  'beginner', 'intermediate', 'advanced', 'expert',
  'technical_analysis', 'fundamental_analysis', 'risk_management', 'psychology',
]

// DB constraint: admin_role IN ('user','super_admin') only
const ADMIN_ROLES = ['', 'super_admin']

const SCORE_FIELDS: { key: keyof EditForm; label: string; color: string }[] = [
  { key: 'risk_personality_score', label: 'Risk', color: '#E53935' },
  { key: 'emotional_stability_score', label: 'Emotional', color: '#7C3AED' },
  { key: 'decision_making_score', label: 'Decision', color: '#0284C7' },
  { key: 'trading_behavior_score', label: 'Behavior', color: '#059669' },
  { key: 'learning_style_score', label: 'Learning', color: '#D97706' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function ScoreBar({ value, color }: { value: number | null; color: string }) {
  const pct = Math.min(100, Math.max(0, value ?? 0))
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-gray-500 w-6 text-right">{value ?? '—'}</span>
    </div>
  )
}

function profileTypeBadgeVariant(
  type: string | null
): 'default' | 'success' | 'warning' | 'outline' {
  if (!type) return 'outline'
  if (['analyst', 'disciplinarian'].includes(type)) return 'success'
  if (['warrior', 'sniper'].includes(type)) return 'warning'
  return 'default'
}

function buildDefaultForm(p: TraderProfile): EditForm {
  return {
    profile_type: p.profile_type ?? '',
    risk_personality_score: p.risk_personality_score ?? 50,
    emotional_stability_score: p.emotional_stability_score ?? 50,
    decision_making_score: p.decision_making_score ?? 50,
    trading_behavior_score: p.trading_behavior_score ?? 50,
    learning_style_score: p.learning_style_score ?? 50,
    learning_path: p.learning_path ?? '',
    admin_role: p.admin_role ?? '',
  }
}

// ── Edit Modal ────────────────────────────────────────────────────────────────

interface EditModalProps {
  profile: TraderProfile
  onClose: () => void
  onSaved: (updated: Partial<TraderProfile> & { id: string }) => void
}

function EditModal({ profile, onClose, onSaved }: EditModalProps) {
  const [form, setForm] = useState<EditForm>(buildDefaultForm(profile))
  const [saving, setSaving] = useState(false)

  const setScore = (key: keyof EditForm, raw: string) => {
    const n = parseInt(raw, 10)
    if (isNaN(n)) return
    const clamped = Math.min(100, Math.max(0, n))
    setForm((f) => ({ ...f, [key]: clamped }))
  }

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/trader-dna/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Update failed')
      toast.success('Trader DNA profile updated')
      onSaved({ id: profile.id, ...form })
      onClose()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }, [form, profile.id, onClose, onSaved])

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-lg font-bold text-[#0A0F1C]">Edit Trader DNA</h2>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">{profile.email ?? profile.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Profile Type */}
          <div>
            <label htmlFor="profile-type" className="block text-sm font-medium text-gray-700 mb-1.5">Profile Type</label>
            <select
              id="profile-type"
              value={form.profile_type}
              onChange={(e) => setForm((f) => ({ ...f, profile_type: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/60 focus:border-[#E53935]"
            >
              <option value="">— unset —</option>
              {PROFILE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Score sliders */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Scores (0–100)</h3>
            {SCORE_FIELDS.map(({ key, label, color }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-gray-700">{label}</label>
                  <span
                    className="text-xs font-mono font-bold px-1.5 py-0.5 rounded"
                    style={{ color, backgroundColor: `${color}15` }}
                  >
                    {form[key] as number}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={form[key] as number}
                  onChange={(e) => setScore(key, e.target.value)}
                  aria-label="Score"
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: color }}
                />
                <div className="flex gap-2 mt-1.5">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form[key] as number}
                    onChange={(e) => setScore(key, e.target.value)}
                    aria-label="Score value"
                    className="w-20 border border-gray-200 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#E53935]/60"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Learning Path */}
          <div>
            <label htmlFor="learning-path" className="block text-sm font-medium text-gray-700 mb-1.5">Learning Path</label>
            <select
              id="learning-path"
              value={form.learning_path}
              onChange={(e) => setForm((f) => ({ ...f, learning_path: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/60 focus:border-[#E53935]"
            >
              <option value="">— unset —</option>
              {LEARNING_PATHS.map((lp) => (
                <option key={lp} value={lp}>{lp}</option>
              ))}
            </select>
          </div>

          {/* Admin Role */}
          <div>
            <label htmlFor="admin-role" className="block text-sm font-medium text-gray-700 mb-1.5">Admin Role</label>
            <select
              id="admin-role"
              value={form.admin_role}
              onChange={(e) => setForm((f) => ({ ...f, admin_role: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/60 focus:border-[#E53935]"
            >
              {ADMIN_ROLES.map((r) => (
                <option key={r} value={r}>{r || '— none —'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Behavioral Flags */}
        <div className="px-5 pb-2">
          <BehavioralFlagsCard userId={profile.id} isAdmin showAll />
        </div>

        <div className="flex gap-3 p-5 border-t">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#E53935] hover:bg-[#C62828] text-white"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Main Client Component ─────────────────────────────────────────────────────

interface Props {
  profiles: TraderProfile[]
}

// completed_at does not exist in trader_profiles — use profile_type presence as proxy
type SortKey = 'email' | 'profile_type' | 'created_at' | 'risk_personality_score'

export function TraderDNAClient({ profiles: initialProfiles }: Props) {
  const [profiles, setProfiles] = useState<TraderProfile[]>(initialProfiles)
  const [search, setSearch] = useState('')
  const [editingProfile, setEditingProfile] = useState<TraderProfile | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('email')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let result = q
      ? profiles.filter(
          (p) =>
            p.id.toLowerCase().includes(q) ||
            (p.email ?? '').toLowerCase().includes(q) ||
            (p.profile_type ?? '').toLowerCase().includes(q)
        )
      : [...profiles]

    result.sort((a, b) => {
      let av: string | number = ''
      let bv: string | number = ''
      if (sortKey === 'email') { av = a.email ?? a.id; bv = b.email ?? b.id }
      else if (sortKey === 'profile_type') { av = a.profile_type ?? ''; bv = b.profile_type ?? '' }
      else if (sortKey === 'created_at') { av = a.created_at ?? ''; bv = b.created_at ?? '' }
      else if (sortKey === 'risk_personality_score') { av = a.risk_personality_score ?? 0; bv = b.risk_personality_score ?? 0 }

      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [profiles, search, sortKey, sortDir])

  const handleSaved = useCallback(
    (updated: Partial<TraderProfile> & { id: string }) => {
      setProfiles((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      )
    },
    []
  )

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return null
    return sortDir === 'asc' ? (
      <ChevronUp className="inline w-3 h-3 ml-0.5" />
    ) : (
      <ChevronDown className="inline w-3 h-3 ml-0.5" />
    )
  }

  const thCls = 'text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-800 select-none'

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0A0F1C]">Trader DNA Editor</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {profiles.length} profiles · {profiles.filter((p) => p.profile_type).length} with DNA complete
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by ID or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <Card variant="light">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-0">
              <thead className="border-b bg-gray-50/60">
                <tr>
                  <th className={thCls} onClick={() => handleSort('email')}>
                    User <SortIcon k="email" />
                  </th>
                  <th className={thCls} onClick={() => handleSort('profile_type')}>
                    Type <SortIcon k="profile_type" />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
                    Scores
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">
                    Learning Path
                  </th>
                  <th className={thCls} onClick={() => handleSort('created_at')}>
                    Joined <SortIcon k="created_at" />
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                      No profiles found
                    </td>
                  </tr>
                )}
                {filtered.map((profile) => (
                  <tr
                    key={profile.id}
                    className="hover:bg-gray-50/70 transition-colors group"
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-[#0A0F1C] truncate max-w-[180px]">
                        {profile.email ?? '—'}
                      </div>
                      <div className="text-xs text-gray-400 font-mono truncate max-w-[180px]">
                        {profile.id}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">
                      {profile.profile_type ? (
                        <Badge variant={profileTypeBadgeVariant(profile.profile_type)}>
                          {profile.profile_type}
                        </Badge>
                      ) : (
                        <span className="text-xs text-gray-400">unset</span>
                      )}
                    </td>

                    {/* Scores */}
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {SCORE_FIELDS.map(({ key, label, color }) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 w-16">{label}</span>
                            <ScoreBar value={profile[key as keyof TraderProfile] as number | null} color={color} />
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Learning Path */}
                    <td className="px-4 py-3">
                      {profile.learning_path ? (
                        <Badge variant="outline">{profile.learning_path}</Badge>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                    {/* Joined / Status */}
                    <td className="px-4 py-3">
                      {profile.profile_type ? (
                        <div className="flex items-center gap-1 text-[#2E7D32]">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">DNA Complete</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs">In Progress</span>
                        </div>
                      )}
                    </td>

                    {/* Edit */}
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setEditingProfile(profile)}
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      {editingProfile && (
        <EditModal
          profile={editingProfile}
          onClose={() => setEditingProfile(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
