import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { SEOManagerClient } from './SEOManagerClient'

export interface SEOSettingRow {
  id: string
  page_path: string
  title: string | null
  description: string | null
  keywords: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  canonical_url: string | null
  no_index: boolean
  updated_at: string | null
  updated_by: string | null
}

export default async function AdminSEOPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()
  const { data: settings, error } = await admin
    .from('seo_settings')
    .select('*')
    .order('page_path', { ascending: true })

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
        Failed to load SEO settings: {error.message}
      </div>
    )
  }

  return <SEOManagerClient initialSettings={(settings ?? []) as SEOSettingRow[]} />
}
