'use client'

import { Lightbulb } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { TraderProfile } from '@/types/trader-dna'

interface DashboardTipsProps {
  profile: TraderProfile | null
  tips?: string[]
}

/**
 * DashboardTips Component
 * Shows profile-specific guidance and insights
 */
export function DashboardTips({ profile, tips: customTips }: DashboardTipsProps) {
  // Use custom tips if provided, otherwise generate from profile
  let displayTips: string[] = customTips || []

  if (!displayTips.length && profile) {
    const profileTips: Record<string, string[]> = {
      sniper: [
        'Your patience is your edge. Wait for high-conviction setups with excellent risk-reward ratios.',
        'Focus on quality over quantity. Your best results come from detailed analysis before execution.',
      ],
      analyst: [
        'Your systematic approach is valuable. Track your metrics consistently and let data guide your decisions.',
        'Create clear trading rules based on your analysis. Document your process for continuous improvement.',
      ],
      warrior: [
        'Your quick decision-making is an asset. Use it with strict risk management to stay profitable.',
        'Monitor your exposure carefully. Your speed can lead to overtrading—set position limits.',
      ],
      disciplinarian: [
        'Your rule adherence is your superpower. Keep following your checklist—it\'s your edge.',
        'Track your plan adherence closely. Your discipline compounds over time into significant returns.',
      ],
      opportunist: [
        'Your adaptability helps in different market conditions. Keep your tool palette organized.',
        'Use multiple strategies but maintain clear rules for each. Flexibility works best with structure.',
      ],
    }

    displayTips = profileTips[profile.type.toLowerCase()] || []
  }

  if (!displayTips.length) {
    return null
  }

  return (
    <Card className="bg-gradient-to-r from-[#E8F4F8] to-blue-50 border border-[#00B4D8]">
      <CardContent className="pt-6">
        <div className="space-y-3">
          {displayTips.slice(0, 2).map((tip, idx) => (
            <div key={idx} className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-[#0A5E7A] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#0A5E7A]">{tip}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
