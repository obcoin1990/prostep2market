import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { RiskGuardianClient } from './RiskGuardianClient'
import { DEFAULT_RISK_SETTINGS } from './defaults'

// Re-export so existing imports from './page' still work
export type { RiskGuardianDefaults } from './defaults'
export { DEFAULT_RISK_SETTINGS } from './defaults'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function RiskGuardianPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const adminClient = createAdminClient()

  const { data } = await adminClient
    .from('admin_settings')
    .select('value')
    .eq('key', 'risk_guardian_defaults')
    .single()

  const settings = {
    ...DEFAULT_RISK_SETTINGS,
    ...(data?.value as Partial<typeof DEFAULT_RISK_SETTINGS> ?? {}),
  }

  return <RiskGuardianClient initialSettings={settings} />
}
