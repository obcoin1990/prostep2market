import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { PaymentsManagerClient } from './PaymentsManagerClient'

export interface PaymentGatewayRow {
  id: string
  provider: string
  active: boolean
  test_mode: boolean
  public_key: string | null
  secret_key: string | null
  webhook_url: string | null
  webhook_secret: string | null
  extra_config: Record<string, unknown> | null
  updated_at: string | null
}

function maskSecretKey(key: string | null): string | null {
  if (!key) return null
  if (key.length <= 4) return '****'
  return '****' + key.slice(-4)
}

export default async function AdminPaymentsPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()
  const { data: gateways, error } = await admin
    .from('payment_gateways')
    .select('*')
    .order('provider', { ascending: true })

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
        Failed to load payment gateways: {error.message}
      </div>
    )
  }

  const masked = (gateways ?? []).map((row) => ({
    ...row,
    secret_key: maskSecretKey(row.secret_key),
    webhook_secret: maskSecretKey(row.webhook_secret),
  })) as PaymentGatewayRow[]

  return <PaymentsManagerClient initialGateways={masked} />
}
