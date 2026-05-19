'use client'

import { AlertCircle, CheckCircle, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface OnboardingBannerProps {
  step?: 'welcome' | 'dna-assessment' | 'first-trade' | 'analysis'
  dismissible?: boolean
  onDismiss?: () => void
}

/**
 * OnboardingBanner Component
 * Guides new users through the setup workflow
 * Shows different messages based on completion step
 */
export function OnboardingBanner({
  step = 'dna-assessment',
  dismissible = true,
  onDismiss,
}: OnboardingBannerProps) {
  const steps = {
    welcome: {
      icon: AlertCircle,
      title: 'Welcome to Prostep2Market',
      description:
        "Let's set up your trading dashboard in 3 steps to get the most personalized experience.",
      action: { label: 'Start Setup', href: '/trader-dna' },
      accent: '#4a90d9', // info blue
    },
    'dna-assessment': {
      icon: AlertCircle,
      title: 'Complete Your Trader DNA Assessment',
      description:
        'Answer 40 questions about your trading psychology to unlock personalized insights and recommendations tailored to your trading style.',
      action: { label: 'Start Assessment', href: '/trader-dna' },
      accent: '#a78bfa', // purple accent
    },
    'first-trade': {
      icon: AlertCircle,
      title: 'Log Your First Trade',
      description:
        'Start tracking your trades to see your Edge Score in action and get AI-powered behavioral insights.',
      action: { label: 'Log Trade', href: '/journal/entry' },
      accent: '#0ecb81', // trading-up green
    },
    analysis: {
      icon: CheckCircle,
      title: 'Run Your First Analysis',
      description:
        'Now that you have trade history, run a full AI analysis to discover behavioral patterns and improve your trading.',
      action: { label: 'View Analysis', href: '/analysis' },
      accent: '#fcd535', // yellow
    },
  }

  const config = steps[step]
  const Icon = config.icon

  return (
    <div
      className="rounded-[8px] p-4 flex items-start justify-between gap-3"
      style={{
        backgroundColor: '#1e2329',
        borderLeft: `3px solid ${config.accent}`,
        border: `1px solid #2b3139`,
        borderLeftWidth: '3px',
        borderLeftColor: config.accent,
      }}
    >
      <div className="flex items-start gap-3 min-w-0">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: config.accent }} />
        <div className="min-w-0">
          <p className="text-sm font-semibold mb-1" style={{ color: '#eaecef' }}>{config.title}</p>
          <p className="text-xs mb-3" style={{ color: '#707a8a' }}>{config.description}</p>
          <Link href={config.action.href}>
            <Button
              size="sm"
              className="gap-1.5 text-xs h-7 px-3"
              style={{ backgroundColor: config.accent, color: config.accent === '#fcd535' ? '#0b0e11' : '#ffffff' }}
            >
              {config.action.label}
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 flex-shrink-0 rounded transition-colors"
          style={{ color: '#707a8a' }}
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
