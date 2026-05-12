'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  BookMarked,
  FlaskConical,
  Dna,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Activity,
  Bell,
  Brain,
  Gauge,
  HeartPulse,
  AlertTriangle,
  Clock,
  Sparkles,
  Trophy,
  Camera,
  Target,
  Shield,
  CheckCircle2,
  Sliders,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/landing/Footer'

// ── Tab definitions ───────────────────────────────────────────────────────────
const tabs = [
  { id: 'dashboard',     icon: LayoutDashboard, label: 'Dashboard',     accent: '#00B4D8' },
  { id: 'journal',       icon: BookMarked,      label: 'Trade Journal', accent: '#8A2BE2' },
  { id: 'risk-guardian', icon: ShieldAlert,     label: 'Risk Guardian', accent: '#E53935' },
  { id: 'strategy-lab',  icon: FlaskConical,    label: 'Strategy Lab',  accent: '#E53935' },
  { id: 'trader-dna',    icon: Dna,             label: 'Trader DNA',    accent: '#00B4D8' },
]

// ── Dashboard panel ───────────────────────────────────────────────────────────
function DashboardPanel() {
  const metrics = [
    { icon: Gauge,      label: 'Edge Score',     value: '78',  sub: 'Top 20%',       delta: '+2',  color: '#00B4D8' },
    { icon: HeartPulse, label: 'Emotional Risk', value: 'Low', sub: 'Stable',        delta: '↓',   color: '#2E7D32' },
    { icon: Bell,       label: 'AI Alerts',      value: '3',   sub: 'Active',        delta: '+1',  color: '#FFC107' },
    { icon: Activity,   label: 'Consistency',    value: '82%', sub: 'This week',     delta: '↑',   color: '#8A2BE2' },
    { icon: Brain,      label: 'Psychology',     value: '76',  sub: 'Discipline',    delta: '+3',  color: '#00B4D8' },
  ]

  const recentTrades = [
    { pair: 'EUR/USD', dir: 'Long',  result: '+1.8R', quality: 88, emotion: 'Calm' },
    { pair: 'GBP/JPY', dir: 'Short', result: '-0.5R', quality: 72, emotion: 'Anxious' },
    { pair: 'USD/CAD', dir: 'Long',  result: '+2.2R', quality: 94, emotion: 'Confident' },
  ]

  return (
    <div className="space-y-5">
      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-white/8 bg-white/4 p-4">
            <div className="flex items-center gap-2 mb-3">
              <m.icon className="h-4 w-4" style={{ color: m.color }} />
              <span className="text-xs text-white/50">{m.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-white/40">{m.sub}</span>
              <span className="text-xs font-semibold" style={{ color: m.color }}>{m.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edge Score progress bar */}
      <div className="rounded-xl border border-white/8 bg-white/4 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Weekly Edge Score Progress</span>
          <span className="text-xs text-white/40">78 / 100</span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/8 overflow-hidden">
          <div className="h-full rounded-full bg-[#00B4D8]" style={{ width: '78%' }} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-white/30">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
        </div>
      </div>

      {/* Recent trades */}
      <div className="rounded-xl border border-white/8 bg-white/4 p-4">
        <p className="text-sm font-medium text-white mb-3">Recent Trades</p>
        <div className="space-y-2">
          {recentTrades.map((t) => (
            <div key={t.pair} className="flex items-center gap-3 rounded-lg bg-white/3 px-3 py-2.5">
              <span className="text-xs font-semibold text-white w-16">{t.pair}</span>
              <span className="text-xs text-white/40 w-10">{t.dir}</span>
              <span className={`text-xs font-semibold w-14 ${t.result.startsWith('+') ? 'text-[#2E7D32]' : 'text-[#E53935]'}`}>
                {t.result}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                <div className="h-full rounded-full bg-[#00B4D8]" style={{ width: `${t.quality}%` }} />
              </div>
              <span className="text-xs text-[#00B4D8] w-6">{t.quality}</span>
              <span className="text-xs text-white/40 hidden sm:block">{t.emotion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Trade Journal panel ───────────────────────────────────────────────────────
function JournalPanel() {
  const entries = [
    {
      pair: 'GBP/USD',
      dir: 'Long',
      date: 'May 11, 09:42',
      result: '+2.1R',
      preEmotion: 8,
      postEmotion: 9,
      quality: 91,
      tags: ['Patient', 'Disciplined'],
      aiNote: 'Excellent entry timing. You waited for the 15m confirmation before executing. No FOMO detected.',
    },
    {
      pair: 'EUR/JPY',
      dir: 'Short',
      date: 'May 10, 14:15',
      result: '-1.0R',
      preEmotion: 6,
      postEmotion: 4,
      quality: 61,
      tags: ['Rushed', 'Anxious'],
      aiNote: 'Entry was 8 pips early — before the level was tested. Emotional state may have influenced timing.',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white">Recent Journal Entries</p>
        <span className="rounded-full bg-[#8A2BE2]/20 px-3 py-1 text-xs text-[#8A2BE2]">14 entries this week</span>
      </div>

      {entries.map((e) => (
        <div key={e.pair + e.date} className="rounded-xl border border-white/8 bg-white/4 p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white">{e.pair}</span>
              <span className="rounded-full bg-white/8 px-2 py-0.5 text-xs text-white/50">{e.dir}</span>
              <span className="text-xs text-white/30">{e.date}</span>
            </div>
            <span className={`text-sm font-bold ${e.result.startsWith('+') ? 'text-[#2E7D32]' : 'text-[#E53935]'}`}>
              {e.result}
            </span>
          </div>

          {/* Emotion bars */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-white/40 mb-1">Pre-trade emotion</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <div className="h-full rounded-full bg-[#8A2BE2]" style={{ width: `${e.preEmotion * 10}%` }} />
                </div>
                <span className="text-xs text-[#8A2BE2]">{e.preEmotion}/10</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Post-trade emotion</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <div className="h-full rounded-full bg-[#8A2BE2]" style={{ width: `${e.postEmotion * 10}%` }} />
                </div>
                <span className="text-xs text-[#8A2BE2]">{e.postEmotion}/10</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Camera className="h-3.5 w-3.5 text-white/20" />
            {e.tags.map((t) => (
              <span key={t} className={`rounded-full px-2 py-0.5 text-xs ${
                ['Patient','Disciplined','Confident'].includes(t)
                  ? 'bg-[#2E7D32]/20 text-[#4CAF50]'
                  : 'bg-[#E53935]/15 text-[#E53935]'
              }`}>{t}</span>
            ))}
          </div>

          {/* AI note */}
          <div className="rounded-lg border border-[#8A2BE2]/20 bg-[#8A2BE2]/8 px-3 py-2.5 flex items-start gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[#8A2BE2] shrink-0 mt-0.5" />
            <p className="text-xs text-white/60">{e.aiNote}</p>
          </div>

          {/* Quality */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Trade quality</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
              <div className="h-full rounded-full bg-[#00B4D8]" style={{ width: `${e.quality}%` }} />
            </div>
            <span className="text-xs font-semibold text-[#00B4D8]">{e.quality}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Risk Guardian panel ───────────────────────────────────────────────────────
function RiskGuardianPanel() {
  const alerts = [
    {
      color: '#E53935', bg: 'rgba(229,57,53,0.10)', border: 'rgba(229,57,53,0.25)',
      icon: AlertTriangle, level: 'High', levelBg: 'rgba(229,57,53,0.2)',
      title: 'Revenge Trading Detected',
      body: 'After 3 consecutive losses you increased position size by 300%. Step away for 20 minutes.',
      time: '2 min ago',
    },
    {
      color: '#FFC107', bg: 'rgba(255,193,7,0.10)', border: 'rgba(255,193,7,0.25)',
      icon: Activity, level: 'Medium', levelBg: 'rgba(255,193,7,0.2)',
      title: 'Overtrading Warning',
      body: '12 trades today — 80% above your 60-day average. Slow down and be selective.',
      time: '18 min ago',
    },
    {
      color: '#9C27B0', bg: 'rgba(156,39,176,0.10)', border: 'rgba(156,39,176,0.25)',
      icon: Clock, level: 'Medium', levelBg: 'rgba(156,39,176,0.2)',
      title: 'Fatigue Risk Elevated',
      body: '4+ hours of continuous trading detected. Decision quality degrades after 3 hours.',
      time: '1 hr ago',
    },
    {
      color: '#2E7D32', bg: 'rgba(46,125,50,0.10)', border: 'rgba(46,125,50,0.25)',
      icon: CheckCircle2, level: 'Resolved', levelBg: 'rgba(46,125,50,0.2)',
      title: 'Loss Limit Approaching — Resolved',
      body: 'You closed your session before hitting the daily loss limit. Great discipline.',
      time: 'Yesterday',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white">Live Alert Feed</p>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#E53935] animate-pulse" />
          <span className="text-xs text-white/50">Monitoring active</span>
        </div>
      </div>

      {/* Risk meter */}
      <div className="rounded-xl border border-white/8 bg-white/4 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Current Risk Level</span>
          <span className="text-sm font-bold text-[#FFC107]">Elevated</span>
        </div>
        <div className="h-3 w-full rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: '65%',
              background: 'linear-gradient(90deg, #2E7D32, #FFC107 65%)',
            }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-white/30">
          <span>Safe</span><span>Caution</span><span>Elevated</span><span>Danger</span>
        </div>
      </div>

      {/* Alert cards */}
      {alerts.map((a) => (
        <div key={a.title} className="rounded-xl p-4 border" style={{ background: a.bg, borderColor: a.border }}>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${a.color}22` }}>
              <a.icon className="h-4 w-4" style={{ color: a.color }} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-white">{a.title}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: a.levelBg, color: a.color }}>
                    {a.level}
                  </span>
                </div>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">{a.body}</p>
              <p className="mt-1.5 text-xs text-white/30">{a.time}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Strategy Lab panel ────────────────────────────────────────────────────────
function StrategyLabPanel() {
  const strategies = [
    { name: 'London Breakout', version: 'v3', rr: '1:2.5', hitRate: '68%', consistency: 91, status: 'Active' },
    { name: 'NY Open Reversal', version: 'v1', rr: '1:2.0', hitRate: '54%', consistency: 77, status: 'Testing' },
  ]

  const rules = [
    { icon: Clock,   rule: 'Session window: 08:00 – 11:00 GMT' },
    { icon: Target,  rule: 'Entry: 15m close above prior high' },
    { icon: Shield,  rule: 'Stop: below last swing low' },
    { icon: TrendingUp, rule: 'Target: 2.5× risk' },
    { icon: Sliders, rule: 'Max 2 trades per session' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white">My Strategies</p>
        <span className="rounded-full bg-[#E53935]/20 px-3 py-1 text-xs text-[#E53935]">2 saved</span>
      </div>

      {/* Strategy cards */}
      {strategies.map((s) => (
        <div key={s.name} className="rounded-xl border border-white/8 bg-white/4 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-white">{s.name}</p>
              <p className="text-xs text-white/40">{s.version}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              s.status === 'Active' ? 'bg-[#2E7D32]/20 text-[#4CAF50]' : 'bg-[#FFC107]/20 text-[#FFC107]'
            }`}>{s.status}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="rounded-lg bg-white/4 p-2 text-center">
              <p className="text-xs text-white/40">Target RR</p>
              <p className="text-sm font-bold text-white">{s.rr}</p>
            </div>
            <div className="rounded-lg bg-white/4 p-2 text-center">
              <p className="text-xs text-white/40">Hit Rate</p>
              <p className="text-sm font-bold text-[#00B4D8]">{s.hitRate}</p>
            </div>
            <div className="rounded-lg bg-white/4 p-2 text-center">
              <p className="text-xs text-white/40">Consistency</p>
              <p className="text-sm font-bold text-[#E53935]">{s.consistency}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Rules followed</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
              <div className="h-full rounded-full bg-[#E53935]" style={{ width: `${s.consistency}%` }} />
            </div>
          </div>
        </div>
      ))}

      {/* Rule builder */}
      <div className="rounded-xl border border-white/8 bg-white/4 p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-[#E53935]" />
          <p className="text-sm font-medium text-white">London Breakout — Rules</p>
        </div>
        <div className="space-y-2">
          {rules.map((r) => (
            <div key={r.rule} className="flex items-center gap-2.5 rounded-lg bg-white/3 px-3 py-2">
              <r.icon className="h-3.5 w-3.5 text-[#E53935] shrink-0" />
              <span className="text-xs text-white/70">{r.rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Trader DNA panel ──────────────────────────────────────────────────────────
function TraderDNAPanel() {
  const dimensions = [
    { label: 'Risk Tolerance',       score: 62, color: '#00B4D8' },
    { label: 'Emotional Regulation', score: 74, color: '#8A2BE2' },
    { label: 'Patience',             score: 85, color: '#00B4D8' },
    { label: 'Discipline',           score: 79, color: '#2E7D32' },
    { label: 'Overconfidence Risk',  score: 38, color: '#E53935' },
    { label: 'FOMO Susceptibility',  score: 45, color: '#FFC107' },
  ]

  const insights = [
    { icon: CheckCircle2, color: '#2E7D32', text: 'Strong suit: You wait for confirmation before entry' },
    { icon: AlertTriangle, color: '#FFC107', text: 'Watch out: Tendency to widen stops after entry' },
    { icon: AlertTriangle, color: '#E53935', text: 'Risk area: Revenge trading after 2+ consecutive losses' },
    { icon: CheckCircle2, color: '#2E7D32', text: 'Strong suit: Consistent session timing and prep' },
  ]

  return (
    <div className="space-y-4">
      {/* Profile header */}
      <div className="rounded-xl border border-white/8 bg-white/4 p-4 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00B4D8]/15">
          <Dna className="h-6 w-6 text-[#00B4D8]" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Analytical Trader</p>
          <p className="text-xs text-white/50">Data-driven · Risk-aware · Patience-oriented</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-white/40">Assessment</p>
          <p className="text-sm font-semibold text-[#00B4D8]">Complete</p>
        </div>
      </div>

      {/* Dimension bars */}
      <div className="rounded-xl border border-white/8 bg-white/4 p-4 space-y-3">
        <p className="text-sm font-medium text-white mb-1">Psychological Dimensions</p>
        {dimensions.map((d) => (
          <div key={d.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/60">{d.label}</span>
              <span className="text-xs font-semibold" style={{ color: d.color }}>{d.score}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: d.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="rounded-xl border border-white/8 bg-white/4 p-4 space-y-2.5">
        <p className="text-sm font-medium text-white mb-1">Personalised Insights</p>
        {insights.map((ins) => (
          <div key={ins.text} className="flex items-start gap-2.5">
            <ins.icon className="h-4 w-4 shrink-0 mt-0.5" style={{ color: ins.color }} />
            <p className="text-xs text-white/60">{ins.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
const panelMap: Record<string, React.ReactNode> = {
  dashboard:     <DashboardPanel />,
  journal:       <JournalPanel />,
  'risk-guardian': <RiskGuardianPanel />,
  'strategy-lab':  <StrategyLabPanel />,
  'trader-dna':    <TraderDNAPanel />,
}

export default function DemoPage() {
  const [active, setActive] = useState('dashboard')
  const current = tabs.find((t) => t.id === active)!

  return (
    <div className="min-h-screen bg-[#0A0F1C]">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(138,43,226,0.10), transparent)',
          }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60 uppercase tracking-widest">
            Interactive Demo
          </span>
          <h1 className="mx-auto mb-4 max-w-3xl text-4xl font-bold tracking-tighter text-white md:text-5xl">
            See ProStep2Market in action
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/50">
            Click through each feature below — this is real product UI, not a video.
            No login required.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2 bg-[#E53935] hover:bg-[#C62828] text-white px-8">
              Start Free — Takes 2 Minutes
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Interactive demo ──────────────────────────────────────────────── */}
      <section className="pb-24">
        <div className="container mx-auto px-4">

          {/* Tab bar */}
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            {tabs.map((tab) => {
              const isActive = tab.id === active
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'border border-white/8 bg-white/4 text-white/50 hover:text-white hover:bg-white/8'
                  }`}
                  style={
                    isActive
                      ? { background: `${tab.accent}22`, border: `1px solid ${tab.accent}50`, color: tab.accent }
                      : {}
                  }
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Panel frame */}
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#0d1424] shadow-2xl overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-white/8 bg-white/3 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#E53935]/60" />
              <span className="h-3 w-3 rounded-full bg-[#FFC107]/60" />
              <span className="h-3 w-3 rounded-full bg-[#2E7D32]/60" />
              <div className="ml-3 flex items-center gap-2 rounded-md bg-white/6 px-3 py-1">
                <span className="h-3 w-3 rounded-sm" style={{ background: `${current.accent}60` }}>
                  <current.icon className="h-3 w-3" style={{ color: current.accent }} />
                </span>
                <span className="text-xs text-white/40">prostep2market.vercel.app / {active}</span>
              </div>
              <span
                className="ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ background: `${current.accent}20`, color: current.accent }}
              >
                {current.label}
              </span>
            </div>

            {/* Panel content */}
            <div className="p-5 md:p-6">
              {panelMap[active]}
            </div>
          </div>

          {/* Sign-up nudge below demo */}
          <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-white/8 bg-white/3 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Ready to use the real thing?</p>
              <p className="text-xs text-white/50 mt-0.5">
                Free account — no credit card. Your data is never shared.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/pricing">
                <Button variant="outline" size="sm" className="border-white/20 text-white/60 hover:text-white">
                  See Plans
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="gap-1.5 bg-[#E53935] hover:bg-[#C62828] text-white">
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature highlights ────────────────────────────────────────────── */}
      <section className="border-t border-white/8 bg-[#0B0B0B] py-16">
        <div className="container mx-auto px-4">
          <p className="mb-8 text-center text-sm font-medium text-white/40 uppercase tracking-widest">
            Everything in the demo is available on the Free plan
          </p>
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: LayoutDashboard, text: 'Live Edge Score dashboard' },
              { icon: BookMarked,      text: 'AI-powered Trade Journal' },
              { icon: ShieldAlert,     text: 'Risk Guardian alerts' },
              { icon: FlaskConical,    text: 'Strategy Lab simulator' },
              { icon: Dna,             text: 'Trader DNA assessment' },
              { icon: Trophy,          text: 'Community leaderboard' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/3 px-4 py-3">
                <f.icon className="h-4 w-4 text-[#E53935] shrink-0" />
                <span className="text-sm text-white/70">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
