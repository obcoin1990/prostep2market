'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface FeatureFlagToggleProps {
  flagName: string
  currentRollout: number
  onToggled?: (newRollout: number) => void
}

export function FeatureFlagToggle({ flagName, currentRollout, onToggled }: FeatureFlagToggleProps) {
  const [loading, setLoading] = useState(false)
  const isEnabled = currentRollout > 0

  async function handleToggle() {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: setting } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'feature_flags')
        .maybeSingle()

      const flags = (setting?.value ?? []) as Array<{
        name: string
        rollout: number
        [key: string]: unknown
      }>

      const updated = flags.map((f) =>
        f.name === flagName
          ? { ...f, rollout: isEnabled ? 0 : 100 }
          : f
      )

      const { error } = await supabase
        .from('admin_settings')
        .upsert({ key: 'feature_flags', value: updated }, { onConflict: 'key' })

      if (error) {
        toast.error(error.message)
      } else {
        const newRollout = isEnabled ? 0 : 100
        toast.success(`Feature flag "${flagName}" ${isEnabled ? 'disabled' : 'enabled'}`)
        onToggled?.(newRollout)
      }
    } catch {
      toast.error('Failed to toggle feature flag')
    } finally {
      setLoading(false)
    }
  }

  return (
    <label className="relative inline-flex cursor-pointer items-center" aria-label={isEnabled ? 'Disable ' + flagName : 'Enable ' + flagName}>
      <input
        type="checkbox"
        checked={isEnabled}
        onChange={handleToggle}
        disabled={loading}
        className="peer sr-only"
      />
      <div role="switch" aria-checked={isEnabled} className="h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#0ecb81] peer-checked:after:translate-x-full disabled:opacity-50" />
    </label>
  )
}
