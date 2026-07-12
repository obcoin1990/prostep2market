'use client'

import { useState } from 'react'
import { Shield, Lock, Key, Smartphone, LogOut, Monitor, Clock } from 'lucide-react'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const supabase = createClient()

interface SessionLog {
  id: string
  type: string
  description: string
  metadata: Record<string, any> | null
  created_at: string
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return 'Active now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay}d ago`
}

function getDeviceFromMetadata(metadata: Record<string, any> | null, fallback: string): string {
  if (!metadata) return fallback
  return metadata.device ?? metadata.userAgent ?? fallback
}

function getLocationFromMetadata(metadata: Record<string, any> | null): string {
  if (!metadata) return 'Unknown'
  return metadata.location ?? metadata.city ?? 'Unknown'
}

function getIpFromMetadata(metadata: Record<string, any> | null): string {
  if (!metadata) return '0.0.0.0'
  return metadata.ip ?? metadata.ip_address ?? '0.0.0.0'
}

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  const { data: sessions, loading: sessionsLoading } = useRealtimeData<SessionLog[]>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'system')
        .order('created_at', { ascending: false })
        .limit(10)
      return data ?? []
    },
    [],
  )

  async function handlePasswordChange() {
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setPasswordLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Password updated successfully')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch {
      toast.error('Failed to update password')
    } finally {
      setPasswordLoading(false)
    }
  }

  async function handleSignOutAll() {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Signed out of all sessions')
      }
    } catch {
      toast.error('Failed to sign out')
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Security Settings"
        description="Manage your password, two-factor authentication, and active sessions"
        icon={Shield}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>Password</DashboardCardTitle>
            <p className="text-xs text-white/60 mt-0.5">Last changed 30 days ago</p>
          </DashboardCardHeader>
          <DashboardCardBody className="space-y-4">
            <div>
              <label className="text-xs text-white/50 block mb-1.5">Current Password</label>
              <div className="relative">
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-[#fcd535]/50" />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1.5">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-[#fcd535]/50" />
            </div>
            <div>
              <label className="text-xs text-white/50 block mb-1.5">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-[#fcd535]/50" />
            </div>
            <button
              onClick={handlePasswordChange}
              disabled={passwordLoading}
              className="rounded-lg bg-[#fcd535] px-4 py-2 text-xs font-semibold text-[#0b0e11] hover:bg-[#fde04e] transition-colors disabled:opacity-50"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader className="flex items-center justify-between">
            <DashboardCardTitle>Two-Factor Authentication</DashboardCardTitle>
            <StatusBadge label="Enabled" variant="success" />
          </DashboardCardHeader>
          <DashboardCardBody className="space-y-4">
            <p className="text-sm text-white/60">Two-factor authentication adds an extra layer of security to your account. You&apos;ll need a one-time code from your authenticator app in addition to your password.</p>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 p-3">
              <Smartphone className="h-5 w-5 text-[#00B4D8]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Authenticator App</p>
                <p className="text-xs text-white/60">Google Authenticator, Authy, or similar</p>
              </div>
              <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5 transition-colors">
                Change
              </button>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-white/10 p-3">
              <Key className="h-5 w-5 text-[#fcd535]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Recovery Codes</p>
                <p className="text-xs text-white/60">2 of 8 codes remaining</p>
              </div>
              <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5 transition-colors">
                Regenerate
              </button>
            </div>
          </DashboardCardBody>
        </DashboardCard>
      </div>

      <DashboardCard>
        <DashboardCardHeader className="flex items-center justify-between">
          <DashboardCardTitle>Active Sessions</DashboardCardTitle>
          <button onClick={handleSignOutAll} className="flex items-center gap-1 text-xs text-[#f6465d] hover:underline">
            <LogOut className="h-3 w-3" /> Sign Out All
          </button>
        </DashboardCardHeader>
        <DashboardCardBody>
          {sessionsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-[52px] w-full rounded-lg" />
              ))}
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Monitor className="h-4 w-4 text-white/60 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white">
                      Current Session
                      <span className="text-[#0ecb81] ml-2 text-xs">(Current)</span>
                    </p>
                    <p className="text-xs text-white/60">Active now</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#0ecb81]">Active now</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((s, i) => {
                const isFirst = i === 0
                const device = getDeviceFromMetadata(s.metadata, s.description || 'Unknown Device')
                const location = getLocationFromMetadata(s.metadata)
                const ip = getIpFromMetadata(s.metadata)
                return (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Monitor className="h-4 w-4 text-white/60 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">
                          {device}
                          {isFirst && <span className="text-[#0ecb81] ml-2 text-xs">(Current)</span>}
                        </p>
                        <p className="text-xs text-white/60">{location} · {ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/60">{formatRelativeTime(s.created_at)}</span>
                      {!isFirst && (
                        <button className="text-xs text-[#f6465d] hover:underline">Revoke</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </DashboardCardBody>
      </DashboardCard>
    </div>
  )
}
