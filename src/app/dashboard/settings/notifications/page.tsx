'use client'

import { useState, useCallback } from 'react'
import { Bell, Shield, Activity, Award, TrendingUp, Mail, Smartphone, CheckCircle2 } from 'lucide-react'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const NOTIFICATION_GROUPS = [
  {
    title: 'Risk Alerts',
    items: [
      { name: 'Overtrading Warning', desc: 'When trade count exceeds daily average' },
      { name: 'Revenge Trading Alert', desc: 'When consecutive losses trigger position size increase' },
      { name: 'Fatigue Detection', desc: 'When session duration exceeds healthy limit' },
      { name: 'Drawdown Threshold', desc: 'When drawdown exceeds configured limit' },
    ],
    icon: Shield,
    color: '#f6465d',
  },
  {
    title: 'Trading Activity',
    items: [
      { name: 'Trade Confirmation', desc: 'Confirmation when a trade is logged' },
      { name: 'Edge Score Update', desc: 'When your Edge Score changes significantly' },
      { name: 'Strategy Signal', desc: 'When a strategy setup is detected' },
    ],
    icon: Activity,
    color: '#0ecb81',
  },
  {
    title: 'Achievements & Progress',
    items: [
      { name: 'Milestone Reached', desc: 'Trading milestones and streak achievements' },
      { name: 'Badge Earned', desc: 'When you unlock a new trading badge' },
      { name: 'Level Up', desc: 'When your trading level increases' },
    ],
    icon: Award,
    color: '#8A2BE2',
  },
  {
    title: 'Education',
    items: [
      { name: 'Course Completion', desc: 'When you complete a course or module' },
      { name: 'Quiz Reminder', desc: 'Upcoming quiz notifications' },
      { name: 'New Content Available', desc: 'When new courses are added to your path' },
    ],
    icon: TrendingUp,
    color: '#00B4D8',
  },
]

interface UserSettings {
  email_notifications: boolean
  push_notifications: boolean
  alert_sound_enabled: boolean
}

export default function NotificationSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [prefs, setPrefs] = useState<Record<string, { push: boolean; email: boolean }>>({})

  const { data: settings, loading } = useRealtimeData<UserSettings | null>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      const { data } = await supabase
        .from('user_settings')
        .select('email_notifications, push_notifications, alert_sound_enabled')
        .eq('user_id', user.id)
        .single()
      return data ?? null
    },
    [],
  )

  const togglePrefs = useCallback((itemName: string, channel: 'push' | 'email') => {
    setPrefs(prev => {
      const current = prev[itemName] ?? { push: false, email: false }
      return { ...prev, [itemName]: { ...current, [channel]: !current[channel] } }
    })
    setSaved(false)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const hasGlobalPush = Object.values(prefs).some(p => p.push)
      const hasGlobalEmail = Object.values(prefs).some(p => p.email)
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          push_notifications: hasGlobalPush,
          email_notifications: hasGlobalEmail,
          alert_sound_enabled: hasGlobalPush,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const getPushState = (itemName: string, defaultVal: boolean): boolean => {
    if (prefs[itemName]) return prefs[itemName].push
    if (settings) return settings.push_notifications
    return defaultVal
  }

  const getEmailState = (itemName: string, defaultVal: boolean): boolean => {
    if (prefs[itemName]) return prefs[itemName].email
    if (settings) return settings.email_notifications
    return defaultVal
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Notification Preferences" description="Control how and when you receive notifications" icon={Bell} />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Notification Preferences"
        description="Control how and when you receive notifications"
        icon={Bell}
      />

      <div className="flex items-center gap-4 px-1 mb-2">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <div className="flex items-center gap-1">
            <Smartphone className="h-3.5 w-3.5" />
            <span>Push</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <div className="flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" />
            <span>Email</span>
          </div>
        </div>
      </div>

      {NOTIFICATION_GROUPS.map((group) => (
        <DashboardCard key={group.title}>
          <DashboardCardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${group.color}15` }}>
                <group.icon className="h-4 w-4" style={{ color: group.color }} />
              </div>
              <DashboardCardTitle>{group.title}</DashboardCardTitle>
            </div>
          </DashboardCardHeader>
          <DashboardCardBody>
            <div className="space-y-3">
              {group.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{item.name}</p>
                    <p className="text-xs text-white/60 mt-0.5">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={getPushState(item.name, true)}
                        onChange={() => togglePrefs(item.name, 'push')}
                        className="peer sr-only"
                      />
                      <div className="h-5 w-9 rounded-full bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#fcd535] peer-checked:after:translate-x-full" />
                    </label>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={getEmailState(item.name, false)}
                        onChange={() => togglePrefs(item.name, 'email')}
                        className="peer sr-only"
                      />
                      <div className="h-5 w-9 rounded-full bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#fcd535] peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCardBody>
        </DashboardCard>
      ))}

      <div className="flex justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-[#0ecb81]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Saved
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#fcd535] px-4 py-2 text-xs font-semibold text-[#0b0e11] hover:bg-[#fde04e] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  )
}
