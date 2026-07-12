import { NextRequest, NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const ctx = await getAdminContext()
  if (ctx instanceof NextResponse) return ctx

  const admin = createAdminClient()
  const url = new URL(req.url)
  const status = url.searchParams.get('status')
  const type = url.searchParams.get('type')
  const search = url.searchParams.get('search')

  let query = admin
    .from('content_pages')
    .select('*', { count: 'exact' })
    .order('updated_at', { ascending: false })

  if (status && status !== 'All') {
    query = query.eq('status', status)
  }
  if (type) {
    query = query.eq('type', type)
  }
  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  const { data, count, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    success: true,
    data: data ?? [],
    total: count ?? 0,
  })
}

export async function POST(req: NextRequest) {
  const ctx = await getAdminContext()
  if (ctx instanceof NextResponse) return ctx

  const body = await req.json()
  const { title, slug, type, status, locale } = body

  if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('content_pages')
    .insert({
      title,
      slug: slug ?? null,
      type: type ?? 'Page',
      status: status ?? 'Draft',
      locale: locale ?? 'en-US',
      author_id: ctx.user.id,
      author_email: ctx.user.email ?? null,
      published_at: status === 'Published' ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data }, { status: 201 })
}
