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

// ── Mega-menu data ──────────────────────────────────────────────
const platformItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', desc: 'Overview of your trading stats' },
  { href: '/journal', icon: BookMarked, label: 'Trade Journal', desc: 'Log trades, emotions & screenshots' },
  { href: '/strategy-lab', icon: FlaskConical, label: 'Strategy Lab', desc: 'Simulate & build trading strategies' },
  { href: '/trader-dna', icon: Dna, label: 'Trader DNA', desc: 'Discover your psychological profile' },
]

const intelligenceItems = [
  { href: '/analysis', icon: Sparkles, label: 'AI Analysis', desc: 'Trade quality & emotional scoring' },
  { href: '/risk-guardian', icon: ShieldAlert, label: 'Risk Guardian', desc: 'Real-time behavioral alerts' },
  { href: '/dashboard#edge-score', icon: Trophy, label: 'Edge Score', desc: 'Gamified discipline tracking' },
]

type DropdownItem = { href: string; icon: React.ElementType; label: string; desc: string }

function MicroDropdown({ items, visible }: { items: DropdownItem[]; visible: boolean }) {
  return (
    <div
      className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-60 rounded-xl border border-white/10 bg-[#0f0f0f] shadow-2xl transition-all duration-150 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
      }`}
    >
      <div className="p-1.5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-white/8 group transition-colors"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#E53935]/15 group-hover:bg-[#E53935]/25 transition-colors">
              <item.icon className="h-3.5 w-3.5 text-[#E53935]" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-xs font-medium text-white truncate">{item.label}</span>
              <span className="block text-[11px] text-white/40 truncate">{item.desc}</span>
            </span>
            <ChevronRight className="h-3 w-3 text-white/20 group-hover:text-white/40 transition-colors shrink-0" />
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

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 bg-[rgba(10,10,10,0.94)] backdrop-blur-[12px] border-b border-white/[0.07]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-10">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-sm font-bold text-white tracking-tight leading-none">
              ProStep<span className="text-[#E53935]">2</span>Market
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">

            {/* Platform */}
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu('platform')}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <div className={`flex items-center rounded-md transition-colors ${openMenu === 'platform' ? 'bg-white/8' : 'hover:bg-white/5'}`}>
                <Link
                  href="/platform"
                  className="px-2.5 py-1.5 text-xs font-medium text-white/60 hover:text-white transition-colors"
                >
                  Platform
                </Link>
                <button
                  className="pr-2 py-1.5 text-white/40 hover:text-white transition-colors"
                  onClick={() => setOpenMenu(p => p === 'platform' ? null : 'platform')}
                  aria-label="Open Platform menu"
                >
                  <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${openMenu === 'platform' ? 'rotate-180' : ''}`} />
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
              <div className={`flex items-center rounded-md transition-colors ${openMenu === 'intelligence' ? 'bg-white/8' : 'hover:bg-white/5'}`}>
                <Link
                  href="/intelligence"
                  className="px-2.5 py-1.5 text-xs font-medium text-white/60 hover:text-white transition-colors"
                >
                  Intelligence
                </Link>
                <button
                  className="pr-2 py-1.5 text-white/40 hover:text-white transition-colors"
                  onClick={() => setOpenMenu(p => p === 'intelligence' ? null : 'intelligence')}
                  aria-label="Open Intelligence menu"
                >
                  <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${openMenu === 'intelligence' ? 'rotate-180' : ''}`} />
                </button>
              </div>
              <MicroDropdown items={intelligenceItems} visible={openMenu === 'intelligence'} />
            </div>

            <Link href="/education" className="px-2.5 py-1.5 rounded-md text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors">
              Education
            </Link>
            <Link href="/pricing" className="px-2.5 py-1.5 rounded-md text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-1.5">
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-white/60 hover:text-white hover:bg-white/8 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#E53935] hover:bg-[#c62828] text-white transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 hover:bg-white/10 rounded-md"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.07] bg-[#0a0a0a]">
          <nav className="max-w-7xl mx-auto px-4 py-2 space-y-0.5">

            <button
              className="flex items-center justify-between w-full px-2.5 py-2 rounded-md text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMobileExpanded(p => p === 'platform' ? null : 'platform')}
            >
              Platform
              <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${mobileExpanded === 'platform' ? 'rotate-180' : ''}`} />
            </button>
            {mobileExpanded === 'platform' && (
              <div className="ml-3 space-y-0.5 border-l border-white/10 pl-3">
                {platformItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon className="h-3.5 w-3.5 text-[#E53935]" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <button
              className="flex items-center justify-between w-full px-2.5 py-2 rounded-md text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMobileExpanded(p => p === 'intelligence' ? null : 'intelligence')}
            >
              Intelligence
              <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${mobileExpanded === 'intelligence' ? 'rotate-180' : ''}`} />
            </button>
            {mobileExpanded === 'intelligence' && (
              <div className="ml-3 space-y-0.5 border-l border-white/10 pl-3">
                {intelligenceItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon className="h-3.5 w-3.5 text-[#E53935]" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <Link href="/education" className="block px-2.5 py-2 rounded-md text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setMobileOpen(false)}>
              Education
            </Link>
            <Link href="/pricing" className="block px-2.5 py-2 rounded-md text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setMobileOpen(false)}>
              Pricing
            </Link>

            <div className="pt-2 pb-1 flex gap-2 border-t border-white/[0.07] mt-1">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-3 py-1.5 rounded-md text-xs font-medium text-white/60 hover:text-white hover:bg-white/8 transition-colors">
                Sign In
              </Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-3 py-1.5 rounded-md text-xs font-semibold bg-[#E53935] hover:bg-[#c62828] text-white transition-colors">
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
