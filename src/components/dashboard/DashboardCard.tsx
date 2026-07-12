import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DashboardCardProps {
  children: ReactNode
  className?: string
  padding?: 'normal' | 'compact' | 'none'
}

export function DashboardCard({ children, className, padding = 'normal' }: DashboardCardProps) {
  return (
    <div className={cn(
      'rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm',
      padding === 'normal' && 'p-5',
      padding === 'compact' && 'p-4',
      className
    )}>
      {children}
    </div>
  )
}

export function DashboardCardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function DashboardCardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-sm font-semibold text-white', className)}>{children}</h3>
}

export function DashboardCardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(className)}>{children}</div>
}
