'use client'

/**
 * Quick Tips Component
 * Generates contextual improvement tips based on score breakdown
 * EDGE-09, JRNL-06, JRNL-08
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { 
  BookOpen, 
  ShieldAlert, 
  Brain, 
  Activity, 
  Target, 
  RefreshCw,
  Lightbulb,
  ChevronRight
} from 'lucide-react'
import { generateQuickTips, generateAllTips, getRankImprovementTip, type EdgeScoreBreakdown } from '@/lib/edge-score'

interface QuickTipsProps {
  scores: EdgeScoreBreakdown
  aiPatterns?: string[]
  onDismiss?: () => void
  className?: string
}

const CATEGORY_ICONS = {
  discipline: BookOpen,
  risk: ShieldAlert,
  emotionalStability: Brain,
  consistency: Activity,
  strategyAdherence: Target,
}

const CATEGORY_LABELS = {
  discipline: 'Discipline',
  risk: 'Risk Management',
  emotionalStability: 'Emotional Stability',
  consistency: 'Consistency',
  strategyAdherence: 'Strategy',
}

const CATEGORY_COLORS = {
  discipline: 'text-blue-600 bg-blue-50 border-blue-200',
  risk: 'text-red-600 bg-red-50 border-red-200',
  emotionalStability: 'text-green-600 bg-green-50 border-green-200',
  consistency: 'text-purple-600 bg-purple-50 border-purple-200',
  strategyAdherence: 'text-orange-600 bg-orange-50 border-orange-200',
}

const LEVEL_LABELS = {
  critical: '🔴 Needs Attention',
  improvement: '🟡 Room to Grow',
  good: '🟢 Solid',
  strong: '🔵 Strong',
  elite: '⭐ Elite',
}

interface TipItemProps {
  message: string
  category: keyof typeof CATEGORY_ICONS
  level: 'critical' | 'improvement' | 'good' | 'strong' | 'elite'
  onAction?: () => void
}

function TipItem({ message, category, level, onAction }: TipItemProps) {
  const Icon = CATEGORY_ICONS[category]
  const colorClass = CATEGORY_COLORS[category]

  return (
    <div className={cn('p-3 rounded-lg border', colorClass)}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium opacity-75">
              {CATEGORY_LABELS[category]}
            </span>
            <span className="text-xs opacity-60">
              {LEVEL_LABELS[level]}
            </span>
          </div>
          <p className="text-sm">{message}</p>
          {onAction && (
            <button
              onClick={onAction}
              className="mt-2 text-xs font-medium flex items-center gap-1 hover:underline"
            >
              Take action <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function QuickTips({ scores, aiPatterns = [], onDismiss, className }: QuickTipsProps) {
  const [dismissed, setDismissed] = useState(false)
  const [activeTab, setActiveTab] = useState<'focus' | 'all' | 'ai'>('focus')

  // Get quick tips (2 lowest components)
  const focusTips = generateQuickTips(scores)

  // Get all tips
  const allTips = generateAllTips(scores)

  // Get rank-based tip
  const rankTip = getRankImprovementTip(scores)

  // AI pattern tips (if available)
  const aiTips = aiPatterns.length > 0 ? aiPatterns.map((pattern, i) => ({
    message: pattern,
    category: 'discipline' as const,
    level: 'improvement' as const,
  })) : []

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  if (dismissed) {
    return (
      <Card className={cn('opacity-50', className)}>
        <CardContent className="py-4 text-center">
          <p className="text-sm text-muted-foreground">Tips dismissed for this session</p>
          <Button variant="link" onClick={() => setDismissed(false)} className="mt-2 text-xs">
            Show tips again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Improvement Tips
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-7 text-xs">
            Dismiss
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Overall rank tip */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm font-medium text-amber-800">{rankTip}</p>
        </div>

        {/* Tabs for different tip categories */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="h-8 w-full">
            <TabsTrigger value="focus" className="text-xs">
              Focus Areas ({focusTips.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs">
              All ({allTips.length})
            </TabsTrigger>
            {aiTips.length > 0 && (
              <TabsTrigger value="ai" className="text-xs">
                AI Insights ({aiTips.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="focus" className="mt-3 space-y-2">
            {focusTips.map((tip, index) => (
              <TipItem
                key={`focus-${index}`}
                message={tip.message}
                category={tip.category}
                level={tip.level}
              />
            ))}
          </TabsContent>

          <TabsContent value="all" className="mt-3 space-y-2">
            {allTips.map((tip, index) => (
              <TipItem
                key={`all-${index}`}
                message={tip.message}
                category={tip.category}
                level={tip.level}
              />
            ))}
          </TabsContent>

          {aiTips.length > 0 && (
            <TabsContent value="ai" className="mt-3 space-y-2">
              {aiTips.map((tip, index) => (
                <TipItem
                  key={`ai-${index}`}
                  message={tip.message}
                  category={tip.category}
                  level={tip.level}
                />
              ))}
            </TabsContent>
          )}
        </Tabs>

        {/* Refresh button */}
        <Button variant="outline" size="sm" className="w-full mt-2">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Tips
        </Button>
      </CardContent>
    </Card>
  )
}

/**
 * Compact version for dashboard sidebar
 */
export function QuickTipsCompact({ scores }: { scores: EdgeScoreBreakdown }) {
  const tips = generateQuickTips(scores)

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        Quick Tips
      </p>
      {tips.map((tip, index) => {
        const Icon = CATEGORY_ICONS[tip.category]
        return (
          <div key={index} className="flex items-start gap-2 text-xs">
            <Icon className={cn('w-4 h-4 mt-0.5', CATEGORY_COLORS[tip.category].split(' ')[0])} />
            <span className="text-gray-600">{tip.message}</span>
          </div>
        )
      })}
    </div>
  )
}