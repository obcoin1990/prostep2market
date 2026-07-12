import { cn } from '@/lib/utils'

type StatusVariant = 'active' | 'warning' | 'danger' | 'idle' | 'success' | 'info'

interface StatusBadgeProps {
  label: string
  variant: StatusVariant
  className?: string
}

const variants: Record<StatusVariant, string> = {
  active:  'bg-[#0ecb81]/15 text-[#0ecb81] border-[#0ecb81]/30',
  warning: 'bg-[#FFC107]/15 text-[#FFC107] border-[#FFC107]/30',
  danger:  'bg-[#f6465d]/15 text-[#f6465d] border-[#f6465d]/30',
  idle:    'bg-white/5 text-white/60 border-white/10',
  success: 'bg-[#0ecb81]/15 text-[#0ecb81] border-[#0ecb81]/30',
  info:    'bg-[#00B4D8]/15 text-[#00B4D8] border-[#00B4D8]/30',
}

export function StatusBadge({ label, variant, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
      variants[variant],
      className
    )}>
      <span className={cn(
        'h-1.5 w-1.5 rounded-full',
        variant === 'active' && 'bg-[#0ecb81]',
        variant === 'warning' && 'bg-[#FFC107]',
        variant === 'danger' && 'bg-[#f6465d]',
        variant === 'idle' && 'bg-white/20',
        variant === 'success' && 'bg-[#0ecb81]',
        variant === 'info' && 'bg-[#00B4D8]',
      )} />
      {label}
    </span>
  )
}
