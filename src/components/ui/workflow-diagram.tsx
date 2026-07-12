'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface WorkflowStep {
  id: string
  title: string
  description?: string
  icon?: ReactNode
  status?: 'complete' | 'active' | 'upcoming'
}

interface WorkflowDiagramProps {
  steps: WorkflowStep[]
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

const statusStyles = {
  complete: {
    circle: 'bg-[#0ecb81] text-white',
    line:  'bg-[#0ecb81]',
    text:   'text-[#0ecb81]',
  },
  active: {
    circle: 'bg-[#fcd535] text-[#0b0e11]',
    line:   'bg-[#2b3139]',
    text:    'text-[#fcd535]',
  },
  upcoming: {
    circle: 'bg-[#2b3139] text-[#848e9c]',
    line:   'bg-[#2b3139]',
    text:    'text-[#848e9c]',
  },
}

export function WorkflowDiagram({ steps, orientation = 'vertical', className }: WorkflowDiagramProps) {
  const isVertical = orientation === 'vertical'

  return (
    <div className={cn(
      isVertical ? 'flex flex-col' : 'flex flex-row items-start',
      className,
    )}>
      {steps.map((step, index) => {
        const status = step.status ?? (index === steps.length - 1 ? 'upcoming' : 'complete')
        const styles = statusStyles[status]
        const isLast = index === steps.length - 1

        return (
          <div
            key={step.id}
            className={cn(
              'flex',
              isVertical ? 'flex-row gap-4' : 'flex-col items-center gap-3',
              !isLast && (isVertical ? 'pb-6' : 'pr-6'),
            )}
          >
            {/* Connector + Circle */}
            <div className={cn('flex flex-col items-center', isVertical ? '' : 'flex-row')}>
              {/* Vertical connector line (before circle) */}
              {isVertical && !isLast && index > 0 && (
                <div className={cn('w-0.5 h-4', styles.line)} />
              )}
              
              {/* Step circle */}
              <div className={cn(
                'relative flex items-center justify-center rounded-full w-10 h-10 text-sm font-bold shrink-0',
                styles.circle,
              )}>
                {step.icon ?? (status === 'complete' ? '✓' : index + 1)}
              </div>

              {/* Horizontal connector line (after circle) */}
              {!isVertical && !isLast && (
                <div className={cn('h-0.5 w-12 mt-5', styles.line)} />
              )}
            </div>

            {/* Text content */}
            <div className={cn(isVertical ? 'pt-1' : 'text-center max-w-[140px]')}>
              <p className={cn('text-sm font-semibold', styles.text)}>
                {step.title}
              </p>
              {step.description && (
                <p className="text-xs text-[#848e9c] mt-0.5">{step.description}</p>
              )}
            </div>

            {/* Vertical connector line (after text) */}
            {isVertical && !isLast && (
              <div className="absolute" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Preset Workflows ─────────────────────────────────────────────────────────

export const ONBOARDING_STEPS: WorkflowStep[] = [
  { id: 'register',   title: 'Register',       description: 'Create your account',        status: 'complete' },
  { id: 'dna',        title: 'Trader DNA',     description: 'Complete the assessment',     status: 'complete' },
  { id: 'connect',    title: 'Connect Trades',  description: 'MT5 or CSV import',          status: 'active' },
  { id: 'journal',    title: 'Journal',         description: 'Log emotions & screenshots', status: 'upcoming' },
  { id: 'edge-score', title: 'Edge Score',      description: 'Track your progress',        status: 'upcoming' },
]

export const TRADE_LIFECYCLE_STEPS: WorkflowStep[] = [
  { id: 'analyze',  title: 'Pre-Trade',     description: 'Strategy check & risk plan', status: 'complete' },
  { id: 'execute',  title: 'Execution',      description: 'Enter the trade',           status: 'active' },
  { id: 'monitor',  title: 'Monitor',        description: 'AI Guardian watches',       status: 'upcoming' },
  { id: 'close',    title: 'Close & Log',    description: 'Journal the outcome',       status: 'upcoming' },
  { id: 'reflect',  title: 'Reflect',        description: 'AI feedback & score',       status: 'upcoming' },
]

export const EDUCATION_PATH_STEPS: WorkflowStep[] = [
  { id: 'learn',   title: 'Learn',     description: 'Watch courses & read guides', status: 'complete' },
  { id: 'practice', title: 'Practice',  description: 'Strategy Lab simulation',    status: 'active' },
  { id: 'quiz',    title: 'Quiz',      description: 'Test your knowledge',        status: 'upcoming' },
  { id: 'certify', title: 'Certify',   description: 'Earn your certificate',      status: 'upcoming' },
]
