import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { MarketIntelClient } from './MarketIntelClient'

export default async function MarketIntelPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  const [{ data: posts }, { data: config }] = await Promise.all([
    admin
      .from('market_intel_posts')
      .select('*')
      .order('created_at', { ascending: false }),
    admin
      .from('market_intel_config')
      .select('*')
      .limit(1)
      .maybeSingle(),
  ])

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <MarketIntelClient
          initialPosts={posts ?? []}
          initialConfig={config ?? null}
        />
      </div>
    </div>
  )
}
