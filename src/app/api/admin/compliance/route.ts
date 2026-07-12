import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const ctx = await getAdminContext()
  if (ctx instanceof NextResponse) return ctx

  const admin = createAdminClient()

  const [{ data: frameworks, error: fErr }, { data: controls, error: cErr }] = await Promise.all([
    admin.from('compliance_frameworks').select('*').order('created_at', { ascending: true }),
    admin.from('compliance_controls').select('*').order('created_at', { ascending: true }),
  ])

  if (fErr) return NextResponse.json({ error: fErr.message }, { status: 500 })
  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 })

  return NextResponse.json({
    success: true,
    frameworks: frameworks ?? [],
    controls: controls ?? [],
  })
}

export async function POST(req: NextRequest) {
  const ctx = await getAdminContext()
  if (ctx instanceof NextResponse) return ctx

  const body = await req.json()
  const { type } = body // 'framework' or 'control'

  const admin = createAdminClient()

  if (type === 'framework') {
    const { name, status, expiry, progress, notes } = body
    if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })
    const { data, error } = await admin
      .from('compliance_frameworks')
      .insert({ name, status: status ?? 'Not Started', expiry: expiry ?? null, progress: progress ?? 0, notes: notes ?? null })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data }, { status: 201 })
  }

  if (type === 'control') {
    const { framework_id, name, category, status, notes } = body
    if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })
    const { data, error } = await admin
      .from('compliance_controls')
      .insert({ framework_id: framework_id ?? null, name, category: category ?? null, status: status ?? 'Pending', notes: notes ?? null })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, data }, { status: 201 })
  }

  return NextResponse.json({ error: 'type must be "framework" or "control"' }, { status: 400 })
}
