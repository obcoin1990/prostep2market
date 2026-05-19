import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

// ─── GET /api/admin/notifications ────────────────────────────────────────────
export async function GET(_req: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('email_templates')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data: data ?? [] })
}

// ─── POST /api/admin/notifications ───────────────────────────────────────────
export async function POST(req: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  let body: {
    key: string
    name: string
    subject: string
    html_body: string
    text_body?: string
    variables?: string[]
    active?: boolean
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { key, name, subject, html_body } = body
  if (!key || !name || !subject || !html_body) {
    return NextResponse.json(
      { error: 'key, name, subject, and html_body are required' },
      { status: 400 }
    )
  }

  const admin = createAdminClient()
  const now = new Date().toISOString()

  const { data, error } = await admin
    .from('email_templates')
    .insert({
      key,
      name,
      subject,
      html_body,
      text_body: body.text_body ?? null,
      variables: body.variables ?? [],
      active: body.active ?? true,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, data }, { status: 201 })
}
