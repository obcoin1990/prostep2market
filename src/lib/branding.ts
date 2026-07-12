import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/client'

export interface BrandingColors {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  bgColor: string
  darkBgColor: string
  platformName: string
  logoUrl: string | null
  faviconUrl: string | null
  tagline: string | null
  customCss: string | null
}

export interface TenantBranding {
  id: string
  slug: string
  name: string
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  logoUrl: string | null
  platformName: string | null
  customCss: string | null
}

const DEFAULT_BRANDING: BrandingColors = {
  primaryColor: '#E53935',
  secondaryColor: '#0A0F1C',
  accentColor: '#00B4D8',
  bgColor: '#F5F7FA',
  darkBgColor: '#0A0F1C',
  platformName: 'ProStep2Market',
  logoUrl: null,
  faviconUrl: null,
  tagline: null,
  customCss: null,
}

export function getCssVariables(branding: Partial<BrandingColors>): string {
  const b = { ...DEFAULT_BRANDING, ...branding }
  return `
:root {
  --brand-primary: ${b.primaryColor};
  --brand-secondary: ${b.secondaryColor};
  --brand-accent: ${b.accentColor};
  --brand-bg: ${b.bgColor};
  --brand-dark-bg: ${b.darkBgColor};
  --brand-name: "${b.platformName}";
  --brand-logo: ${b.logoUrl ? `url(${b.logoUrl})` : 'none'};
  --brand-favicon: ${b.faviconUrl ? `url(${b.faviconUrl})` : 'none'};
  --brand-tagline: ${b.tagline ? `"${escapeCssString(b.tagline)}"` : 'none'};
}
${b.customCss || ''}
`.trim()
}

function escapeCssString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\A ')
}

export async function getPlatformBranding(): Promise<BrandingColors> {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('platform_branding')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error || !data) return DEFAULT_BRANDING

    return {
      primaryColor: data.primary_color ?? DEFAULT_BRANDING.primaryColor,
      secondaryColor: data.secondary_color ?? DEFAULT_BRANDING.secondaryColor,
      accentColor: data.accent_color ?? DEFAULT_BRANDING.accentColor,
      bgColor: data.bg_color ?? DEFAULT_BRANDING.bgColor,
      darkBgColor: data.dark_bg_color ?? DEFAULT_BRANDING.darkBgColor,
      platformName: data.platform_name ?? DEFAULT_BRANDING.platformName,
      logoUrl: data.logo_url ?? null,
      faviconUrl: data.favicon_url ?? null,
      tagline: data.tagline ?? null,
      customCss: data.custom_css ?? null,
    }
  } catch {
    return DEFAULT_BRANDING
  }
}

export async function getTenantBranding(slug: string): Promise<TenantBranding | null> {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('enterprise_tenants')
      .select('id, slug, name, primary_color, secondary_color, accent_color, logo_url, platform_name, custom_css')
      .eq('slug', slug)
      .eq('active', true)
      .single()

    if (error || !data) return null

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      primaryColor: data.primary_color,
      secondaryColor: data.secondary_color,
      accentColor: data.accent_color,
      logoUrl: data.logo_url,
      platformName: data.platform_name,
      customCss: data.custom_css,
    }
  } catch {
    return null
  }
}

export function mergeBrandingCssVariables(
  platform: BrandingColors,
  tenant: TenantBranding | null,
): BrandingColors {
  if (!tenant) return platform
  return {
    primaryColor: tenant.primaryColor ?? platform.primaryColor,
    secondaryColor: tenant.secondaryColor ?? platform.secondaryColor,
    accentColor: tenant.accentColor ?? platform.accentColor,
    bgColor: platform.bgColor,
    darkBgColor: platform.darkBgColor,
    platformName: tenant.platformName ?? platform.platformName,
    logoUrl: tenant.logoUrl ?? platform.logoUrl,
    faviconUrl: platform.faviconUrl,
    tagline: platform.tagline,
    customCss: [platform.customCss, tenant.customCss].filter(Boolean).join('\n'),
  }
}
