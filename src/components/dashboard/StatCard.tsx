import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: { value: number; positive: boolean }
  variant?: 'default' | 'compact'
  className?: string
}

export function StatCard({ label, value, icon: Icon, trend, variant = 'default', className }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm',
      variant === 'compact' && 'p-4',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider">{label}</p>
          <p className={cn(
            'text-2xl font-bold text-white',
            variant === 'compact' && 'text-xl'
          )}>{value}</p>
          {trend && (
            <p className={cn(
              'text-xs font-medium flex items-center gap-1',
              trend.positive ? 'text-[#0ecb81]' : 'text-[#f6465d]'
            )}>
              <span>{trend.positive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}% vs last period</span>
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
            <Icon className="h-5 w-5 text-white/70" />
          </div>
        )}
      </div>
    </div>
  )
}
