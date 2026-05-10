'use client'

import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
        'Let\'s set up your trading dashboard in 3 steps to get the most personalized experience.',
      action: {
        label: 'Start Setup',
        href: '/trader-dna',
      },
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      iconColor: 'text-blue-600',
    },
    'dna-assessment': {
      icon: AlertCircle,
      title: 'Complete Your Trader DNA Assessment',
      description:
        'Answer 40 questions about your trading psychology to unlock personalized insights and recommendations tailored to your trading style.',
      action: {
        label: 'Start Assessment',
        href: '/trader-dna',
      },
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      iconColor: 'text-purple-600',
    },
    'first-trade': {
      icon: AlertCircle,
      title: 'Log Your First Trade',
      description:
        'Start tracking your trades to see your Edge Score in action and get AI-powered behavioral insights.',
      action: {
        label: 'Log Trade',
        href: '/journal/entry',
      },
      color: 'bg-green-50 border-green-200 text-green-900',
      iconColor: 'text-green-600',
    },
    analysis: {
      icon: CheckCircle,
      title: 'Run Your First Analysis',
      description:
        'Now that you have trade history, run a full AI analysis to discover behavioral patterns and improve your trading.',
      action: {
        label: 'View Analysis',
        href: '/analysis',
      },
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      iconColor: 'text-amber-600',
    },
  }

  const config = steps[step]
  const Icon = config.icon

  return (
    <Card className={`border ${config.color}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Icon className={`w-6 h-6 ${config.iconColor} mt-0.5 flex-shrink-0`} />
            <div className="min-w-0">
              <CardTitle className="text-lg">{config.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {config.description}
              </p>
            </div>
          </div>
          {dismissible && onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 -mt-1 -mr-2 text-gray-400 hover:text-gray-600 flex-shrink-0 rounded hover:bg-black/5 transition-colors active:bg-black/10"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Link href={config.action.href}>
          <Button className="gap-2 w-full sm:w-auto" size="sm">
            {config.action.label}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
