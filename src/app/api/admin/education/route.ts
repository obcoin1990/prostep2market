import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminContext } from '@/lib/admin/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  try {
    const admin = createAdminClient()

    const { data: courses, error } = await admin
      .from('courses')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Fetch lesson counts per course
    const courseIds = (courses ?? []).map((c) => c.id)
    let lessonCounts: Record<string, number> = {}
    if (courseIds.length > 0) {
      const { data: lessons } = await admin
        .from('lessons')
        .select('course_id')
        .in('course_id', courseIds)

      for (const l of lessons ?? []) {
        lessonCounts[l.course_id] = (lessonCounts[l.course_id] ?? 0) + 1
      }
    }

    // Fetch enrollment (progress) counts per course
    let progressCounts: Record<string, number> = {}
    if (courseIds.length > 0) {
      const { data: progress } = await admin
        .from('course_progress')
        .select('course_id')
        .in('course_id', courseIds)

      for (const p of progress ?? []) {
        progressCounts[p.course_id] = (progressCounts[p.course_id] ?? 0) + 1
      }
    }

    const enriched = (courses ?? []).map((c) => ({
      ...c,
      lesson_count: lessonCounts[c.id] ?? 0,
      enrollment_count: progressCounts[c.id] ?? 0,
    }))

    return NextResponse.json({ success: true, data: enriched })
  } catch (err) {
    console.error('GET /api/admin/education error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const result = await getAdminContext()
  if (result instanceof NextResponse) return result

  try {
    const body = await request.json()
    const { title, path, type, description, duration_minutes, order_index, certificate_eligible } = body

    if (!title || !path || !type) {
      return NextResponse.json({ error: 'title, path, and type are required' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('courses')
      .insert([{ title, path, type, description, duration_minutes, order_index, certificate_eligible }])
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err) {
    console.error('POST /api/admin/education error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
