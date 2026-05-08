'use client'

/**
 * Score Breakdown Component
 * Displays 5 component scores as horizontal progress bars
 * EDGE-06
 */

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { EdgeScoreBreakdown } from '@/lib/edge-score'

interface ScoreBreakdownProps {
  scores: Omit<EdgeScoreBreakdown, 'compositeScore'>
  showLabels?: boolean
  compact?: boolean
}

interface ScoreBarProps {
  label: string
  score: number
  color: string
  icon: string
  showLabel?: boolean
  compact?: boolean
}

const COMPONENT_CONFIG = [
  {
    key: 'disciplineScore' as const,
    label: 'Discipline',
    color: '#3B82F6', // blue-500
    bgColor: 'bg-blue-500',
    icon: '📋',
  },
  {
    key: 'riskScore' as const,
    label: 'Risk',
    color: '#EF4444', // red-500
    bgColor: 'bg-red-500',
    icon: '🛡️',
  },
  {
    key: 'emotionalStabilityScore' as const,
    label: 'Emotional',
    color: '#22C55E', // green-500
    bgColor: 'bg-green-500',
    icon: '🧠',
  },
  {
    key: 'consistencyScore' as const,
    label: 'Consistency',
    color: '#A855F7', // purple-500
    bgColor: 'bg-purple-500',
    icon: '📊',
  },
  {
    key: 'strategyAdherenceScore' as const,
    label: 'Strategy',
    color: '#F97316', // orange-500
    bgColor: 'bg-orange-500',
    icon: '🎯',
  },
]

function ScoreBar({ label, score, color, icon, showLabel = true, compact = false }: ScoreBarProps) {
  return (
    <div className={cn('flex items-center gap-3', compact ? 'py-1' : 'py-2')}>
      {showLabel && (
        <div className="w-24 flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className={cn('text-gray-700', compact ? 'text-xs' : 'text-sm')}>{label}</span>
        </div>
      )}
      <div className="flex-1 flex items-center gap-2">
        <Progress
          value={score}
          className="h-2"
          style={{ 
            '--progress-color': color,
          } as React.CSSProperties}
        />
        <span className={cn(
          'font-medium tabular-nums',
          compact ? 'text-xs w-8 text-right' : 'text-sm w-10 text-right'
        )}>
          {score}
        </span>
      </div>
    </div>
  )
}

export function ScoreBreakdown({ scores, showLabels = true, compact = false }: ScoreBreakdownProps) {
  return (
    <div className={compact ? 'space-y-0' : 'space-y-1'}>
      {COMPONENT_CONFIG.map(config => (
        <ScoreBar
          key={config.key}
          label={config.label}
          score={scores[config.key]}
          color={config.color}
          icon={config.icon}
          showLabel={showLabels}
          compact={compact}
        />
      ))}
    </div>
  )
}

interface MiniBreakdownProps {
  scores: Omit<EdgeScoreBreakdown, 'compositeScore'>
}

export function MiniBreakdown({ scores }: MiniBreakdownProps) {
  return (
    <div className="flex gap-1">
      {COMPONENT_CONFIG.map(config => (
        <div
          key={config.key}
          className="flex-1 h-1 rounded-full"
          style={{ backgroundColor: scores[config.key] > 50 ? config.color : '#e5e7eb' }}
        />
      ))}
    </div>
  )
}