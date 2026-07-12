import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { ClipboardList, Search, Download, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const CATEGORY_COLORS: Record<string, string> = {
  'User Management': '#0284C7',
  'Permissions': '#8A2BE2',
  'Security': '#E53935',
  'Authentication': '#0ecb81',
  'API': '#FFC107',
  'System': '#FF8A65',
  'Data': '#00B4D8',
  'Tenant': '#2E7D32',
}

export default async function AdminAuditLogsPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  const { data: logs, count, error } = await admin
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
        Failed to load audit logs: {error.message}
      </div>
    )
  }

  const allLogs = logs ?? []

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Full audit trail of admin actions, user changes, and system events</p>
        </div>
      </div>

      <Card variant="light" className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-700">Event Log</CardTitle>
          <p className="text-xs text-gray-400">Showing {allLogs.length} of {count ?? 0} events</p>
        </CardHeader>
        <CardContent>
          {allLogs.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No audit events yet. Events will appear as admin actions are performed.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">Action</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">Actor</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">Target</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">Detail</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">Category</th>
                    <th className="text-right py-2 font-medium text-gray-400 text-xs uppercase tracking-wide">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 pr-4 font-medium text-gray-700">{log.action}</td>
                      <td className="py-3 pr-4 text-gray-500 font-mono text-xs">{log.actor_email ?? 'System'}</td>
                      <td className="py-3 pr-4 text-gray-500 text-xs">{log.target ?? '—'}</td>
                      <td className="py-3 pr-4 text-gray-500 text-xs">{log.detail ?? '—'}</td>
                      <td className="py-3 pr-4">
                        <span
                          className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold"
                          style={{
                            backgroundColor: `${CATEGORY_COLORS[log.category] ?? '#666'}15`,
                            color: CATEGORY_COLORS[log.category] ?? '#666',
                          }}
                        >
                          {log.category}
                        </span>
                      </td>
                      <td className="py-3 text-right text-gray-400 text-xs">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
