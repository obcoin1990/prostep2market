import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { BrandingManagerClient } from './BrandingManagerClient'

export interface PlatformBrandingRow {
  id: string
  primary_color: string | null
  secondary_color: string | null
  accent_color: string | null
  bg_color: string | null
  dark_bg_color: string | null
  logo_url: string | null
  favicon_url: string | null
  platform_name: string | null
  tagline: string | null
  custom_css: string | null
  updated_at: string | null
  updated_by: string | null
}

export interface EnterpriseTenantRow {
  id: string
  name: string
  slug: string
  domain: string | null
  contact_email: string | null
  plan: string | null
  primary_color: string | null
  secondary_color: string | null
  accent_color: string | null
  logo_url: string | null
  platform_name: string | null
  custom_css: string | null
  max_users: number | null
  active: boolean
  notes: string | null
  created_at: string
  updated_at: string | null
}

export default async function AdminBrandingPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  const [{ data: branding }, { data: tenants }] = await Promise.all([
    admin.from('platform_branding').select('*').limit(1).maybeSingle(),
    admin.from('enterprise_tenants').select('*').order('created_at', { ascending: false }),
  ])

  return (
    <BrandingManagerClient
      initialBranding={(branding ?? null) as PlatformBrandingRow | null}
      initialTenants={(tenants ?? []) as EnterpriseTenantRow[]}
    />
  )
}
