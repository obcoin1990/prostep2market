'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/landing/Navbar'

const DASHBOARD_PREFIXES = [
  '/dashboard',
  '/journal',
  '/strategy-lab',
  '/trader-dna',
  '/education',
  '/analysis',
  '/profile',
  '/admin',
  '/user',
  '/analytics',
  '/team',
  '/risk-guardian',
  '/connections',
]

export function ConditionalNavbar() {
  const pathname = usePathname()
  const isDashboard = DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  )
  if (isDashboard) return null
  return <Navbar />
}
