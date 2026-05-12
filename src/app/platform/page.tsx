import type { Metadata } from 'next'
import Link from 'next/link'
import {
  LayoutDashboard,
  BookMarked,
  FlaskConical,
  Dna,
  Link2,
  Upload,
  PenTool,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Camera,
  RefreshCw,
  Target,
  TrendingUp,
  Clock,
  Layers,
  Activity,
  Sliders,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'Platform — ProStep2Market',
  description:
    'Explore the full ProStep2Market platform: Dashboard, Trade Journal, Strategy Lab, and Trader DNA — all built to improve your trading discipline.',
}

// ── shared types ──────────────────────────────────────────────────────────────
type Feature = { icon: React.ElementType; text: string }
type Tool = {
  id: string
  icon: React.ElementType
  accentColor: string
  bgColor: string
  label: string
  headline: string
  body: string
  features: Feature[]
  href: string
  cta: string
  mockupLines: { label: string; value: string; sub?: string; color?: string }[]
}

// ── platform tools ─────────────────────────────────────────────────────────────
const tools: Tool[] = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    accentColor: '#00B4D8',
    bgColor: 'rgba(0,180,216,0.12)',
    label: 'Dashboard',
    headline: 'Your trading performance at a glance',
    body: 'The Dashboard gives you a real-time pulse on every metric that matters — Edge Score, emotional risk, trade consistency, and AI-generated alerts — so you always know exactly where you stand.',
    features: [
      { icon: BarChart3, text: 'Live Edge Score with daily breakdown' },
      { icon: Activity, text: 'Emotional risk meter updated per session' },
      { icon: Target, text: 'Win rate, RR ratio, and consistency index' },
      { icon: TrendingUp, text: 'Weekly progress vs. your personal benchmarks' },
    ],
    href: '/dashboard',
    cta: 'Open Dashboard',
    mockupLines: [
      { label: 'Edge Score', value: '78', sub: 'Top 20% of traders', color: '#00B4D8' },
      { label: 'Emotional Risk', value: 'Low', sub: 'Stable psychology', color: '#2E7D32' },
      { label: 'Consistency', value: '82%', sub: 'Weekly adherence', color: '#00B4D8' },
      { label: 'Active Alerts', value: '3', sub: 'View recommendations', color: '#E53935' },
    ],
  },
  {
    id: 'journal',
    icon: BookMarked,
    accentColor: '#8A2BE2',
    bgColor: 'rgba(138,43,226,0.12)',
    label: 'Trade Journal',
    headline: 'Log every trade with context and emotion',
    body: 'The Trade Journal is more than a spreadsheet. Attach screenshots, record your emotional state before and after each trade, and let the AI reflect back insights you would never see on your own.',
    features: [
      { icon: Camera, text: 'Attach chart screenshots to each entry' },
      { icon: Activity, text: 'Log pre-trade and post-trade emotion ratings' },
      { icon: RefreshCw, text: 'AI reflection on every completed trade' },
      { icon: Upload, text: 'Import from MT5 CSV or enter manually' },
    ],
    href: '/journal',
    cta: 'Open Journal',
    mockupLines: [
      { label: 'Trade', value: 'EUR/USD Long', sub: 'May 11, 09:42', color: '#8A2BE2' },
      { label: 'Result', value: '+1.8R', sub: 'Profit: $180', color: '#2E7D32' },
      { label: 'Pre-emotion', value: 'Confident', sub: '8 / 10', color: '#8A2BE2' },
      { label: 'AI note', value: 'Good patience', sub: 'Waited for confirmation', color: '#00B4D8' },
    ],
  },
  {
    id: 'strategy-lab',
    icon: FlaskConical,
    accentColor: '#E53935',
    bgColor: 'rgba(229,57,53,0.12)',
    label: 'Strategy Lab',
    headline: 'Build, test, and refine your trading rules',
    body: 'Define your strategy rules — entry conditions, risk/reward targets, session windows — and simulate them against historical behavior. See how discipline and consistency affect your expected results before you risk real capital.',
    features: [
      { icon: Sliders, text: 'Define RR, session, and entry rule sets' },
      { icon: RefreshCw, text: 'Run simulations on past trade data' },
      { icon: BarChart3, text: 'Consistency score per strategy' },
      { icon: Layers, text: 'Save and compare multiple strategy versions' },
    ],
    href: '/strategy-lab',
    cta: 'Open Strategy Lab',
    mockupLines: [
      { label: 'Strategy', value: 'London Breakout', sub: 'Version 3', color: '#E53935' },
      { label: 'Target RR', value: '1 : 2.5', sub: '68% hit rate', color: '#2E7D32' },
      { label: 'Session', value: '08:00 – 11:00', sub: 'London open', color: '#E53935' },
      { label: 'Consistency', value: '91%', sub: 'Rules followed', color: '#00B4D8' },
    ],
  },
  {
    id: 'trader-dna',
    icon: Dna,
    accentColor: '#00B4D8',
    bgColor: 'rgba(0,180,216,0.12)',
    label: 'Trader DNA',
    headline: 'Understand who you are as a trader',
    body: 'A 12-minute AI-powered assessment reveals your psychological trading profile — risk appetite, emotional triggers, decision-making style, and discipline tendencies. Every feature on the platform then personalises itself to your DNA.',
    features: [
      { icon: Activity, text: '12-minute scientifically-backed assessment' },
      { icon: Target, text: 'Risk tolerance and emotional trigger mapping' },
      { icon: Clock, text: 'Decision-making style classification' },
      { icon: TrendingUp, text: 'Personalises your coaching and alerts' },
    ],
    href: '/trader-dna',
    cta: 'Take the Assessment',
    mockupLines: [
      { label: 'Profile', value: 'Analytical', sub: 'Data-driven decisions', color: '#00B4D8' },
      { label: 'Risk Tolerance', value: 'Moderate', sub: '1–2% per trade', color: '#2E7D32' },
      { label: 'Weak spot', value: 'Revenge trading', sub: 'After losing days', color: '#E53935' },
      { label: 'Strength', value: 'Patience', sub: 'Waits for confirmation', color: '#00B4D8' },
    ],
  },
]

// ── data connection options ───────────────────────────────────────────────────
const connections = [
  {
    icon: Link2,
    title: 'MT5 Read-Only',
    description:
      'Connect your MetaTrader 5 account with read-only credentials. We can view your trades — we cannot place, modify, or close any positions.',
    badge: 'Recommended',
    badgeColor: '#00B4D8',
  },
  {
    icon: Upload,
    title: 'CSV Import',
    description:
      'Export your trade history from any broker as a CSV file and import it directly. Works with MT4, MT5, cTrader, Tradovate, and most other platforms.',
    badge: 'Universal',
    badgeColor: '#8A2BE2',
  },
  {
    icon: PenTool,
    title: 'Manual Entry',
    description:
      'Enter trades one by one directly in the journal. Perfect for traders who want full control or who trade on platforms without export support.',
    badge: 'Always available',
    badgeColor: '#E53935',
  },
]

// ── stat bar ─────────────────────────────────────────────────────────────────
const stats = [
  { value: '10k+', label: 'Active traders' },
  { value: '2.4M', label: 'Trades analysed' },
  { value: '78%', label: 'Report better discipline' },
  { value: '12 min', label: 'To your first insight' },
]

// ── page ──────────────────────────────────────────────────────────────────────
export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1C]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 md:py-32">
        {/* subtle grid overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60 uppercase tracking-widest">
            The Platform
          </span>
          <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-bold tracking-tighter text-white md:text-6xl">
            Every tool a serious trader needs — in one place
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60">
            Dashboard, Trade Journal, Strategy Lab, and Trader DNA work together
            as a unified intelligence layer on top of your trading — no broker
            switch required.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="gap-2 bg-[#E53935] hover:bg-[#C62828] text-white px-8">
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
                See Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <section className="border-y border-white/8 bg-white/3">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tool sections ────────────────────────────────────────────────── */}
      {tools.map((tool, index) => {
        const isEven = index % 2 === 0
        return (
          <section
            key={tool.id}
            className={`py-20 md:py-28 ${isEven ? 'bg-[#0A0F1C]' : 'bg-[#0d1424]'}`}
          >
            <div className="container mx-auto px-4">
              <div
                className={`flex flex-col gap-16 lg:flex-row lg:items-center ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Text side */}
                <div className="flex-1 space-y-6">
                  {/* Label pill */}
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                    style={{ background: tool.bgColor, color: tool.accentColor }}
                  >
                    <tool.icon className="h-3.5 w-3.5" />
                    {tool.label}
                  </span>

                  <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                    {tool.headline}
                  </h2>
                  <p className="text-lg text-white/60 leading-relaxed">{tool.body}</p>

                  {/* Feature list */}
                  <ul className="space-y-3">
                    {tool.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <span
                          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                          style={{ background: tool.bgColor }}
                        >
                          <f.icon className="h-3.5 w-3.5" style={{ color: tool.accentColor }} />
                        </span>
                        <span className="text-sm text-white/70">{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={tool.href}>
                    <Button
                      size="lg"
                      className="mt-2 gap-2 text-white"
                      style={{ background: tool.accentColor }}
                    >
                      {tool.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Mockup card side */}
                <div className="flex-1 lg:max-w-md">
                  <div className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 shadow-2xl">
                    {/* window chrome */}
                    <div className="mb-5 flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-white/10" />
                      <span className="h-3 w-3 rounded-full bg-white/10" />
                      <span className="h-3 w-3 rounded-full bg-white/10" />
                      <span
                        className="ml-2 text-xs font-medium"
                        style={{ color: tool.accentColor }}
                      >
                        {tool.label}
                      </span>
                    </div>

                    {/* stat rows */}
                    <div className="space-y-3">
                      {tool.mockupLines.map((line, li) => (
                        <div
                          key={li}
                          className="flex items-center justify-between rounded-xl border border-white/6 bg-white/4 px-4 py-3"
                        >
                          <div>
                            <p className="text-xs text-white/40">{line.label}</p>
                            {line.sub && (
                              <p className="text-xs text-white/30 mt-0.5">{line.sub}</p>
                            )}
                          </div>
                          <span
                            className="text-lg font-bold"
                            style={{ color: line.color ?? tool.accentColor }}
                          >
                            {line.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* progress bar decoration */}
                    <div className="mt-5 h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${60 + index * 8}%`,
                          background: tool.accentColor,
                        }}
                      />
                    </div>
                    <p className="mt-2 text-right text-xs text-white/30">
                      {60 + index * 8}% profile complete
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* ── How to connect your data ─────────────────────────────────────── */}
      <section className="bg-[#0B0B0B] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Connect your trading data — your way
            </h2>
            <p className="text-lg text-white/50">
              Three flexible options so no trader is left out, regardless of broker or platform.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {connections.map((conn) => (
              <div
                key={conn.title}
                className="relative flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/4 p-6 hover:border-white/20 transition-colors"
              >
                {/* badge */}
                <span
                  className="absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{
                    background: `${conn.badgeColor}22`,
                    color: conn.badgeColor,
                  }}
                >
                  {conn.badge}
                </span>

                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: `${conn.badgeColor}18` }}
                >
                  <conn.icon className="h-5 w-5" style={{ color: conn.badgeColor }} />
                </span>

                <h3 className="text-lg font-semibold text-white">{conn.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{conn.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's included checklist ─────────────────────────────────────── */}
      <section className="bg-[#0A0F1C] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                  Everything you need. Nothing you don't.
                </h2>
                <p className="mb-8 text-lg text-white/50">
                  The Free plan gets you started immediately. Upgrade to Pro when you're ready
                  to unlock the full intelligence stack.
                </p>
                <Link href="/signup">
                  <Button size="lg" className="gap-2 bg-[#E53935] hover:bg-[#C62828] text-white px-8">
                    Start for Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  'Trade Journal with AI reflections',
                  'Trader DNA assessment',
                  'Real-time Edge Score',
                  'Risk Guardian alerts',
                  'Strategy Lab simulator',
                  'MT5 & CSV data import',
                  'Emotional pattern detection',
                  'Progress leaderboard',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#E53935]" />
                    <span className="text-sm text-white/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-white/8 bg-[#0B0B0B] py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Ready to trade with clarity?
          </h2>
          <p className="mb-8 text-lg text-white/50">
            Join thousands of traders using ProStep2Market to build discipline and consistency.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="gap-2 bg-[#E53935] hover:bg-[#C62828] text-white px-10">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white/70 hover:text-white hover:border-white/50 px-10"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
