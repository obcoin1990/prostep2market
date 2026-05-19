import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { AIEngineClient } from './AIEngineClient'

export interface AIEngineSettings {
  model: string
  max_tokens: number
  temperature: number
  analysis_enabled: boolean
  pattern_detection_enabled: boolean
  behavioral_analysis_enabled: boolean
  pdf_reports_enabled: boolean
  ai_insights_enabled: boolean
}

const DEFAULT_SETTINGS: AIEngineSettings = {
  model: 'gpt-4o-mini',
  max_tokens: 1000,
  temperature: 0.7,
  analysis_enabled: true,
  pattern_detection_enabled: true,
  behavioral_analysis_enabled: true,
  pdf_reports_enabled: false,
  ai_insights_enabled: true,
}

export default async function AIEnginePage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const adminClient = createAdminClient()

  const { data } = await adminClient
    .from('admin_settings')
    .select('value')
    .eq('key', 'ai_engine')
    .single()

  const settings: AIEngineSettings = {
    ...DEFAULT_SETTINGS,
    ...(data?.value as Partial<AIEngineSettings> ?? {}),
  }

  return <AIEngineClient initialSettings={settings} />
}
