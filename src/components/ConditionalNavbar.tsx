'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/landing/Navbar'

// Routes where the landing Navbar should NOT appear
// (they have their own app header via DashboardLayoutClient)
const DASHBOARD_PREFIXES = [
  '/dashboard',
  '/journal',
  '/strategy-lab',
  '/trader-dna',
  '/education',
  '/analysis',
  '/profile',
  '/admin',
]

export function ConditionalNavbar() {
  const pathname = usePathname()
  const isDashboard = DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  )
  if (isDashboard) return null
  return <Navbar />
}
