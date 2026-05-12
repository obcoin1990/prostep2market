import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label:    string
  value:    string | number
  icon:     LucideIcon
  trend?:   number        // positive = green, negative = red
  color?:   'brand' | 'green' | 'yellow' | 'red'
  suffix?:  string
}

const COLOR_MAP = {
  brand:  { bg: 'bg-brand-50',  icon: 'text-brand-500',  text: 'text-brand-700' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-500',  text: 'text-green-700' },
  yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-500', text: 'text-yellow-700' },
  red:    { bg: 'bg-red-50',    icon: 'text-red-500',    text: 'text-red-700' },
}

export function StatCard({ label, value, icon: Icon, trend, color = 'brand', suffix }: StatCardProps) {
  const c = COLOR_MAP[color]

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {value}{suffix && <span className="text-base font-medium text-gray-500 ml-0.5">{suffix}</span>}
          </p>
          {trend !== undefined && (
            <p className={cn('mt-1 text-xs font-medium', trend >= 0 ? 'text-green-600' : 'text-red-600')}>
              {trend >= 0 ? '+' : ''}{trend}% vs last period
            </p>
          )}
        </div>
        <div className={cn('rounded-lg p-2.5', c.bg)}>
          <Icon className={cn('h-5 w-5', c.icon)} />
        </div>
      </div>
    </div>
  )
}
