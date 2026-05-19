'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  BookMarked,
  FlaskConical,
  Dna,
  Sparkles,
  ShieldAlert,
  Trophy,
  ChevronRight,
} from 'lucide-react'

/* ── Mega-menu data ───────────────────────────────────────────── */
const platformItems = [
  { href: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard',    desc: 'Overview of your trading stats' },
  { href: '/journal',      icon: BookMarked,       label: 'Trade Journal', desc: 'Log trades, emotions & screenshots' },
  { href: '/strategy-lab', icon: FlaskConical,     label: 'Strategy Lab', desc: 'Simulate & build trading strategies' },
  { href: '/trader-dna',   icon: Dna,              label: 'Trader DNA',   desc: 'Discover your psychological profile' },
]

const intelligenceItems = [
  { href: '/analysis',              icon: Sparkles,   label: 'AI Analysis',   desc: 'Trade quality & emotional scoring' },
  { href: '/risk-guardian',         icon: ShieldAlert, label: 'Risk Guardian', desc: 'Real-time behavioral alerts' },
  { href: '/dashboard#edge-score',  icon: Trophy,      label: 'Edge Score',    desc: 'Gamified discipline tracking' },
]

type DropdownItem = { href: string; icon: React.ElementType; label: string; desc: string }

/* Binance-style dropdown: surface-card-dark bg, yellow icon accents */
function MicroDropdown({ items, visible }: { items: DropdownItem[]; visible: boolean }) {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-[8px] shadow-2xl transition-all duration-150 ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-1 pointer-events-none'
      }`}
      style={{
        backgroundColor: '#1e2329',
        border: '1px solid #2b3139',
      }}
    >
      <div className="p-1.5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-[6px] px-3 py-2.5 group transition-colors"
            style={{ color: '#eaecef' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2b3139')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {/* Yellow icon container */}
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px]"
              style={{ backgroundColor: 'rgba(252,213,53,0.12)' }}
            >
              <item.icon className="h-4 w-4" style={{ color: '#fcd535' }} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-medium truncate" style={{ color: '#ffffff' }}>
                {item.label}
              </span>
              <span className="block text-xs truncate" style={{ color: '#707a8a' }}>
                {item.desc}
              </span>
            </span>
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#707a8a' }} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export function Navbar() {
  const [openMenu, setOpenMenu] = useState<'platform' | 'intelligence' | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<'platform' | 'intelligence' | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navLinkStyle = {
    color: '#eaecef',
    fontSize: '14px',
    fontWeight: 500,
  }

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50"
      style={{
        backgroundColor: '#0b0e11',
        borderBottom: '1px solid #2b3139',
        height: '64px',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">

        {/* ── Logo — P2M in Binance Yellow ── */}
        <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: '#fcd535', fontFamily: 'var(--font-sans)' }}
          >
            P2M
          </span>
          <span className="text-sm font-medium hidden sm:block" style={{ color: '#707a8a' }}>
            ProStep2Market
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-1">

          {/* Platform */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu('platform')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div
              className="flex items-center rounded-[6px] transition-colors"
              style={openMenu === 'platform' ? { backgroundColor: '#1e2329' } : {}}
            >
              <Link
                href="/platform"
                className="px-3 py-2 text-sm font-medium transition-colors"
                style={navLinkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#eaecef')}
              >
                Platform
              </Link>
              <button
                className="pr-2.5 py-2 transition-colors"
                style={{ color: '#707a8a' }}
                onClick={() => setOpenMenu(p => p === 'platform' ? null : 'platform')}
                aria-label="Open Platform menu"
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-150 ${openMenu === 'platform' ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
            <MicroDropdown items={platformItems} visible={openMenu === 'platform'} />
          </div>

          {/* Intelligence */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu('intelligence')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div
              className="flex items-center rounded-[6px] transition-colors"
              style={openMenu === 'intelligence' ? { backgroundColor: '#1e2329' } : {}}
            >
              <Link
                href="/intelligence"
                className="px-3 py-2 text-sm font-medium transition-colors"
                style={navLinkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#eaecef')}
              >
                Intelligence
              </Link>
              <button
                className="pr-2.5 py-2 transition-colors"
                style={{ color: '#707a8a' }}
                onClick={() => setOpenMenu(p => p === 'intelligence' ? null : 'intelligence')}
                aria-label="Open Intelligence menu"
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-150 ${openMenu === 'intelligence' ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
            <MicroDropdown items={intelligenceItems} visible={openMenu === 'intelligence'} />
          </div>

          <Link
            href="/education"
            className="px-3 py-2 rounded-[6px] text-sm font-medium transition-colors"
            style={navLinkStyle}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.backgroundColor = '#1e2329'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#eaecef'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Education
          </Link>

          <Link
            href="/pricing"
            className="px-3 py-2 rounded-[6px] text-sm font-medium transition-colors"
            style={navLinkStyle}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.backgroundColor = '#1e2329'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#eaecef'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Pricing
          </Link>
        </nav>

        {/* ── Desktop CTAs ── */}
        <div className="hidden md:flex items-center gap-2">
          {/* Log In — tertiary text button */}
          <Link
            href="/login"
            className="px-4 py-2 rounded-[6px] text-sm font-medium transition-colors"
            style={{ color: '#eaecef' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.backgroundColor = '#1e2329'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#eaecef'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Log In
          </Link>

          {/* Sign Up — Binance Yellow primary pill */}
          <Link
            href="/signup"
            className="px-5 py-2 rounded-full text-sm font-semibold transition-colors"
            style={{
              backgroundColor: '#fcd535',
              color: '#181a20',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0b90b')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fcd535')}
          >
            Sign Up
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden p-2 rounded-[6px] transition-colors"
          style={{ color: '#eaecef' }}
          onClick={() => setMobileOpen(!mobileOpen)}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e2329')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          aria-label="Toggle menu"
        >
          {mobileOpen
            ? <X className="w-5 h-5" />
            : <Menu className="w-5 h-5" />
          }
        </button>
      </div>

      {/* ── Mobile full-screen menu ── */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            backgroundColor: '#0b0e11',
            borderTop: '1px solid #2b3139',
          }}
        >
          <nav className="max-w-[1280px] mx-auto px-4 py-3 space-y-0.5">

            {/* Platform accordion */}
            <button
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-[6px] text-sm font-medium transition-colors"
              style={{ color: '#eaecef' }}
              onClick={() => setMobileExpanded(p => p === 'platform' ? null : 'platform')}
            >
              Platform
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-150 ${mobileExpanded === 'platform' ? 'rotate-180' : ''}`}
                style={{ color: '#707a8a' }}
              />
            </button>
            {mobileExpanded === 'platform' && (
              <div className="ml-3 space-y-0.5 pl-3" style={{ borderLeft: '1px solid #2b3139' }}>
                {platformItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm transition-colors"
                    style={{ color: '#707a8a' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#707a8a')}
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon className="h-4 w-4" style={{ color: '#fcd535' }} />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Intelligence accordion */}
            <button
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-[6px] text-sm font-medium transition-colors"
              style={{ color: '#eaecef' }}
              onClick={() => setMobileExpanded(p => p === 'intelligence' ? null : 'intelligence')}
            >
              Intelligence
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-150 ${mobileExpanded === 'intelligence' ? 'rotate-180' : ''}`}
                style={{ color: '#707a8a' }}
              />
            </button>
            {mobileExpanded === 'intelligence' && (
              <div className="ml-3 space-y-0.5 pl-3" style={{ borderLeft: '1px solid #2b3139' }}>
                {intelligenceItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm transition-colors"
                    style={{ color: '#707a8a' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#707a8a')}
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon className="h-4 w-4" style={{ color: '#fcd535' }} />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/education"
              className="block px-3 py-2.5 rounded-[6px] text-sm font-medium transition-colors"
              style={{ color: '#eaecef' }}
              onClick={() => setMobileOpen(false)}
            >
              Education
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2.5 rounded-[6px] text-sm font-medium transition-colors"
              style={{ color: '#eaecef' }}
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>

            {/* Mobile CTAs */}
            <div className="flex gap-2 pt-3 pb-1" style={{ borderTop: '1px solid #2b3139', marginTop: '8px' }}>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-4 py-2 rounded-[6px] text-sm font-medium transition-colors"
                style={{ color: '#eaecef', border: '1px solid #2b3139' }}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                style={{ backgroundColor: '#fcd535', color: '#181a20' }}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
