import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

interface SendBody {
  template_key: string
  recipient_email: string
  recipient_user_id?: string
  variables?: Record<string, string>
}

function replacePlaceholders(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? `{{${key}}}`)
}

// ─── POST /api/admin/notifications/send ──────────────────────────────────────
export async function POST(req: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  let body: SendBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { template_key, recipient_email, recipient_user_id, variables = {} } = body

  if (!template_key || !recipient_email) {
    return NextResponse.json(
      { error: 'template_key and recipient_email are required' },
      { status: 400 }
    )
  }

  const admin = createAdminClient()

  // 1. Fetch template
  const { data: template, error: templateError } = await admin
    .from('email_templates')
    .select('*')
    .eq('key', template_key)
    .eq('active', true)
    .single()

  if (templateError || !template) {
    return NextResponse.json(
      { error: `Template "${template_key}" not found or inactive` },
      { status: 404 }
    )
  }

  // 2. Replace placeholders
  const finalSubject = replacePlaceholders(template.subject as string, variables)
  const finalHtml = replacePlaceholders(template.html_body as string, variables)

  const fromEmail = process.env.FROM_EMAIL ?? 'noreply@prostep2market.com'
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY is not configured' }, { status: 500 })
  }

  // 3. Send via Resend
  let resendId: string | null = null
  let sendStatus: 'sent' | 'failed' = 'sent'
  let sendError: string | null = null
  const sentAt = new Date().toISOString()

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipient_email,
        subject: finalSubject,
        html: finalHtml,
      }),
    })

    const resendJson = await resendRes.json()

    if (!resendRes.ok) {
      sendStatus = 'failed'
      sendError = resendJson?.message ?? resendJson?.error ?? 'Resend API error'
    } else {
      resendId = resendJson?.id ?? null
    }
  } catch (err: unknown) {
    sendStatus = 'failed'
    sendError = err instanceof Error ? err.message : 'Network error calling Resend'
  }

  // 4. Log to notification_logs
  await admin.from('notification_logs').insert({
    template_key,
    recipient_email,
    recipient_user_id: recipient_user_id ?? null,
    subject: finalSubject,
    status: sendStatus,
    resend_id: resendId,
    sent_at: sentAt,
    error: sendError,
  })

  if (sendStatus === 'failed') {
    return NextResponse.json(
      { success: false, error: sendError ?? 'Failed to send email' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, resend_id: resendId, status: sendStatus })
}
