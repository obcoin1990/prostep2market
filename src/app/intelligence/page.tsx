import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Sparkles,
  ShieldAlert,
  Trophy,
  ArrowRight,
  Brain,
  Activity,
  Zap,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  Target,
  CheckCircle2,
  Shield,
  Eye,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'Intelligence — ProStep2Market',
  description:
    'AI Analysis, Risk Guardian, and Edge Score — the three intelligence engines that help you trade with discipline and clarity.',
}

// ── AI loop steps ─────────────────────────────────────────────────────────────
const loop = [
  { icon: Eye, label: 'Observe', desc: 'Reads every trade, emotion log, and session pattern' },
  { icon: Brain, label: 'Analyse', desc: 'Detects behavioral signals: fatigue, revenge, overtrading' },
  { icon: Zap, label: 'Alert', desc: 'Fires a precision warning before damage is done' },
  { icon: RefreshCw, label: 'Adapt', desc: 'Learns your profile and gets sharper over time' },
]

// ── Alert examples ────────────────────────────────────────────────────────────
const alerts = [
  {
    color: '#E53935',
    bg: 'rgba(229,57,53,0.10)',
    border: 'rgba(229,57,53,0.25)',
    icon: AlertTriangle,
    title: 'Revenge Trading Detected',
    body: 'After 3 consecutive losses you increased position size by 300%. Consider stepping away for 20 minutes.',
    level: 'High Risk',
  },
  {
    color: '#FFC107',
    bg: 'rgba(255,193,7,0.10)',
    border: 'rgba(255,193,7,0.25)',
    icon: Activity,
    title: 'Overtrading Warning',
    body: 'You have executed 12 trades today — 80% above your 60-day average. Quality over quantity.',
    level: 'Medium Risk',
  },
  {
    color: '#9C27B0',
    bg: 'rgba(156,39,176,0.10)',
    border: 'rgba(156,39,176,0.25)',
    icon: Clock,
    title: 'Fatigue Risk Elevated',
    body: 'Trading for 4+ hours without a break detected. Decision quality degrades significantly after 3 hours.',
    level: 'Medium Risk',
  },
]

// ── Edge Score pillars ────────────────────────────────────────────────────────
const pillars = [
  {
    icon: Shield,
    label: 'Discipline',
    score: 84,
    color: '#00B4D8',
    desc: 'Did you follow your rules on every trade?',
  },
  {
    icon: Target,
    label: 'Risk',
    score: 76,
    color: '#8A2BE2',
    desc: 'Did you size positions within your plan?',
  },
  {
    icon: Activity,
    label: 'Emotional Stability',
    score: 71,
    color: '#E53935',
    desc: 'Did emotions push you outside your process?',
  },
  {
    icon: TrendingUp,
    label: 'Execution',
    score: 89,
    color: '#00B4D8',
    desc: 'Did you enter and exit at plan-defined levels?',
  },
]

// ── AI Analysis features ──────────────────────────────────────────────────────
const analysisFeatures = [
  { icon: BarChart3, text: 'Trade quality score per entry and exit' },
  { icon: Brain, text: 'Emotional pattern detection across sessions' },
  { icon: Activity, text: 'Win/loss correlation with psychological state' },
  { icon: Sparkles, text: 'Natural language AI coaching after each trade' },
  { icon: TrendingUp, text: 'Performance trend breakdown by session, pair, and setup' },
  { icon: Target, text: 'Bias identification — FOMO, overconfidence, fear' },
]

// ── stats bar ─────────────────────────────────────────────────────────────────
const stats = [
  { value: '94%', label: 'Alert accuracy rate' },
  { value: '3 ms', label: 'Alert response time' },
  { value: '18+', label: 'Behavioral patterns tracked' },
  { value: '2.4M', label: 'Trades analysed to date' },
]

export default function IntelligencePage() {
  return (
    <div className="min-h-screen bg-[#0A0F1C]">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,180,216,0.12), transparent)',
          }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60 uppercase tracking-widest">
            Intelligence Engine
          </span>
          <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-bold tracking-tighter text-white md:text-6xl">
            AI that thinks like a{' '}
            <span className="text-[#00B4D8]">trading coach</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60">
            Three intelligence engines — AI Analysis, Risk Guardian, and Edge Score — work
            continuously in the background to catch mistakes before they happen and reward
            the behaviour that builds a lasting edge.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="gap-2 bg-[#00B4D8] hover:bg-[#0096C7] text-white px-8">
                Start Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white/70 hover:text-white hover:border-white/50 px-8"
              >
                See Plans
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
                <p className="text-3xl font-bold text-[#00B4D8]">{s.value}</p>
                <p className="mt-1 text-sm text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How the AI loop works ─────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              A continuous intelligence loop
            </h2>
            <p className="text-lg text-white/50">
              Every session feeds the engine. Every trade sharpens the model. The AI never
              stops watching so you can focus on executing.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loop.map((step, i) => (
              <div key={step.label} className="relative flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/4 p-6">
                {/* connector arrow for desktop */}
                {i < loop.length - 1 && (
                  <span className="absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:block text-white/20 text-lg">›</span>
                )}
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00B4D8]/15">
                  <step.icon className="h-5 w-5 text-[#00B4D8]" />
                </span>
                <div>
                  <p className="font-semibold text-white">{step.label}</p>
                  <p className="mt-1 text-sm text-white/50">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Analysis ───────────────────────────────────────────────────── */}
      <section className="bg-[#0d1424] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-16 lg:flex-row lg:items-center">

            {/* Text */}
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-[#00B4D8]/12 text-[#00B4D8]">
                <Sparkles className="h-3.5 w-3.5" />
                AI Analysis
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Understand the quality — not just the outcome — of every trade
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">
                Winning and losing are lagging indicators. AI Analysis measures the process:
                did you follow your rules, enter at the right level, and manage the trade
                without emotional interference? A bad trade can be profitable. A good trade
                can still lose. We score the process.
              </p>

              <ul className="grid gap-3 sm:grid-cols-2">
                {analysisFeatures.map((f) => (
                  <li key={f.text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00B4D8]/12">
                      <f.icon className="h-3.5 w-3.5 text-[#00B4D8]" />
                    </span>
                    <span className="text-sm text-white/70">{f.text}</span>
                  </li>
                ))}
              </ul>

              <Link href="/analysis">
                <Button size="lg" className="mt-2 gap-2 bg-[#00B4D8] hover:bg-[#0096C7] text-white">
                  Open AI Analysis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Mockup */}
            <div className="flex-1 lg:max-w-md">
              <div className="rounded-2xl border border-white/10 bg-white/4 p-6 shadow-2xl">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="ml-2 text-xs font-medium text-[#00B4D8]">AI Analysis</span>
                </div>

                {/* Trade row */}
                <div className="mb-4 rounded-xl border border-white/6 bg-white/3 px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">GBP/USD Long · May 11</span>
                    <span className="text-xs font-semibold text-[#2E7D32]">+2.1R</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <div className="h-full rounded-full bg-[#00B4D8]" style={{ width: '88%' }} />
                    </div>
                    <span className="text-sm font-bold text-[#00B4D8]">88</span>
                  </div>
                  <p className="mt-1.5 text-xs text-white/40">Trade quality score</p>
                </div>

                {/* AI feedback */}
                <div className="rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/8 px-4 py-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-[#00B4D8] shrink-0 mt-0.5" />
                    <p className="text-xs text-white/70 leading-relaxed">
                      <span className="text-white font-medium">AI Reflection: </span>
                      Excellent patience — you waited 22 minutes past your entry trigger before executing. No emotional override detected. Entry was within 3 pips of plan.
                    </p>
                  </div>
                </div>

                {/* Emotion tags */}
                <div className="flex flex-wrap gap-2">
                  {['Confident', 'Patient', 'Disciplined'].map((tag) => (
                    <span key={tag} className="rounded-full bg-[#00B4D8]/12 px-3 py-1 text-xs text-[#00B4D8]">
                      {tag}
                    </span>
                  ))}
                  <span className="rounded-full bg-[#E53935]/12 px-3 py-1 text-xs text-[#E53935]">
                    Slight FOMO on exit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Risk Guardian ─────────────────────────────────────────────────── */}
      <section className="bg-[#0A0F1C] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-16 lg:flex-row-reverse lg:items-center">

            {/* Text */}
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-[#E53935]/12 text-[#E53935]">
                <ShieldAlert className="h-3.5 w-3.5" />
                Risk Guardian
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Your AI guardian stops you before the damage is done
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">
                Most traders know their bad habits. The problem is they only recognise them
                after the loss. Risk Guardian runs continuously in the background, detecting
                the early warning signals — elevated position sizing, session length creep,
                loss streak escalation — and fires a precise alert while there is still time
                to act.
              </p>

              <ul className="space-y-3">
                {[
                  'Monitors 18 behavioral risk signals in real time',
                  'Fires alerts with specific, actionable interventions',
                  'Learns your personal risk thresholds from your history',
                  'Can pause trading session when risk threshold is breached',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#E53935]" />
                    <span className="text-sm text-white/70">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/risk-guardian">
                <Button size="lg" className="mt-2 gap-2 bg-[#E53935] hover:bg-[#C62828] text-white">
                  Enable Risk Guardian
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Alert mockup */}
            <div className="flex-1 lg:max-w-md space-y-3">
              <div className="mb-4 flex items-center gap-2 px-1">
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                <span className="ml-2 text-xs font-medium text-[#E53935]">Risk Guardian — Live Alerts</span>
              </div>

              {alerts.map((alert) => (
                <div
                  key={alert.title}
                  className="rounded-xl p-4 border"
                  style={{ background: alert.bg, borderColor: alert.border }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${alert.color}22` }}
                    >
                      <alert.icon className="h-4 w-4" style={{ color: alert.color }} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-white">{alert.title}</p>
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{ background: `${alert.color}20`, color: alert.color }}
                        >
                          {alert.level}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">{alert.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Edge Score ────────────────────────────────────────────────────── */}
      <section className="bg-[#0d1424] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-16 lg:flex-row lg:items-center">

            {/* Text */}
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-[#8A2BE2]/12 text-[#8A2BE2]">
                <Trophy className="h-3.5 w-3.5" />
                Edge Score
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                One number that tells you how good a trader you really are
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">
                P&L is not a measure of trading skill — luck and market conditions distort it
                every day. Edge Score is a composite discipline metric built from four pillars:
                Discipline, Risk, Emotional Stability, and Execution. It measures what you
                can control, and gamifies the process of getting better.
              </p>

              <ul className="space-y-3">
                {[
                  'Updated daily based on your journaled trades',
                  'Ranked against the community leaderboard',
                  'Breaks down weak spots across all four pillars',
                  'Ties directly into your Trader DNA profile',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#8A2BE2]" />
                    <span className="text-sm text-white/70">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/dashboard">
                <Button size="lg" className="mt-2 gap-2 bg-[#8A2BE2] hover:bg-[#6A1FB2] text-white">
                  View My Edge Score
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Score mockup */}
            <div className="flex-1 lg:max-w-md">
              <div className="rounded-2xl border border-white/10 bg-white/4 p-6 shadow-2xl">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="ml-2 text-xs font-medium text-[#8A2BE2]">Edge Score</span>
                </div>

                {/* Big score */}
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <p className="text-6xl font-bold text-white">78</p>
                    <p className="mt-1 text-sm text-white/40">Overall Edge Score</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#8A2BE2]">Top 20%</p>
                    <p className="text-xs text-white/40">of all traders</p>
                    <p className="mt-1 text-xs text-[#2E7D32]">▲ +2 this week</p>
                  </div>
                </div>

                {/* Pillars */}
                <div className="space-y-3">
                  {pillars.map((p) => (
                    <div key={p.label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <p.icon className="h-3.5 w-3.5" style={{ color: p.color }} />
                          <span className="text-xs text-white/60">{p.label}</span>
                        </div>
                        <span className="text-xs font-semibold" style={{ color: p.color }}>
                          {p.score}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${p.score}%`, background: p.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="border-t border-white/8 bg-[#0B0B0B] py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Intelligence that works while you trade
          </h2>
          <p className="mb-8 text-lg text-white/50 max-w-xl mx-auto">
            Start free and get your first AI analysis and Edge Score within minutes of
            logging your first trade.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="gap-2 bg-[#00B4D8] hover:bg-[#0096C7] text-white px-10">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/platform">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white/70 hover:text-white hover:border-white/50 px-10"
              >
                Explore the Platform
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
