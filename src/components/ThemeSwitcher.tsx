'use client'

import { useTheme } from '@/context/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()

  return (
<button type="button" 
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-[hsl(var(--muted))]"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-[hsl(var(--foreground))]" />
      ) : (
        <Moon className="h-5 w-5 text-[hsl(var(--foreground))]" />
      )}
    </button>
  )
}
