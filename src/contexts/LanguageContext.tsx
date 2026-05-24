'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations, LOCALES, type Locale } from '@/i18n/locales'

// ─── Types ────────────────────────────────────────────────────────────────────
type LanguageContextType = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string, vars?: Record<string, string>) => string
  isRTL: boolean
  localeList: typeof LOCALES
}

const LanguageContext = createContext<LanguageContextType | null>(null)

// ─── Helper: deep key accessor via dot-notation ────────────────────────────────
function deepGet(obj: Record<string, unknown>, path: string): string | undefined {
  const result = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
    return undefined
  }, obj)
  return typeof result === 'string' ? result : undefined
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  // Restore saved preference on mount (client-only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('p2m-locale') as Locale | null
      if (saved && saved in translations) setLocaleState(saved)
    } catch {
      // localStorage unavailable (SSR / private browsing) — keep default 'en'
    }
  }, [])

  // Persist preference + update <html> dir/lang attributes
  useEffect(() => {
    try {
      localStorage.setItem('p2m-locale', locale)
    } catch {
      // ignore
    }
    const info = LOCALES.find(l => l.code === locale)
    document.documentElement.lang = locale
    document.documentElement.dir = info?.dir ?? 'ltr'
  }, [locale])

  function setLocale(l: Locale) {
    setLocaleState(l)
  }

  const isRTL = locale === 'ar' || locale === 'ur'

  /**
   * t('nav.platform') → translated string
   * t('auth.sentConfirmation', { email: 'a@b.com' }) → interpolated string
   * Falls back to English, then to the key itself.
   */
  const t = useCallback(
    (key: string, vars?: Record<string, string>): string => {
      let value =
        deepGet(translations[locale] as Record<string, unknown>, key) ??
        deepGet(translations['en'] as Record<string, unknown>, key) ??
        key

      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          value = value.replace(`{${k}}`, v)
        }
      }
      return value
    },
    [locale]
  )

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRTL, localeList: LOCALES }}>
      {children}
    </LanguageContext.Provider>
  )
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within <LanguageProvider>')
  return ctx
}

/** Shorthand — most components only need the t() function */
export function useT(): LanguageContextType['t'] {
  return useLanguage().t
}
