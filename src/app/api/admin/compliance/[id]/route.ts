import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await getAdminContext()
  if (ctx instanceof NextResponse) return ctx

  const { id } = await params
  const body = await req.json()
  const { table } = body // 'frameworks' or 'controls'
  const admin = createAdminClient()

  const tableName = table === 'controls' ? 'compliance_controls' : 'compliance_frameworks'
  const allowed = table === 'controls'
    ? ['name', 'category', 'status', 'last_tested', 'notes', 'framework_id']
    : ['name', 'status', 'expiry', 'progress', 'notes']

  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }
  updates.updated_at = new Date().toISOString()

  const { data, error } = await admin
    .from(tableName)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await getAdminContext()
  if (ctx instanceof NextResponse) return ctx

  const { id } = await params
  const url = new URL(req.url)
  const table = url.searchParams.get('table') ?? 'frameworks'
  const admin = createAdminClient()
  const tableName = table === 'controls' ? 'compliance_controls' : 'compliance_frameworks'

  const { error } = await admin.from(tableName).delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
