import { NextRequest, NextResponse } from 'next/server'
import { getPlatformBranding, getTenantBranding, getCssVariables, mergeBrandingCssVariables } from '@/lib/branding'

export async function GET(request: NextRequest) {
  const tenantSlug = request.nextUrl.searchParams.get('tenant')

  const platform = await getPlatformBranding()

  let branding = platform
  if (tenantSlug) {
    const tenant = await getTenantBranding(tenantSlug)
    branding = mergeBrandingCssVariables(platform, tenant)
  }

  const css = getCssVariables(branding)

  return new NextResponse(css, {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
