'use client'

import { ThemeProvider } from '@/context/ThemeContext'

// NextAuth SessionProvider removed — Supabase Auth is the single identity provider.
// Session state is read via supabase.auth.getUser() (server) or
// useSupabaseSession() hook (client components).
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
