import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { Mail, Send, Eye, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function AdminEmailPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  const [{ data: templates, error: tErr }, { data: logs, error: lErr }] = await Promise.all([
    admin.from('email_templates').select('*').order('created_at', { ascending: false }),
    admin.from('notification_logs').select('status'),
  ])

  if (tErr) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
        Failed to load email templates: {tErr.message}
      </div>
    )
  }

  const allTemplates = templates ?? []
  const allLogs = logs ?? []
  const activeTemplates = allTemplates.filter((t: Record<string, unknown>) => t.active)
  const totalSends = allLogs.length
  const sentCount = allLogs.filter((l: Record<string, unknown>) => l.status === 'sent').length
  const openRate = totalSends > 0 ? ((sentCount / totalSends) * 100).toFixed(1) : '0'
  const bounceCount = allLogs.filter((l: Record<string, unknown>) => l.status === 'bounced').length
  const bounceRate = totalSends > 0 ? ((bounceCount / totalSends) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Email Templates</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage transactional email templates and notification content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Active Templates', value: String(activeTemplates.length), icon: Mail },
          { label: 'Total Sends', value: totalSends.toLocaleString(), icon: Send },
          { label: 'Delivery Rate', value: `${openRate}%`, icon: Eye },
          { label: 'Bounce Rate', value: `${bounceRate}%`, icon: AlertTriangle },
        ].map((s) => (
          <Card key={s.label} variant="light" className="border border-gray-200 shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-700 mt-1">{s.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card variant="light" className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-700">All Templates</CardTitle>
          <p className="text-xs text-gray-400">{allTemplates.length} templates</p>
        </CardHeader>
        <CardContent>
          {allTemplates.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No email templates yet.</p>
          ) : (
            <div className="space-y-3">
              {allTemplates.map((t: Record<string, unknown>) => (
                <div key={t.id as string} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                      <Mail className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-700">{t.name as string}</p>
                        <Badge variant={t.active ? 'success' : 'default'}>{t.active ? 'Active' : 'Draft'}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                        <span className="font-mono">{t.key as string}</span>
                        <span>·</span>
                        <span>{t.subject as string}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
