'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface BrandingData {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  bgColor: string
  darkBgColor: string
  platformName: string
  logoUrl: string | null
  faviconUrl: string | null
  tagline: string | null
}

interface BrandingContextType {
  branding: BrandingData | null
  loading: boolean
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined)

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<BrandingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await fetch('/api/branding-css')
        if (!res.ok) {
          setLoading(false)
          return
        }
        const css = await res.text()

        const extractVar = (name: string): string => {
          const match = css.match(new RegExp(`--${name}:\\s*([^;]+)`))
          return match ? match[1].trim() : ''
        }
        const extractString = (name: string): string => {
          const match = css.match(new RegExp(`--${name}:\\s*"([^"]+)"`))
          return match ? match[1] : ''
        }
        const extractUrl = (name: string): string | null => {
          const match = css.match(new RegExp(`--${name}:\\s*url\\(([^)]+)\\)`))
          return match ? match[1] : null
        }

        const parsed: BrandingData = {
          primaryColor: extractVar('brand-primary'),
          secondaryColor: extractVar('brand-secondary'),
          accentColor: extractVar('brand-accent'),
          bgColor: extractVar('brand-bg'),
          darkBgColor: extractVar('brand-dark-bg'),
          platformName: extractString('brand-name'),
          logoUrl: extractUrl('brand-logo'),
          faviconUrl: extractUrl('brand-favicon'),
          tagline: extractString('brand-tagline') || null,
        }

        setBranding(parsed)
      } catch {
        setBranding(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBranding()
  }, [])

  return (
    <BrandingContext.Provider value={{ branding, loading }}>
      {children}
    </BrandingContext.Provider>
  )
}

export function useBranding() {
  const context = useContext(BrandingContext)
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider')
  }
  return context
}
