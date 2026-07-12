'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Sparkles, ChevronDown, ChevronRight, Menu, X, Search, ExternalLink } from 'lucide-react'
import Fuse from 'fuse.js'
import { DOCS_SEARCH_INDEX } from './search-index'

interface NavItem { label: string; href: string }

interface NavSection { title: string; items: NavItem[] }

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Overview', href: '/docs' },
      { label: 'Account Setup', href: '/docs/getting-started' },
      { label: 'Connect MT5', href: '/docs/getting-started/connect-mt5' },
      { label: 'First Journal Entry', href: '/docs/getting-started/first-journal' },
      { label: 'DNA Assessment', href: '/docs/getting-started/assessment' },
    ],
  },
  {
    title: 'User Guides',
    items: [
      { label: 'Dashboard', href: '/docs/guides/dashboard' },
      { label: 'Journaling', href: '/docs/guides/journaling' },
      { label: 'Edge Score', href: '/docs/guides/edge-score' },
      { label: 'Risk Guardian', href: '/docs/guides/risk-guardian' },
      { label: 'Trader DNA', href: '/docs/guides/trader-dna' },
      { label: 'Analytics', href: '/docs/guides/analytics' },
      { label: 'Strategy Lab', href: '/docs/guides/strategy-lab' },
      { label: 'Education', href: '/docs/guides/education' },
    ],
  },
  {
    title: 'Admin Guides',
    items: [
      { label: 'Admin Overview', href: '/docs/admin/overview' },
      { label: 'User Management', href: '/docs/admin/user-management' },
      { label: 'Security & Compliance', href: '/docs/admin/security-compliance' },
      { label: 'Billing', href: '/docs/admin/billing' },
    ],
  },
  {
    title: 'API Docs',
    items: [
      { label: 'API Overview', href: '/docs/api/overview' },
      { label: 'Authentication', href: '/docs/api/auth' },
      { label: 'Trades API', href: '/docs/api/trades' },
      { label: 'Analytics API', href: '/docs/api/analytics' },
      { label: 'Webhooks', href: '/docs/api/webhooks' },
      { label: 'SDKs', href: '/docs/api/sdks' },
      { label: 'Changelog', href: '/docs/api/changelog' },
    ],
  },
  {
    title: 'Tutorials',
    items: [
      { label: 'Tutorials Hub', href: '/docs/tutorials' },
      { label: 'Best Practices', href: '/docs/tutorials/best-practices' },
      { label: 'CSV Import Guide', href: '/docs/tutorials/csv-import' },
      { label: 'Performance Analysis', href: '/docs/tutorials/performance-analysis' },
      { label: 'Troubleshooting', href: '/docs/tutorials/troubleshooting' },
      { label: 'FAQ', href: '/docs/tutorials/faq' },
    ],
  },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function useHeadings(pathname: string): { text: string; id: string; level: number }[] {
  const [headings, setHeadings] = useState<{ text: string; id: string; level: number }[]>([])

  useEffect(() => {
    const el = document.querySelector('[data-content]')
    if (!el) { setHeadings([]); return }

    const queryHeadings = () => {
      const elements = Array.from(el.querySelectorAll<HTMLElement>('h2, h3'))
      const result = elements.map(h => {
        const text = h.textContent?.trim() ?? ''
        const id = slugify(text)
        h.id = id
        return { text, id, level: h.tagName === 'H2' ? 2 : 3 }
      })
      setHeadings(result)
    }

    queryHeadings()
    const observer = new MutationObserver(queryHeadings)
    observer.observe(el, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [pathname])

  return headings
}

function DocSidebar({ isOpen, onClose, pathname }: { isOpen: boolean; onClose: () => void; pathname: string }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    NAV_SECTIONS.forEach(s => {
      initial[s.title] = s.items.some(i => pathname === i.href || pathname.startsWith(i.href + '/'))
    })
    return initial
  })

  const sidebar = (
    <nav className="py-4 px-3 space-y-1">
      {NAV_SECTIONS.map((section) => {
        const isOpen = expanded[section.title]
        const hasActive = section.items.some(i => pathname === i.href)
        return (
          <div key={section.title}>
            <button
              onClick={() => setExpanded(p => ({ ...p, [section.title]: !p[section.title] }))}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-widest transition-colors',
                hasActive ? 'text-[#fcd535]' : 'text-white/60 hover:text-white/60'
              )}
            >
              {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              <span className="flex-1 text-left">{section.title}</span>
            </button>
            {isOpen && (
              <div className="ml-2 mt-0.5 space-y-0.5">
                {section.items.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        active ? 'bg-[#fcd535]/10 text-[#fcd535]' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )

  return (
    <>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0 border-r border-white/10 bg-[#0b0e11] overflow-y-auto">
        <div className="flex h-14 items-center px-4 border-b border-white/10">
          <Link href="/docs" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#fcd535]" />
            <span className="text-sm font-bold text-white">Docs</span>
          </Link>
        </div>
        {sidebar}
      </aside>
      {isOpen && (
        <div className="fixed inset-0 z-[400] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#0b0e11] overflow-y-auto z-[400]">
            <div className="flex h-14 items-center justify-between px-4 border-b border-white/10">
              <Link href="/docs" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#fcd535]" />
                <span className="text-sm font-bold text-white">Docs</span>
              </Link>
              <button onClick={onClose} className="p-1 rounded-md hover:bg-white/10 text-white/60">
                <X className="h-5 w-5" />
              </button>
            </div>
            {sidebar}
          </aside>
        </div>
      )}
    </>
  )
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const headings = useHeadings(pathname)

  const fuse = useMemo(() => new Fuse(DOCS_SEARCH_INDEX, {
    keys: ['title', 'section', 'excerpt'],
    threshold: 0.4,
    includeScore: true,
  }), [])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    return fuse.search(searchQuery).slice(0, 8).map(r => r.item)
  }, [searchQuery, fuse])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="flex min-h-screen bg-[#0b0e11]">
      <DocSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} pathname={pathname} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex h-14 items-center gap-3 border-b border-white/10 bg-[#0b0e11] px-4 lg:px-8">
          <button type="button" onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-md hover:bg-white/10 text-white/60">
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative flex-1 max-w-md" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowResults(true) }}
              onFocus={() => setShowResults(true)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 pl-10 text-sm text-white placeholder:text-white/50 outline-none focus:border-[#fcd535]/50 transition-colors"
            />
            {showResults && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-white/10 bg-[#1e2329] shadow-xl z-[100] max-h-80 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-white/60">No results found</div>
                ) : (
                  searchResults.map((result) => (
                    <Link
                      key={result.path}
                      href={result.path}
                      onClick={() => { setShowResults(false); setSearchQuery('') }}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                    >
                      <ExternalLink className="h-4 w-4 text-[#fcd535] mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{result.title}</p>
                        <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{result.excerpt}</p>
                        <span className="text-[10px] text-[#fcd535]/60 uppercase tracking-wider">{result.section}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </header>
        <div className="flex flex-1">
          <div id="main-content" className="flex-1 min-w-0 p-6 lg:p-10 max-w-4xl" data-content>
            {children}
          </div>
          <aside className="hidden xl:block w-56 shrink-0 border-l border-white/10 p-6">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">On this page</p>
            {headings.length > 0 && (
              <nav className="space-y-2 text-sm text-white/50">
                {headings.map((h) => (
                  <p
                    key={h.id}
                    onClick={() => {
                      const target = document.getElementById(h.id)
                      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className={cn(
                      'hover:text-white cursor-pointer transition-colors',
                      h.level === 3 && 'pl-3 text-xs'
                    )}
                  >
                    {h.text}
                  </p>
                ))}
              </nav>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
