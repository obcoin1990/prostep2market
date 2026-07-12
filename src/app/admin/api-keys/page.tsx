import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { Key, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ApiKeyActions } from '@/components/admin/ApiKeyActions'

export default async function AdminApiKeysPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  const { data: keys, error } = await admin
    .from('api_keys')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
        Failed to load API keys: {error.message}
      </div>
    )
  }

  const allKeys = keys ?? []
  const activeKeys = allKeys.filter((k: Record<string, unknown>) => !k.revoked)

  // Enrich with user emails
  const userIds = [...new Set(allKeys.map((k: Record<string, unknown>) => k.user_id).filter(Boolean))] as string[]
  const emailMap: Record<string, string> = {}
  if (userIds.length > 0) {
    try {
      const { data: authList } = await admin.auth.admin.listUsers({ perPage: 1000 })
      for (const u of authList?.users ?? []) {
        if (userIds.includes(u.id)) emailMap[u.id] = u.email ?? ''
      }
    } catch { /* non-fatal */ }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">API Key Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage platform API keys, access tokens, and service accounts</p>
        </div>
      </div>

      <Card variant="light" className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-700">API Keys</CardTitle>
          <p className="text-xs text-gray-400">{activeKeys.length} active · {allKeys.length} total</p>
        </CardHeader>
        <CardContent>
          {allKeys.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No API keys yet. Keys will appear here once created.</p>
          ) : (
            <div className="space-y-3">
              {allKeys.map((k: Record<string, unknown>) => {
                const isRevoked = !!k.revoked
                const isExpired = k.expires_at && new Date(k.expires_at as string) < new Date()
                const status = isRevoked ? 'Revoked' : isExpired ? 'Expired' : 'Active'
                const statusVariant = isRevoked ? 'error' : isExpired ? 'warning' : 'success'
                return (
                  <div key={k.id as string} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                        <Key className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-700">{k.name as string}</p>
                          <Badge variant={statusVariant as 'success' | 'warning' | 'error'}>{status}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                          <span className="font-mono">{k.key_prefix as string}****</span>
                          {k.scopes ? <span>· {String(k.scopes)}</span> : null}
                          {k.user_id ? <span>· Owner: {emailMap[String(k.user_id)] ?? String(k.user_id)}</span> : null}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-300 mt-0.5">
                          <span>Created {new Date(k.created_at as string).toLocaleDateString()}</span>
                          {k.expires_at ? <span>· Expires {new Date(k.expires_at as string).toLocaleDateString()}</span> : null}
                        </div>
                      </div>
                    </div>
                    <ApiKeyActions
                      keyId={k.id as string}
                      keyPrefix={k.key_prefix as string}
                      isRevoked={isRevoked}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
