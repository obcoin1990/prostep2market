'use client'

import { useState } from 'react'
import { LayoutDashboard, TrendingUp, Trophy, Activity, ArrowUpRight, Sparkles, Target, Brain } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'

interface UserDashboardClientProps {
  userEmail: string
  userName: string | null
  profile: any | null
  tradeCount: number
  edgeScore: any | null
}

const WEEKLY_DATA = [
  { day: 'Mon', trades: 4, pnl: '+2.1R' },
  { day: 'Tue', trades: 6, pnl: '-1.3R' },
  { day: 'Wed', trades: 3, pnl: '+0.8R' },
  { day: 'Thu', trades: 5, pnl: '+3.2R' },
  { day: 'Fri', trades: 2, pnl: '-0.5R' },
  { day: 'Sat', trades: 0, pnl: '—' },
  { day: 'Sun', trades: 0, pnl: '—' },
]

const ACTIVITY_FEED = [
  { icon: Trophy, color: '#0ecb81', text: 'Edge Score improved to 78 — top 20%', time: '2h ago' },
  { icon: Activity, color: '#00B4D8', text: 'Logged 5 trades in today\'s session', time: '4h ago' },
  { icon: Brain, color: '#8A2BE2', text: 'AI analysis completed for last 30 trades', time: '6h ago' },
  { icon: Target, color: '#FFC107', text: 'Risk Guardian flagged overtrading pattern', time: '8h ago' },
]

export function UserDashboardClient({ userEmail, userName, profile, tradeCount, edgeScore }: UserDashboardClientProps) {
  const [dateRange] = useState('7d')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Welcome back, {userName ?? 'Trader'}
          </h2>
          <p className="text-sm text-white/50 mt-0.5">Here&apos;s your trading overview</p>
        </div>
        <StatusBadge label="Active Session" variant="active" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Edge Score" value={edgeScore?.composite_score ?? '—'} icon={Trophy} trend={{ value: 5, positive: true }} />
        <StatCard label="Total Trades" value={tradeCount.toLocaleString()} icon={TrendingUp} />
        <StatCard label="Win Rate" value={profile?.win_rate ? `${profile.win_rate}%` : '—'} icon={Target} />
        <StatCard label="Risk Level" value={profile?.risk_level ?? 'Moderate'} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard className="lg:col-span-2">
          <DashboardCardHeader>
            <DashboardCardTitle>Weekly Trade Activity</DashboardCardTitle>
          </DashboardCardHeader>
          <DashboardCardBody>
            <div className="flex items-end justify-between gap-2 h-32">
              {WEEKLY_DATA.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${Math.max(d.trades * 16, 4)}px`,
                      backgroundColor: d.pnl.startsWith('+') ? '#0ecb81' : d.pnl === '—' ? '#1e2329' : '#f6465d',
                      opacity: d.trades === 0 ? 0.3 : 0.8,
                    }}
                  />
                  <span className="text-[10px] text-white/60">{d.day}</span>
                  {d.trades > 0 && <span className="text-[10px] font-mono text-white/60">{d.pnl}</span>}
                </div>
              ))}
            </div>
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>Recent Activity</DashboardCardTitle>
          </DashboardCardHeader>
          <DashboardCardBody>
            <div className="space-y-3">
              {ACTIVITY_FEED.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${item.color}15` }}>
                      <Icon className="h-3.5 w-3.5" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/80">{item.text}</p>
                      <p className="text-[10px] text-white/60 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </DashboardCardBody>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <DashboardCardHeader>
            <div className="flex items-center justify-between">
              <DashboardCardTitle>Edge Score Breakdown</DashboardCardTitle>
              <ArrowUpRight className="h-4 w-4 text-white/50" />
            </div>
          </DashboardCardHeader>
          <DashboardCardBody>
            <div className="space-y-4">
              {[
                { label: 'Discipline', score: 84, color: '#00B4D8' },
                { label: 'Risk Management', score: 76, color: '#8A2BE2' },
                { label: 'Emotional Stability', score: 71, color: '#fcd535' },
                { label: 'Consistency', score: 82, color: '#0ecb81' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/60">{item.label}</span>
                    <span className="text-xs font-mono font-semibold text-white">{item.score}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#fcd535]" />
              <DashboardCardTitle>AI Insights</DashboardCardTitle>
            </div>
          </DashboardCardHeader>
          <DashboardCardBody>
            <div className="space-y-3">
              {[
                { text: 'Your discipline score improved 8% this week — consistent journaling is paying off.', type: 'positive' },
                { text: 'Consider taking a break after 3 consecutive losses. Your win rate drops 40% on the 4th trade.', type: 'warning' },
                { text: 'Your best trading window is 9:00-11:00 AM. Schedule high-conviction setups during this time.', type: 'info' },
              ].map((insight, i) => (
                <div
                  key={i}
                  className="rounded-lg border p-3 text-xs leading-relaxed"
                  style={{
                    borderColor: insight.type === 'positive' ? '#0ecb8120' : insight.type === 'warning' ? '#FFC10720' : '#00B4D820',
                    backgroundColor: insight.type === 'positive' ? '#0ecb8108' : insight.type === 'warning' ? '#FFC10708' : '#00B4D808',
                  }}
                >
                  <span className="text-white/80">{insight.text}</span>
                </div>
              ))}
            </div>
          </DashboardCardBody>
        </DashboardCard>
      </div>
    </div>
  )
}
