import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminContext } from '@/lib/admin/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  try {
    const body = await request.json()
    const { course_id, title, content, type, duration_minutes, order_index } = body

    if (!course_id || !title || !type) {
      return NextResponse.json({ error: 'course_id, title, and type are required' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('lessons')
      .insert([{ course_id, title, content, type, duration_minutes, order_index }])
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err) {
    console.error('POST /api/admin/education/lessons error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
