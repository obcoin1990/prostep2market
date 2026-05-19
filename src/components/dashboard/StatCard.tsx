import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label:    string
  value:    string | number
  icon:     LucideIcon
  trend?:   number        // positive = trading-up green, negative = trading-down red
  color?:   'brand' | 'green' | 'yellow' | 'red'
  suffix?:  string
}

/** Icon container accent colors (Binance palette) */
const COLOR_MAP = {
  brand:  { bg: 'rgba(252,213,53,0.1)',  icon: '#fcd535' },
  green:  { bg: 'rgba(14,203,129,0.1)',  icon: '#0ecb81' },
  yellow: { bg: 'rgba(252,213,53,0.1)',  icon: '#fcd535' },
  red:    { bg: 'rgba(246,70,93,0.1)',   icon: '#f6465d' },
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color = 'brand',
  suffix,
}: StatCardProps) {
  const c = COLOR_MAP[color]

  return (
    <div
      className="rounded-[12px] p-5"
      style={{
        backgroundColor: '#1e2329',
        border: '1px solid #2b3139',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-medium uppercase tracking-wide truncate"
            style={{ color: '#707a8a' }}
          >
            {label}
          </p>
          <p
            className="mt-1.5 text-2xl font-bold"
            style={{
              color: '#ffffff',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '-0.3px',
            }}
          >
            {value}
            {suffix && (
              <span
                className="text-base font-medium ml-1"
                style={{ color: '#707a8a' }}
              >
                {suffix}
              </span>
            )}
          </p>
          {trend !== undefined && (
            <p
              className="mt-1.5 text-xs font-medium"
              style={{ color: trend >= 0 ? '#0ecb81' : '#f6465d' }}
            >
              {trend >= 0 ? '+' : ''}{trend}% vs last period
            </p>
          )}
        </div>

        {/* Icon badge */}
        <div
          className="rounded-[8px] p-2.5 flex-shrink-0 ml-3"
          style={{ backgroundColor: c.bg }}
        >
          <Icon className="h-5 w-5" style={{ color: c.icon }} />
        </div>
      </div>
    </div>
  )
}
