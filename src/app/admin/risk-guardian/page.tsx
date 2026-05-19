import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { RiskGuardianClient } from './RiskGuardianClient'

export interface RiskGuardianDefaults {
  max_session_duration: number
  max_trades_per_session: number
  max_trades_per_window: number
  exposure_multiplier: number
  fatigue_warning_enabled: boolean
  revenge_trading_alert_enabled: boolean
  emotional_instability_threshold: number
}

const DEFAULT_RISK_SETTINGS: RiskGuardianDefaults = {
  max_session_duration: 120,
  max_trades_per_session: 20,
  max_trades_per_window: 10,
  exposure_multiplier: 1.5,
  fatigue_warning_enabled: true,
  revenge_trading_alert_enabled: true,
  emotional_instability_threshold: 6,
}

export default async function RiskGuardianPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const adminClient = createAdminClient()

  const { data } = await adminClient
    .from('admin_settings')
    .select('value')
    .eq('key', 'risk_guardian_defaults')
    .single()

  const settings: RiskGuardianDefaults = {
    ...DEFAULT_RISK_SETTINGS,
    ...(data?.value as Partial<RiskGuardianDefaults> ?? {}),
  }

  return <RiskGuardianClient initialSettings={settings} />
}
