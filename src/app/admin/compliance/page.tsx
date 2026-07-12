import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { Shield, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function AdminCompliancePage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  const [{ data: frameworks, error: fErr }, { data: controls, error: cErr }] = await Promise.all([
    admin.from('compliance_frameworks').select('*').order('created_at', { ascending: true }),
    admin.from('compliance_controls').select('*').order('created_at', { ascending: true }),
  ])

  if (fErr || cErr) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
        Failed to load compliance data: {(fErr ?? cErr)?.message}
      </div>
    )
  }

  const allFrameworks = frameworks ?? []
  const allControls = controls ?? []
  const certifiedCount = allFrameworks.filter((f) => f.status === 'Certified' || f.status === 'Compliant').length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Compliance Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Regulatory compliance status and audit readiness</p>
        </div>
        {allFrameworks.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-400/10 border border-green-400/30">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-xs font-semibold text-green-400">{certifiedCount}/{allFrameworks.length} Certified</span>
          </div>
        )}
      </div>

      {allFrameworks.length === 0 ? (
        <Card variant="light" className="border border-gray-200 shadow-sm">
          <CardContent className="py-12 text-center">
            <Shield className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No compliance frameworks configured yet.</p>
            <p className="text-xs text-gray-300 mt-1">Add frameworks to track compliance status.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {allFrameworks.map((f) => (
            <Card key={f.id} variant="light" className="border border-gray-200 shadow-sm">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{f.name}</p>
                  <Badge variant={f.status === 'Certified' || f.status === 'Compliant' ? 'success' : f.status === 'In Progress' ? 'warning' : 'default'}>
                    {f.status}
                  </Badge>
                </div>
                {f.progress > 0 && (
                  <div className="mt-3">
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${f.progress}%`,
                          backgroundColor: f.status === 'Certified' || f.status === 'Compliant' ? '#0ecb81' : f.status === 'In Progress' ? '#FFC107' : '#9ea3ad',
                        }}
                      />
                    </div>
                    {f.expiry && <p className="text-xs text-gray-400 mt-1">{f.expiry}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card variant="light" className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-700">Compliance Controls</CardTitle>
          <p className="text-xs text-gray-400">Security and compliance control status</p>
        </CardHeader>
        <CardContent>
          {allControls.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No compliance controls configured yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">Control</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">Category</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">Status</th>
                    <th className="text-right py-2 font-medium text-gray-400 text-xs uppercase tracking-wide">Last Tested</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allControls.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 pr-4 font-medium text-gray-700">{c.name}</td>
                      <td className="py-3 pr-4 text-gray-500 text-xs">{c.category ?? '—'}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={c.status === 'Passed' ? 'success' : c.status === 'Needs Review' ? 'warning' : 'info'}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right text-gray-400 text-xs">
                        {c.last_tested ? new Date(c.last_tested).toLocaleDateString() : '—'}
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
