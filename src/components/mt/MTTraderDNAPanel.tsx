'use client'

import React from 'react'
import { Brain, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { DNAScores } from '@/lib/trader-dna/auto-builder'

interface MTTraderDNAPanelProps {
  scores: DNAScores | null
  onRebuilt?: (scores: DNAScores) => void
}

const SCORE_CONFIG: Array<{ key: keyof DNAScores; label: string; color: string }> = [
  { key: 'risk_personality_score',    label: 'Risk Management',      color: '#f6465d' },
  { key: 'emotional_stability_score', label: 'Emotional Stability',  color: '#fcd535' },
  { key: 'decision_making_score',     label: 'Decision Making',      color: '#0ecb81' },
  { key: 'trading_behavior_score',    label: 'Trading Behavior',     color: '#3b82f6' },
  { key: 'learning_style_score',      label: 'Improvement Trend',    color: '#a855f7' },
]

const PROFILE_ICONS: Record<string, string> = {
  sniper:         '🎯',
  analyst:        '📊',
  warrior:        '⚔️',
  disciplinarian: '🛡️',
  opportunist:    '💡',
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.min(100, score)}%`, backgroundColor: color }}
      />
    </div>
  )
}

export function MTTraderDNAPanel({ scores, onRebuilt }: MTTraderDNAPanelProps) {
  const [rebuilding, setRebuilding] = React.useState(false)

  const handleRebuild = async () => {
    setRebuilding(true)
    try {
      const res  = await fetch('/api/mt/build-trader-dna', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      toast.success('Trader DNA updated from MT history')
      onRebuilt?.(json.scores)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'DNA build failed')
    } finally {
      setRebuilding(false)
    }
  }

  return (
    <Card variant="light" className="border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base text-[#0A0F1C]">
            <Brain className="w-4 h-4 text-purple-500" />
            Trader DNA (Auto-Built)
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={handleRebuild}
            disabled={rebuilding}
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${rebuilding ? 'animate-spin' : ''}`} />
            {rebuilding ? 'Building…' : 'Rebuild'}
          </Button>
        </div>
        <p className="text-[11px] text-gray-400">
          Auto-scored from your MT trade history. Updates after each sync.
        </p>
      </CardHeader>

      <CardContent>
        {!scores ? (
          <p className="text-sm text-gray-400 py-4 text-center">
            No DNA profile yet — sync your account to auto-build.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Profile badge */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
              <span className="text-3xl">{PROFILE_ICONS[scores.profile_type] ?? '🧠'}</span>
              <div>
                <p className="font-bold text-[#0A0F1C] capitalize">{scores.profile_type} Trader</p>
                <p className="text-xs text-gray-500 capitalize">
                  Path: {scores.learning_path?.replace(/-/g, ' ')}
                </p>
              </div>
            </div>

            {/* Score bars */}
            <div className="space-y-3">
              {SCORE_CONFIG.map(({ key, label, color }) => {
                const score = scores[key] as number
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-36 flex-shrink-0">{label}</span>
                    <ScoreBar score={score} color={color} />
                    <span
                      className="text-xs font-mono font-bold w-8 text-right flex-shrink-0"
                      style={{ color }}
                    >
                      {score}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
