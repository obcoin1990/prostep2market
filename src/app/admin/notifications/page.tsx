import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { NotificationsManagerClient } from './NotificationsManagerClient'

export interface EmailTemplate {
  id: string
  key: string
  name: string
  subject: string
  html_body: string
  text_body: string | null
  variables: string[]
  active: boolean
  created_at: string
  updated_at: string
}

export interface NotificationLog {
  id: string
  template_key: string
  recipient_email: string
  recipient_user_id: string | null
  subject: string
  status: 'sent' | 'failed' | 'bounced' | 'opened'
  resend_id: string | null
  sent_at: string
  error: string | null
}

export default async function NotificationsPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  const [{ data: templates, error: tErr }, { data: logs, error: lErr }] = await Promise.all([
    admin.from('email_templates').select('*').order('created_at', { ascending: false }),
    admin
      .from('notification_logs')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(50),
  ])

  if (tErr) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
        Failed to load templates: {tErr.message}
      </div>
    )
  }

  if (lErr) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
        Failed to load notification logs: {lErr.message}
      </div>
    )
  }

  return (
    <NotificationsManagerClient
      initialTemplates={(templates ?? []) as EmailTemplate[]}
      initialLogs={(logs ?? []) as NotificationLog[]}
    />
  )
}
