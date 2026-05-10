'use client'

import { TraderProfile } from '@/types/trader-dna'

interface OnboardingTourProps {
  profile: TraderProfile | null
  isOnboardingComplete: boolean
}

/**
 * OnboardingTour Component (Placeholder)
 * TODO: Implement with react-joyride when ESM compatibility is resolved
 * Currently provides a simple walkthrough via OnboardingBanner component
 */
export function OnboardingTour({
  profile,
  isOnboardingComplete,
}: OnboardingTourProps) {
  // Placeholder - tour functionality provided by OnboardingBanner
  // and in-app tooltips on key dashboard elements
  return null
}
