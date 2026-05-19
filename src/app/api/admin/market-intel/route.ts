import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminContext } from '@/lib/admin/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
    const from = (page - 1) * limit
    const to = from + limit - 1

    const admin = createAdminClient()
    const { data, error, count } = await admin
      .from('market_intel_posts')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true, data: data ?? [], total: count ?? 0 })
  } catch (err) {
    console.error('GET /api/admin/market-intel error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result
  const { user } = result

  try {
    const body = await request.json()
    const { title, content, category, currency_pairs, impact, source, external_url, published } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'title and content are required' }, { status: 400 })
    }

    const admin = createAdminClient()
    const now = new Date().toISOString()

    const { data, error } = await admin
      .from('market_intel_posts')
      .insert([{
        title,
        content,
        category: category ?? 'general',
        currency_pairs: Array.isArray(currency_pairs) ? currency_pairs : [],
        impact: impact ?? 'medium',
        source,
        external_url,
        published: published ?? false,
        // published_at is NOT NULL DEFAULT NOW() — only set explicitly when publishing.
        // When draft (published=false), omit it and let the DB default (NOW()) apply.
        ...(published ? { published_at: now } : {}),
        created_by: user.id,
        created_at: now,
        updated_at: now,
      }])
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err) {
    console.error('POST /api/admin/market-intel error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
