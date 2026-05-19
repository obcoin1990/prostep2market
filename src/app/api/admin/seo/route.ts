import { NextResponse } from 'next/server'
import { getAdminContext } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('seo_settings')
    .select('*')
    .order('page_path', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data })
}

export async function POST(request: Request) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result
  const { user } = result

  const body = await request.json()
  const { page_path, title, description, keywords, og_title, og_description, og_image, canonical_url, no_index } = body

  if (!page_path) {
    return NextResponse.json({ error: 'page_path is required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('seo_settings')
    .insert({
      page_path,
      title: title ?? null,
      description: description ?? null,
      keywords: keywords ?? null,
      og_title: og_title ?? null,
      og_description: og_description ?? null,
      og_image: og_image ?? null,
      canonical_url: canonical_url ?? null,
      no_index: no_index ?? false,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, data }, { status: 201 })
}
