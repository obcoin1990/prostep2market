'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  LogOut,
  Globe,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'
import type { User } from '@supabase/supabase-js'

export function Navbar() {
  const [openMenu, setOpenMenu] = useState<'platform' | 'intelligence' | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<'platform' | 'intelligence' | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const langMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { t, locale, setLocale, localeList } = useLanguage()

  /* ── Auth state ── */
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  /* ── Close nav dropdowns on outside click ── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  /* ── Close user dropdown on outside click ── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  /* ── Close language dropdown on outside click ── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) setLangMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setUserMenuOpen(false)
    setMobileOpen(false)
    router.push('/')
  }

  /* Display name: full_name → name → email prefix */
  const displayName = user
    ? (user.user_metadata?.full_name as string | undefined)
      ?? (user.user_metadata?.name as string | undefined)
      ?? user.email?.split('@')[0]
      ?? t('nav.account')
    : null

  const navLinkStyle = { color: '#eaecef', fontSize: '14px', fontWeight: 500 }

  /* ── Mega-menu data (translated) ── */
  const platformItems = [
    { href: '/dashboard',    icon: LayoutDashboard, label: t('nav.dashboard'),    desc: t('nav.dashboardDesc') },
    { href: '/journal',      icon: BookMarked,       label: t('nav.tradeJournal'), desc: t('nav.tradeJournalDesc') },
    { href: '/strategy-lab', icon: FlaskConical,     label: t('nav.strategyLab'), desc: t('nav.strategyLabDesc') },
    { href: '/trader-dna',   icon: Dna,              label: t('nav.traderDna'),   desc: t('nav.traderDnaDesc') },
  ]
  const intelligenceItems = [
    { href: '/analysis',             icon: Sparkles,   label: t('nav.aiAnalysis'),   desc: t('nav.aiAnalysisDesc') },
    { href: '/risk-guardian',        icon: ShieldAlert, label: t('nav.riskGuardian'), desc: t('nav.riskGuardianDesc') },
    { href: '/dashboard#edge-score', icon: Trophy,      label: t('nav.edgeScore'),    desc: t('nav.edgeScoreDesc') },
  ]

  /* ── Micro dropdown ── */
  function MicroDropdown({ items, visible }: { items: typeof platformItems; visible: boolean }) {
    return (
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-[8px] shadow-2xl transition-all duration-150 ${
          visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
        style={{ backgroundColor: '#1e2329', border: '1px solid #2b3139' }}
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
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px]" style={{ backgroundColor: 'rgba(252,213,53,0.12)' }}>
                <item.icon className="h-4 w-4" style={{ color: '#fcd535' }} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium truncate" style={{ color: '#ffffff' }}>{item.label}</span>
                <span className="block text-xs truncate" style={{ color: '#707a8a' }}>{item.desc}</span>
              </span>
              <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#707a8a' }} />
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50"
      style={{ backgroundColor: '#0b0e11', borderBottom: '1px solid #2b3139', height: '64px' }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
          <span className="text-xl font-bold tracking-tight" style={{ color: '#fcd535', fontFamily: 'var(--font-sans)' }}>P2M</span>
          <span className="text-sm font-medium hidden sm:block" style={{ color: '#707a8a' }}>ProStep2Market</span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-1">

          {/* Platform */}
          <div className="relative" onMouseEnter={() => setOpenMenu('platform')} onMouseLeave={() => setOpenMenu(null)}>
            <div className="flex items-center rounded-[6px] transition-colors" style={openMenu === 'platform' ? { backgroundColor: '#1e2329' } : {}}>
              <Link href="/platform" className="px-3 py-2 text-sm font-medium transition-colors" style={navLinkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#eaecef')}
              >
                {t('nav.platform')}
              </Link>
              <button className="pr-2.5 py-2 transition-colors" style={{ color: '#707a8a' }}
                onClick={() => setOpenMenu(p => p === 'platform' ? null : 'platform')}
                aria-label="Open Platform menu"
              >
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${openMenu === 'platform' ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <MicroDropdown items={platformItems} visible={openMenu === 'platform'} />
          </div>

          {/* Intelligence */}
          <div className="relative" onMouseEnter={() => setOpenMenu('intelligence')} onMouseLeave={() => setOpenMenu(null)}>
            <div className="flex items-center rounded-[6px] transition-colors" style={openMenu === 'intelligence' ? { backgroundColor: '#1e2329' } : {}}>
              <Link href="/intelligence" className="px-3 py-2 text-sm font-medium transition-colors" style={navLinkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#eaecef')}
              >
                {t('nav.intelligence')}
              </Link>
              <button className="pr-2.5 py-2 transition-colors" style={{ color: '#707a8a' }}
                onClick={() => setOpenMenu(p => p === 'intelligence' ? null : 'intelligence')}
                aria-label="Open Intelligence menu"
              >
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${openMenu === 'intelligence' ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <MicroDropdown items={intelligenceItems} visible={openMenu === 'intelligence'} />
          </div>

          <Link href="/education" className="px-3 py-2 rounded-[6px] text-sm font-medium transition-colors" style={navLinkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.backgroundColor = '#1e2329' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#eaecef'; e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            {t('nav.education')}
          </Link>

          <Link href="/pricing" className="px-3 py-2 rounded-[6px] text-sm font-medium transition-colors" style={navLinkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.backgroundColor = '#1e2329' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#eaecef'; e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            {t('nav.pricing')}
          </Link>
        </nav>

        {/* ── Desktop right side ── */}
        <div className="hidden md:flex items-center gap-2">

          {/* ── Language switcher ── */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setLangMenuOpen(p => !p)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-[6px] text-sm font-medium transition-colors"
              style={{ color: '#eaecef' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.backgroundColor = '#1e2329' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#eaecef'; e.currentTarget.style.backgroundColor = 'transparent' }}
              aria-label={t('nav.language')}
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase">{locale}</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${langMenuOpen ? 'rotate-180' : ''}`} style={{ color: '#707a8a' }} />
            </button>

            <div
              className={`absolute right-0 top-full mt-2 w-44 rounded-[8px] shadow-2xl transition-all duration-150 ${
                langMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
              }`}
              style={{ backgroundColor: '#1e2329', border: '1px solid #2b3139' }}
            >
              <div className="p-1 space-y-0.5">
                {localeList.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLocale(l.code); setLangMenuOpen(false) }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-[6px] text-sm transition-colors text-left"
                    style={{ color: l.code === locale ? '#fcd535' : '#eaecef', backgroundColor: l.code === locale ? 'rgba(252,213,53,0.08)' : 'transparent' }}
                    onMouseEnter={e => { if (l.code !== locale) e.currentTarget.style.backgroundColor = '#2b3139' }}
                    onMouseLeave={e => { if (l.code !== locale) e.currentTarget.style.backgroundColor = 'transparent' }}
                    dir={l.dir}
                  >
                    <span>{l.flag}</span>
                    <span className="flex-1">{l.native}</span>
                    {l.code === locale && <span className="text-xs" style={{ color: '#fcd535' }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {user ? (
            /* ── Logged-in: username button + dropdown ── */
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(p => !p)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] text-sm font-medium transition-colors"
                style={{ color: '#eaecef' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.backgroundColor = '#1e2329' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#eaecef'; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: '#fcd535', color: '#181a20' }}>
                  {displayName?.charAt(0).toUpperCase()}
                </span>
                {displayName}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`} style={{ color: '#707a8a' }} />
              </button>

              <div
                className={`absolute right-0 top-full mt-2 w-44 rounded-[8px] shadow-2xl transition-all duration-150 ${
                  userMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
                }`}
                style={{ backgroundColor: '#1e2329', border: '1px solid #2b3139' }}
              >
                <div className="p-1.5 space-y-0.5">
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-[6px] text-sm transition-colors"
                    style={{ color: '#eaecef' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2b3139'; e.currentTarget.style.color = '#ffffff' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#eaecef' }}
                  >
                    <LayoutDashboard className="h-4 w-4 shrink-0" style={{ color: '#fcd535' }} />
                    {t('nav.dashboard')}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-[6px] text-sm transition-colors"
                    style={{ color: '#eaecef' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2b3139'; e.currentTarget.style.color = '#f6465d' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#eaecef' }}
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {t('nav.signout')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ── Logged-out: Log In + Sign Up ── */
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-[6px] text-sm font-medium transition-colors"
                style={{ color: '#eaecef' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.backgroundColor = '#1e2329' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#eaecef'; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {t('nav.login')}
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 rounded-full text-sm font-semibold transition-colors"
                style={{ backgroundColor: '#fcd535', color: '#181a20' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0b90b')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fcd535')}
              >
                {t('nav.signup')}
              </Link>
            </>
          )}
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
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile full-screen menu ── */}
      {mobileOpen && (
        <div className="md:hidden" style={{ backgroundColor: '#0b0e11', borderTop: '1px solid #2b3139' }}>
          <nav className="max-w-[1280px] mx-auto px-4 py-3 space-y-0.5">

            {/* Platform accordion */}
            <button
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-[6px] text-sm font-medium transition-colors"
              style={{ color: '#eaecef' }}
              onClick={() => setMobileExpanded(p => p === 'platform' ? null : 'platform')}
            >
              {t('nav.platform')}
              <ChevronDown className={`h-4 w-4 transition-transform duration-150 ${mobileExpanded === 'platform' ? 'rotate-180' : ''}`} style={{ color: '#707a8a' }} />
            </button>
            {mobileExpanded === 'platform' && (
              <div className="ml-3 space-y-0.5 pl-3" style={{ borderLeft: '1px solid #2b3139' }}>
                {platformItems.map(item => (
                  <Link key={item.href} href={item.href}
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
              {t('nav.intelligence')}
              <ChevronDown className={`h-4 w-4 transition-transform duration-150 ${mobileExpanded === 'intelligence' ? 'rotate-180' : ''}`} style={{ color: '#707a8a' }} />
            </button>
            {mobileExpanded === 'intelligence' && (
              <div className="ml-3 space-y-0.5 pl-3" style={{ borderLeft: '1px solid #2b3139' }}>
                {intelligenceItems.map(item => (
                  <Link key={item.href} href={item.href}
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

            <Link href="/education" className="block px-3 py-2.5 rounded-[6px] text-sm font-medium transition-colors" style={{ color: '#eaecef' }} onClick={() => setMobileOpen(false)}>
              {t('nav.education')}
            </Link>
            <Link href="/pricing" className="block px-3 py-2.5 rounded-[6px] text-sm font-medium transition-colors" style={{ color: '#eaecef' }} onClick={() => setMobileOpen(false)}>
              {t('nav.pricing')}
            </Link>

            {/* Mobile language selector */}
            <div className="pt-2" style={{ borderTop: '1px solid #2b3139' }}>
              <p className="px-3 py-1 text-xs font-semibold uppercase" style={{ color: '#707a8a' }}>{t('nav.language')}</p>
              <div className="grid grid-cols-3 gap-1 px-1 py-1">
                {localeList.map(l => (
                  <button
                    key={l.code}
                    onClick={() => setLocale(l.code)}
                    className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-[6px] text-xs transition-colors"
                    style={{
                      color: l.code === locale ? '#fcd535' : '#eaecef',
                      backgroundColor: l.code === locale ? 'rgba(252,213,53,0.10)' : 'transparent',
                      border: l.code === locale ? '1px solid rgba(252,213,53,0.30)' : '1px solid transparent',
                    }}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span>{l.native}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile CTAs */}
            <div className="pt-3 pb-1 space-y-1" style={{ borderTop: '1px solid #2b3139', marginTop: '8px' }}>
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: '#fcd535', color: '#181a20' }}>
                      {displayName?.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium" style={{ color: '#ffffff' }}>{displayName}</span>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-[6px] text-sm font-medium transition-colors"
                    style={{ color: '#eaecef' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e2329')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LayoutDashboard className="h-4 w-4" style={{ color: '#fcd535' }} />
                    {t('nav.dashboard')}
                  </Link>
                  <button onClick={handleSignOut}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-[6px] text-sm font-medium transition-colors"
                    style={{ color: '#f6465d' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e2329')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut className="h-4 w-4" />
                    {t('nav.signout')}
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-[6px] text-sm font-medium transition-colors"
                    style={{ color: '#eaecef', border: '1px solid #2b3139' }}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                    style={{ backgroundColor: '#fcd535', color: '#181a20' }}
                  >
                    {t('nav.signup')}
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
