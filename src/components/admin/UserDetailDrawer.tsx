'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  X,
  User,
  Dna,
  ShieldAlert,
  FlaskConical,
  Award,
  CreditCard,
  Loader,
  KeyRound,
  Save,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrgOption {
  id: string
  name: string
}

interface FullUserData {
  authUser: {
    id: string
    email: string | null
    createdAt: string
    lastSignInAt: string | null
    emailConfirmedAt: string | null
    bannedUntil: string | null
  }
  prismaUser: {
    id: string
    name: string | null
    email: string
    role: string
    avatarUrl: string | null
    organizationId: string | null
    organization: {
      id: string
      name: string
      plan: string
      subscription: Record<string, unknown> | null
    } | null
    createdAt: string
    updatedAt: string
  } | null
  traderProfile: Record<string, unknown> | null
  alerts: { total: number; unacknowledged: number; recent: Record<string, unknown>[] }
  trades: { total: number; recent: Record<string, unknown>[] }
  strategies: { total: number; recent: Record<string, unknown>[] }
  certificates: { id: string; courseId: string; title: string; issueDate: string; verificationToken: string }[]
  enrollments: {
    id: string
    courseId: string
    courseTitle: string
    courseLevel: string
    status: string
    progress: number
    enrolledAt: string
    completedAt: string | null
  }[]
}

interface UserDetailDrawerProps {
  userId: string
  userEmail: string
  onClose: () => void
  organizations: OrgOption[]
  onRoleChanged: (userId: string, newRole: string) => void
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'profile',      label: 'Profile',      Icon: User        },
  { id: 'dna',         label: 'Trader DNA',   Icon: Dna         },
  { id: 'risk',        label: 'Risk Guardian', Icon: ShieldAlert },
  { id: 'strategies',  label: 'Strategy Lab', Icon: FlaskConical },
  { id: 'certs',       label: 'Certificates', Icon: Award       },
  { id: 'subs',        label: 'Subscription', Icon: CreditCard  },
] as const
type TabId = typeof TABS[number]['id']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function ScoreBar({ label, value }: { label: string; value: number | null | undefined }) {
  const pct = Math.min(100, Math.max(0, value ?? 0))
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-semibold text-[#0A0F1C]">{pct}</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-[#E53935]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
      <div className="text-sm text-[#0A0F1C]">{children}</div>
    </div>
  )
}

function SaveButton({ saving, onClick, label = 'Save' }: { saving: boolean; onClick: () => void; label?: string }) {
  return (
    <Button
      size="sm"
      onClick={onClick}
      disabled={saving}
      className="gap-1.5 bg-[#E53935] hover:bg-[#E53935]/90 text-white"
    >
      {saving ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
      {saving ? 'Saving…' : label}
    </Button>
  )
}

// ─── ProfileTab ───────────────────────────────────────────────────────────────

function ProfileTab({
  data,
  organizations,
  onUpdated,
}: {
  data: FullUserData
  organizations: OrgOption[]
  onUpdated: (patch: Partial<FullUserData>) => void
}) {
  const u = data.prismaUser
  const auth = data.authUser

  // Editable state
  const [name,   setName]   = useState(u?.name   ?? '')
  const [email,  setEmail]  = useState(u?.email  ?? auth.email ?? '')
  const [role,   setRole]   = useState(u?.role   ?? 'LEARNER')
  const [orgId,  setOrgId]  = useState(u?.organizationId ?? '')

  const [savingProfile,  setSavingProfile]  = useState(false)
  const [savingEmail,    setSavingEmail]    = useState(false)
  const [savingRole,     setSavingRole]     = useState(false)
  const [sendingReset,   setSendingReset]   = useState(false)

  const patch = async (url: string, body: object) => {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? 'Request failed')
    return json
  }

  const saveProfile = async () => {
    setSavingProfile(true)
    try {
      await patch(`/api/admin/users/${auth.id}/profile`, {
        name: name.trim() || null,
        organizationId: orgId || null,
      })
      toast.success('Profile updated')
      onUpdated({})
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSavingProfile(false)
    }
  }

  const saveEmail = async () => {
    setSavingEmail(true)
    try {
      await patch(`/api/admin/users/${auth.id}/email`, { email })
      toast.success('Email updated')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSavingEmail(false)
    }
  }

  const saveRole = async () => {
    setSavingRole(true)
    try {
      await patch(`/api/admin/users/${auth.id}/role`, { role })
      toast.success('Role updated')
      onUpdated({})
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSavingRole(false)
    }
  }

  const sendReset = async () => {
    setSendingReset(true)
    try {
      await patch(`/api/admin/users/${auth.id}/password`, {})
      toast.success('Password reset email sent')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSendingReset(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Identity section */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="User ID">
          <code className="text-[11px] font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded break-all">
            {auth.id}
          </code>
        </Field>
        <Field label="Account Status">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
              auth.bannedUntil
                ? 'bg-red-50 text-red-600 border-red-200'
                : auth.emailConfirmedAt
                ? 'bg-green-50 text-[#2E7D32] border-green-200'
                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
            }`}
          >
            {auth.bannedUntil ? 'Banned' : auth.emailConfirmedAt ? 'Verified' : 'Unverified'}
          </span>
        </Field>
        <Field label="Joined">{fmtDate(auth.createdAt)}</Field>
        <Field label="Last Sign-in">{fmtDate(auth.lastSignInAt)}</Field>
      </div>

      <hr className="border-gray-100" />

      {/* Name + Org */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Display Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935]/30 focus:border-[#E53935]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Organization</label>
            <div className="relative">
              <select
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
                className="w-full appearance-none px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935]/30 focus:border-[#E53935]"
              >
                <option value="">— No organization —</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <SaveButton saving={savingProfile} onClick={saveProfile} label="Save Profile" />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Email */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email Address</h3>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935]/30 focus:border-[#E53935]"
          />
          <SaveButton saving={savingEmail} onClick={saveEmail} label="Update Email" />
        </div>
        <p className="text-[11px] text-gray-400">Changes take effect immediately — no confirmation required.</p>
      </div>

      <hr className="border-gray-100" />

      {/* Role */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Platform Role</h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full appearance-none px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935]/30 focus:border-[#E53935]"
            >
              <option value="LEARNER">Learner</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          <SaveButton saving={savingRole} onClick={saveRole} label="Update Role" />
        </div>
        {role === 'SUPER_ADMIN' && (
          <div className="flex items-center gap-2 p-2.5 bg-[#E53935]/5 border border-[#E53935]/20 rounded-lg">
            <Shield className="w-3.5 h-3.5 text-[#E53935] flex-shrink-0" />
            <p className="text-xs text-[#E53935]">
              This user will gain full admin access. Trader DNA and admin_role will also be updated.
            </p>
          </div>
        )}
      </div>

      <hr className="border-gray-100" />

      {/* Password reset */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Password Reset</h3>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-[#0A0F1C]">Send reset email</p>
            <p className="text-xs text-gray-400">A password reset link will be sent to {email || auth.email}.</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={sendReset}
            disabled={sendingReset}
            className="gap-1.5 flex-shrink-0"
          >
            {sendingReset ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
            {sendingReset ? 'Sending…' : 'Send Reset'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── TraderDNATab ─────────────────────────────────────────────────────────────

function TraderDNATab({ profile }: { profile: Record<string, unknown> | null }) {
  if (!profile) {
    return (
      <div className="p-6 text-center text-gray-400 text-sm">
        <Dna className="w-10 h-10 mx-auto mb-2 text-gray-200" />
        No Trader DNA profile found.
      </div>
    )
  }

  const profileTypeColors: Record<string, string> = {
    sniper: 'text-[#E53935]',
    analyst: 'text-[#00B4D8]',
    warrior: 'text-orange-400',
    disciplinarian: 'text-[#2E7D32]',
    opportunist: 'text-purple-400',
  }

  const profileType = profile.profile_type as string | null
  const typeColor = profileType ? (profileTypeColors[profileType] ?? 'text-gray-600') : 'text-gray-400'

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Dna className="w-5 h-5 text-[#E53935]" />
        <div>
          <p className="text-xs text-gray-400">Profile Type</p>
          <p className={`text-base font-bold capitalize ${typeColor}`}>
            {profileType ?? '—'}
          </p>
        </div>
        {profile.admin_role === 'super_admin' && (
          <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/30">
            <Shield className="w-2.5 h-2.5" /> Super Admin
          </span>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Psychological Scores</h3>
        <ScoreBar label="Risk Personality" value={profile.risk_personality_score as number} />
        <ScoreBar label="Emotional Stability" value={profile.emotional_stability_score as number} />
        <ScoreBar label="Decision Making" value={profile.decision_making_score as number} />
        <ScoreBar label="Trading Behavior" value={profile.trading_behavior_score as number} />
        <ScoreBar label="Learning Style" value={profile.learning_style_score as number} />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <Field label="Learning Path">
          <span className="text-xs capitalize">{String(profile.learning_path ?? '—')}</span>
        </Field>
        <Field label="Dashboard Layout">
          <span className="text-xs capitalize">{String(profile.dashboard_layout ?? 'default')}</span>
        </Field>
        <Field label="Profile Updated">
          <span className="text-xs">{fmtDate(profile.updated_at as string)}</span>
        </Field>
        <Field label="Profile Created">
          <span className="text-xs">{fmtDate(profile.created_at as string)}</span>
        </Field>
      </div>
    </div>
  )
}

// ─── RiskGuardianTab ──────────────────────────────────────────────────────────

const SEVERITY_STYLE: Record<string, string> = {
  critical: 'bg-red-50 text-red-600 border-red-200',
  warning:  'bg-yellow-50 text-yellow-700 border-yellow-200',
  info:     'bg-blue-50 text-[#00B4D8] border-blue-200',
}

function RiskGuardianTab({ alerts }: { alerts: FullUserData['alerts'] }) {
  return (
    <div className="p-6 space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Alerts',     value: alerts.total,          color: 'text-[#0A0F1C]' },
          { label: 'Unacknowledged',   value: alerts.unacknowledged, color: 'text-[#E53935]' },
          { label: 'Acknowledged',     value: alerts.total - alerts.unacknowledged, color: 'text-[#2E7D32]' },
        ].map((s) => (
          <div key={s.label} className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent alerts */}
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Recent Alerts</h3>
      {alerts.recent.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-4">No alerts recorded.</p>
      ) : (
        <div className="space-y-2">
          {alerts.recent.map((a) => {
            const severity = String(a.severity ?? 'info')
            const badgeClass = SEVERITY_STYLE[severity] ?? SEVERITY_STYLE.info
            const acknowledged = Boolean(a.acknowledged)
            return (
              <div
                key={String(a.id)}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <span className={`flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${badgeClass}`}>
                  {severity}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#0A0F1C]">{String(a.title ?? '')}</p>
                  <p className="text-[11px] text-gray-500 truncate">{String(a.message ?? '')}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{fmtDate(String(a.triggered_at ?? ''))}</p>
                </div>
                {acknowledged && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] flex-shrink-0 mt-0.5" />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── StrategyLabTab ───────────────────────────────────────────────────────────

function StrategyLabTab({ strategies }: { strategies: FullUserData['strategies'] }) {
  const resultIcon = (result: unknown) => {
    if (result === 'win')   return <TrendingUp className="w-3.5 h-3.5 text-[#2E7D32]" />
    if (result === 'loss')  return <TrendingDown className="w-3.5 h-3.5 text-[#E53935]" />
    return <Minus className="w-3.5 h-3.5 text-gray-400" />
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Saved Strategies</h3>
        <span className="text-xs text-gray-400">{strategies.total} total</span>
      </div>

      {strategies.recent.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-4">No strategies saved yet.</p>
      ) : (
        <div className="space-y-2">
          {strategies.recent.map((s) => (
            <div
              key={String(s.id)}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <FlaskConical className="w-4 h-4 text-[#E53935] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#0A0F1C] truncate">{String(s.name ?? '—')}</p>
                {Boolean(s.description) && (
                  <p className="text-[11px] text-gray-400 truncate">{String(s.description)}</p>
                )}
              </div>
              <span className="text-[10px] text-gray-400 flex-shrink-0">{fmtDate(String(s.created_at ?? ''))}</span>
            </div>
          ))}
          {strategies.total > 5 && (
            <p className="text-center text-[11px] text-gray-400 pt-1">
              Showing 5 of {strategies.total} strategies.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── CertificatesTab ──────────────────────────────────────────────────────────

function CertificatesTab({
  certificates,
  enrollments,
}: {
  certificates: FullUserData['certificates']
  enrollments: FullUserData['enrollments']
}) {
  const STATUS_COLOR: Record<string, string> = {
    ACTIVE:    'text-[#00B4D8]',
    COMPLETED: 'text-[#2E7D32]',
    DROPPED:   'text-gray-400',
    OVERDUE:   'text-[#E53935]',
  }

  return (
    <div className="p-6 space-y-6">
      {/* Certificates */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Certificates Earned ({certificates.length})
        </h3>
        {certificates.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-3">No certificates yet.</p>
        ) : (
          <div className="space-y-2">
            {certificates.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-yellow-50/50">
                <Award className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#0A0F1C] truncate">{c.title}</p>
                  <p className="text-[10px] text-gray-400">{fmtDate(c.issueDate)}</p>
                </div>
                <a
                  href={`/api/certificates/${c.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#E53935] hover:underline flex-shrink-0"
                >
                  PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enrollments */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Course Enrollments ({enrollments.length})
        </h3>
        {enrollments.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-3">Not enrolled in any courses.</p>
        ) : (
          <div className="space-y-2">
            {enrollments.map((e) => (
              <div key={e.id} className="p-3 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-[#0A0F1C] truncate flex-1 mr-2">{e.courseTitle}</p>
                  <span className={`text-[10px] font-semibold capitalize ${STATUS_COLOR[e.status] ?? 'text-gray-400'}`}>
                    {e.status.toLowerCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E53935] rounded-full"
                      style={{ width: `${e.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 w-6 text-right">{e.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── SubscriptionTab ──────────────────────────────────────────────────────────

function SubscriptionTab({ data }: { data: FullUserData }) {
  const org = data.prismaUser?.organization ?? null
  const sub = org?.subscription ?? null

  if (!org) {
    return (
      <div className="p-6 text-center text-gray-400 text-sm">
        <CreditCard className="w-10 h-10 mx-auto mb-2 text-gray-200" />
        This user is not assigned to an organization.
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
        <Field label="Organization">{org.name}</Field>
        <Field label="Plan">
          <span className="font-semibold capitalize">{org.plan.toLowerCase()}</span>
        </Field>
        {sub ? (
          <>
            <Field label="Subscription Status">
              <span className={`font-semibold capitalize ${
                String((sub as any).status) === 'ACTIVE' ? 'text-[#2E7D32]' : 'text-[#E53935]'
              }`}>
                {String((sub as any).status ?? '—').toLowerCase()}
              </span>
            </Field>
            <Field label="Current Period Start">{fmtDate(String((sub as any).currentPeriodStart ?? ''))}</Field>
            <Field label="Current Period End">{fmtDate(String((sub as any).currentPeriodEnd ?? ''))}</Field>
            {(sub as any).cancelAt && (
              <Field label="Cancels On">
                <span className="text-[#E53935]">{fmtDate(String((sub as any).cancelAt))}</span>
              </Field>
            )}
          </>
        ) : (
          <p className="text-xs text-gray-400">No subscription record found for this organization.</p>
        )}
      </div>
    </div>
  )
}

// ─── Main Drawer ──────────────────────────────────────────────────────────────

export function UserDetailDrawer({
  userId,
  userEmail,
  onClose,
  organizations,
  onRoleChanged,
}: UserDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabId>('profile')
  const [data, setData]           = useState<FullUserData | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  const fetchFull = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/users/${userId}/full`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to load user')
      setData(json)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { fetchFull() }, [fetchFull])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#E53935]/10 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-[#E53935]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#0A0F1C] text-sm truncate">
              {data?.prismaUser?.name ?? userEmail}
            </p>
            <p className="text-xs text-gray-400 truncate">{userEmail}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-gray-100 px-6 flex-shrink-0 overflow-x-auto">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-[#E53935] text-[#E53935]'
                  : 'border-transparent text-gray-500 hover:text-[#0A0F1C]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="p-6 flex items-start gap-3 text-[#E53935]">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          ) : data ? (
            <>
              {activeTab === 'profile' && (
                <ProfileTab
                  data={data}
                  organizations={organizations}
                  onUpdated={() => fetchFull()}
                />
              )}
              {activeTab === 'dna' && <TraderDNATab profile={data.traderProfile} />}
              {activeTab === 'risk' && <RiskGuardianTab alerts={data.alerts} />}
              {activeTab === 'strategies' && <StrategyLabTab strategies={data.strategies} />}
              {activeTab === 'certs' && (
                <CertificatesTab
                  certificates={data.certificates}
                  enrollments={data.enrollments}
                />
              )}
              {activeTab === 'subs' && <SubscriptionTab data={data} />}
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}
