import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  Clock,
  Brain,
  Zap,
  Eye,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  BarChart3,
  Sliders,
  Bell,
  Shield,
  PauseCircle,
  Target,
  HeartPulse,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'Risk Guardian — ProStep2Market',
  description:
    'Real-time behavioral monitoring that catches revenge trading, overtrading, and fatigue before they cost you money.',
}

// ── How it monitors ──────────────────────────────────────────────────────────
const monitorSteps = [
  {
    icon: Eye,
    title: 'Continuous observation',
    desc: 'Tracks every trade, session length, position size, and emotion log in real time — not just at end of day.',
    color: '#00B4D8',
  },
  {
    icon: Brain,
    title: 'Behavioral pattern matching',
    desc: 'Compares your current session against your 60-day behavioral baseline to detect statistical anomalies.',
    color: '#8A2BE2',
  },
  {
    icon: Zap,
    title: 'Precision alert firing',
    desc: 'Triggers a specific, actionable alert the moment a risk threshold is crossed — not after the damage.',
    color: '#E53935',
  },
  {
    icon: RefreshCw,
    title: 'Profile self-calibration',
    desc: 'Learns your personal thresholds over time. New traders and experienced traders get different baselines.',
    color: '#00B4D8',
  },
]

// ── Alert types ──────────────────────────────────────────────────────────────
const alertTypes = [
  {
    icon: TrendingDown,
    color: '#E53935',
    bg: 'rgba(229,57,53,0.08)',
    border: 'rgba(229,57,53,0.20)',
    level: 'High Risk',
    title: 'Revenge Trading',
    trigger: 'Triggered when position size increases by >150% after 2+ consecutive losses',
    impact: 'Responsible for 38% of large single-session drawdowns across our user base',
    intervention: 'Mandatory 20-minute cooldown prompt with guided breathing exercise',
    example: 'After 3 losses you sized 3× your normal position. Guardian fired before the 4th trade.',
  },
  {
    icon: Activity,
    color: '#FFC107',
    bg: 'rgba(255,193,7,0.08)',
    border: 'rgba(255,193,7,0.20)',
    level: 'Medium Risk',
    title: 'Overtrading',
    trigger: 'Triggered when daily trade count exceeds 60% above your personal 60-day average',
    impact: 'Overtrading sessions produce 42% worse average trade quality scores',
    intervention: 'Trade frequency warning with session pause recommendation',
    example: 'You normally take 5 trades per day. At 9 trades today, Guardian flagged the session.',
  },
  {
    icon: Clock,
    color: '#9C27B0',
    bg: 'rgba(156,39,176,0.08)',
    border: 'rgba(156,39,176,0.20)',
    level: 'Medium Risk',
    title: 'Session Fatigue',
    trigger: 'Triggered after 3+ continuous hours of trading without a break longer than 15 minutes',
    impact: 'Decision quality drops an average of 31% after 3 hours of continuous screen time',
    intervention: 'Mandatory break prompt. Session stats shown to reinforce the decision.',
    example: 'You traded from 08:00 to 12:15 without stopping. Guardian recommended a 30-min break.',
  },
  {
    icon: BarChart3,
    color: '#00B4D8',
    bg: 'rgba(0,180,216,0.08)',
    border: 'rgba(0,180,216,0.20)',
    level: 'Caution',
    title: 'Loss Limit Approach',
    trigger: 'Triggered when cumulative daily P&L approaches your pre-set maximum loss threshold',
    impact: 'Traders who ignore daily loss limits lose on average 2.4× more before stopping',
    intervention: 'Hard warning with option to lock trading for the remainder of the session',
    example: 'You hit 80% of your daily loss limit by 10:30. Guardian surfaced a stop-trading prompt.',
  },
  {
    icon: HeartPulse,
    color: '#8A2BE2',
    bg: 'rgba(138,43,226,0.08)',
    border: 'rgba(138,43,226,0.20)',
    level: 'Caution',
    title: 'Emotional Escalation',
    trigger: 'Triggered when post-trade emotion ratings trend negative across 3+ consecutive trades',
    impact: 'Negative emotional cascades precede 67% of revenge trading events in our data',
    intervention: 'Psychology check-in prompt with personalized coping strategies from your Trader DNA',
    example: 'Ratings of 7, 5, 3 across three trades triggered an early emotional risk flag.',
  },
  {
    icon: Target,
    color: '#E53935',
    bg: 'rgba(229,57,53,0.08)',
    border: 'rgba(229,57,53,0.20)',
    level: 'High Risk',
    title: 'Rule Violation Streak',
    trigger: 'Triggered when 3+ consecutive trades deviate from your Strategy Lab rule set',
    impact: 'Rule violations have a 71% correlation with negative trade outcomes in journaled data',
    intervention: 'Strategy review prompt with a side-by-side of your rules vs. what you actually did',
    example: 'Entered 3 trades outside your session window. Guardian surfaced your own rules back.',
  },
]

// ── Guardian settings preview ────────────────────────────────────────────────
const settings = [
  { icon: Sliders,    label: 'Custom loss limit threshold',        enabled: true },
  { icon: Bell,       label: 'Alert delivery: in-app + email',     enabled: true },
  { icon: PauseCircle,label: 'Auto-pause session on High Risk',     enabled: false },
  { icon: Clock,      label: 'Fatigue timer: warn after 3 hours',  enabled: true },
  { icon: Shield,     label: 'Revenge trading sensitivity: High',  enabled: true },
  { icon: RefreshCw,  label: 'Weekly behavioral report',           enabled: true },
]

// ── Stats ────────────────────────────────────────────────────────────────────
const stats = [
  { value: '94%', label: 'Alert accuracy', sub: 'Verified against outcomes' },
  { value: '3ms',  label: 'Response time',  sub: 'From signal to alert' },
  { value: '18',   label: 'Risk patterns',  sub: 'Monitored simultaneously' },
  { value: '67%',  label: 'Loss reduction', sub: 'In flagged sessions' },
]

export default function RiskGuardianPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1C]">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 70% 50% at 50% -5%, rgba(229,57,53,0.12), transparent)',
          }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E53935]/30 bg-[#E53935]/8 px-4 py-1.5 text-xs font-medium text-[#E53935] uppercase tracking-widest">
            <ShieldAlert className="h-3.5 w-3.5" />
            Risk Guardian
          </span>
          <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-bold tracking-tighter text-white md:text-6xl">
            The AI that protects your capital by{' '}
            <span className="text-[#E53935]">protecting your psychology</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60">
            Most traders know their bad habits. The problem is they only recognise them
            after the loss. Risk Guardian catches the warning signals in real time —
            before the damage is done.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="gap-2 bg-[#E53935] hover:bg-[#C62828] text-white px-8">
                Enable Risk Guardian Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white/70 hover:text-white hover:border-white/50 px-8"
              >
                See Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <section className="border-y border-white/8 bg-white/3">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-[#E53935]">{s.value}</p>
                <p className="mt-0.5 text-sm font-medium text-white">{s.label}</p>
                <p className="text-xs text-white/40">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it monitors ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Always watching. Never distracted.
            </h2>
            <p className="text-lg text-white/50">
              While you focus on reading the market, Guardian is reading you.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {monitorSteps.map((step, i) => (
              <div key={step.title} className="relative flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/4 p-6">
                {i < monitorSteps.length - 1 && (
                  <span className="absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:block text-white/20 text-lg">›</span>
                )}
                <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${step.color}18` }}>
                  <step.icon className="h-5 w-5" style={{ color: step.color }} />
                </span>
                <div>
                  <p className="font-semibold text-white text-sm">{step.title}</p>
                  <p className="mt-1.5 text-xs text-white/50 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Alert types ───────────────────────────────────────────────────── */}
      <section className="bg-[#0d1424] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              6 risk patterns. Zero tolerance.
            </h2>
            <p className="text-lg text-white/50">
              Each alert type has a specific trigger, a measured impact, and a tailored intervention.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
            {alertTypes.map((a) => (
              <div
                key={a.title}
                className="rounded-2xl border p-5 flex flex-col gap-4"
                style={{ background: a.bg, borderColor: a.border }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `${a.color}22` }}>
                      <a.icon className="h-4 w-4" style={{ color: a.color }} />
                    </span>
                    <p className="font-semibold text-white">{a.title}</p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{ background: `${a.color}22`, color: a.color }}
                  >
                    {a.level}
                  </span>
                </div>

                {/* Detail rows */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex gap-2">
                    <span className="shrink-0 font-semibold text-white/40 w-20">Trigger</span>
                    <span className="text-white/60">{a.trigger}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 font-semibold text-white/40 w-20">Impact</span>
                    <span className="text-white/60">{a.impact}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 font-semibold text-white/40 w-20">Action</span>
                    <span className="text-white/60">{a.intervention}</span>
                  </div>
                </div>

                {/* Example */}
                <div
                  className="rounded-xl px-3 py-2.5 text-xs text-white/50 italic border"
                  style={{ background: `${a.color}10`, borderColor: `${a.color}20` }}
                >
                  "{a.example}"
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live alert mockup + settings ──────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl flex flex-col gap-16 lg:flex-row lg:items-start">

            {/* Alert feed mockup */}
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-bold text-white">What it looks like in practice</h2>
              <p className="mb-6 text-white/50 text-sm">A real session where Guardian fired three times.</p>

              {/* Risk meter */}
              <div className="mb-4 rounded-2xl border border-white/10 bg-white/4 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#E53935] animate-pulse" />
                    <span className="text-sm font-medium text-white">Live Risk Level</span>
                  </div>
                  <span className="text-sm font-bold text-[#FFC107]">Elevated</span>
                </div>
                <div className="h-3 w-full rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: '65%', background: 'linear-gradient(90deg, #2E7D32 0%, #FFC107 65%)' }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-white/25">
                  <span>Safe</span><span>Caution</span><span>Elevated</span><span>Danger</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-3">
                {[
                  {
                    time: '10:14',
                    color: '#FFC107',
                    bg: 'rgba(255,193,7,0.08)',
                    border: 'rgba(255,193,7,0.20)',
                    icon: Activity,
                    title: 'Overtrading Warning',
                    body: '9 trades by 10:14 — 80% above your daily average. Slow down.',
                  },
                  {
                    time: '11:02',
                    color: '#E53935',
                    bg: 'rgba(229,57,53,0.10)',
                    border: 'rgba(229,57,53,0.25)',
                    icon: AlertTriangle,
                    title: 'Revenge Trading Detected',
                    body: 'Position size 3× normal after 3 losses. Cooling down recommended.',
                  },
                  {
                    time: '12:30',
                    color: '#9C27B0',
                    bg: 'rgba(156,39,176,0.08)',
                    border: 'rgba(156,39,176,0.20)',
                    icon: Clock,
                    title: 'Fatigue Risk Elevated',
                    body: '4.5 hours continuous trading. Your quality drops after 3 hours.',
                  },
                  {
                    time: '12:31',
                    color: '#2E7D32',
                    bg: 'rgba(46,125,50,0.08)',
                    border: 'rgba(46,125,50,0.20)',
                    icon: CheckCircle2,
                    title: 'Session Ended — Good Call',
                    body: 'You closed the session. P&L preserved. Edge Score +1.',
                  },
                ].map((item) => (
                  <div
                    key={item.time}
                    className="flex items-start gap-3 rounded-xl border p-4"
                    style={{ background: item.bg, borderColor: item.border }}
                  >
                    <span className="text-xs text-white/30 shrink-0 w-10 pt-0.5">{item.time}</span>
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${item.color}22` }}
                    >
                      <item.icon className="h-3.5 w-3.5" style={{ color: item.color }} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-white/55 mt-0.5">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings panel */}
            <div className="flex-1 lg:max-w-sm">
              <h2 className="mb-2 text-2xl font-bold text-white">You control the sensitivity</h2>
              <p className="mb-6 text-white/50 text-sm">
                Customise every threshold to match your trading style. Guardian adapts to you — not the other way around.
              </p>

              <div className="rounded-2xl border border-white/10 bg-white/4 p-5">
                <div className="flex items-center gap-2 mb-5">
                  <Sliders className="h-4 w-4 text-[#E53935]" />
                  <span className="text-sm font-medium text-white">Guardian Settings</span>
                </div>

                <div className="space-y-3">
                  {settings.map((s) => (
                    <div key={s.label} className="flex items-center justify-between gap-3 rounded-xl border border-white/6 bg-white/3 px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <s.icon className="h-4 w-4 text-white/40 shrink-0" />
                        <span className="text-xs text-white/70">{s.label}</span>
                      </div>
                      {/* Toggle visual */}
                      <div
                        className="relative h-5 w-9 rounded-full shrink-0 flex items-center transition-colors"
                        style={{ background: s.enabled ? '#E53935' : 'rgba(255,255,255,0.12)' }}
                      >
                        <span
                          className="absolute h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
                          style={{ transform: s.enabled ? 'translateX(18px)' : 'translateX(2px)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/signup" className="block mt-5">
                  <Button className="w-full gap-2 bg-[#E53935] hover:bg-[#C62828] text-white">
                    Configure My Guardian
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Trust note */}
              <div className="mt-4 rounded-xl border border-white/6 bg-white/3 px-4 py-3 flex items-start gap-2.5">
                <Shield className="h-4 w-4 text-[#2E7D32] shrink-0 mt-0.5" />
                <p className="text-xs text-white/50">
                  Risk Guardian is <span className="text-white/70 font-medium">read-only</span>. It can never place, modify, or close trades on your behalf.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Checklist ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1424] py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white">
                Included on every plan. No extra setup.
              </h2>
              <p className="text-white/50 text-lg mb-6">
                Risk Guardian activates the moment you log your first trade.
                No broker connection required to start.
              </p>
              <Link href="/signup">
                <Button size="lg" className="gap-2 bg-[#E53935] hover:bg-[#C62828] text-white px-8">
                  Activate Guardian Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Real-time behavioral monitoring',
                'Revenge trading detection',
                'Overtrading frequency alerts',
                'Session fatigue warnings',
                'Daily loss limit tracking',
                'Emotional escalation flags',
                'Personalized thresholds',
                'Weekly Guardian summary report',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#E53935]" />
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="border-t border-white/8 bg-[#0B0B0B] py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-[#E53935]" />
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Stop letting emotions cost you money
          </h2>
          <p className="mb-8 text-lg text-white/50 max-w-xl mx-auto">
            Every serious trader needs a system that holds them accountable.
            Risk Guardian is that system.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="gap-2 bg-[#E53935] hover:bg-[#C62828] text-white px-10">
                Enable Risk Guardian
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/intelligence">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white/70 hover:text-white hover:border-white/50 px-10"
              >
                See All Intelligence Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
