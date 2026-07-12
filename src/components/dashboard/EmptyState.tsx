'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

/**
 * EmptyState Component
 * Generic empty state for widgets with no data
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: '#2b3139' }}
      >
        <Icon className="w-8 h-8" style={{ color: '#9ea3ad' }} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: '#eaecef' }}>{title}</h3>
      <p className="text-sm text-center max-w-sm mb-6" style={{ color: '#9ea3ad' }}>{description}</p>
      <div className="flex gap-3">
        {action && (
          <Link href={action.href}>
            <Button size="sm">{action.label}</Button>
          </Link>
        )}
        {secondaryAction && (
          <Button
            size="sm"
            variant="outline"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}

// Specialized empty states for specific widgets

export function NoTradesEmptyState() {
  return (
    <EmptyState
      icon={require('lucide-react').FileText}
      title="No Trades Yet"
      description="Start logging your trades to see performance metrics, Edge Score, and AI insights."
      action={{
        label: 'Log First Trade',
        href: '/journal/entry',
      }}
    />
  )
}

export function NoAlertsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: 'rgba(14,203,129,0.12)' }}
      >
        <svg className="w-6 h-6" style={{ color: '#0ecb81' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-sm font-medium" style={{ color: '#eaecef' }}>All Clear</p>
      <p className="text-xs mt-1" style={{ color: '#9ea3ad' }}>No active risk alerts detected</p>
    </div>
  )
}

export function NoScoreEmptyState() {
  return (
    <EmptyState
      icon={require('lucide-react').TrendingUp}
      title="Edge Score Coming Soon"
      description="Log a few trades first, then we'll calculate your Edge Score based on your trading performance."
      action={{
        label: 'Start Journaling',
        href: '/journal',
      }}
    />
  )
}

export function NoInsightsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: 'rgba(74,144,217,0.12)' }}
      >
        <svg className="w-6 h-6" style={{ color: '#4a90d9' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-sm font-medium" style={{ color: '#eaecef' }}>No Insights Yet</p>
      <p className="text-xs mt-1" style={{ color: '#9ea3ad' }}>Run an analysis after logging more trades</p>
    </div>
  )
}

export function NoLeaderboardRankEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: 'rgba(252,213,53,0.12)' }}
      >
        <svg className="w-6 h-6" style={{ color: '#fcd535' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      </div>
      <p className="text-sm font-medium" style={{ color: '#eaecef' }}>Leaderboard Rank</p>
      <p className="text-xs mt-1" style={{ color: '#9ea3ad' }}>Complete your DNA assessment to see your rank</p>
    </div>
  )
}
