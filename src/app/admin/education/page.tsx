import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { EducationManagerClient } from './EducationManagerClient'

export default async function EducationManagerPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  // Fetch all courses
  const { data: courses } = await admin
    .from('courses')
    .select('*')
    .order('order_index', { ascending: true })

  const courseIds = (courses ?? []).map((c) => c.id)

  // Fetch lesson counts
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

  // Fetch enrollment counts
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

  // Analytics
  const { data: allProgress } = await admin
    .from('course_progress')
    .select('quiz_score, completed_at, course_id')

  const totalEnrollments = allProgress?.length ?? 0
  const completed = allProgress?.filter((p) => p.completed_at != null) ?? []
  const completionRate = totalEnrollments > 0 ? Math.round((completed.length / totalEnrollments) * 100) : 0
  const scoresWithValue = (allProgress ?? []).filter((p) => p.quiz_score != null)
  const avgQuizScore =
    scoresWithValue.length > 0
      ? Math.round(scoresWithValue.reduce((acc, p) => acc + (p.quiz_score ?? 0), 0) / scoresWithValue.length)
      : 0

  const enrichedCourses = (courses ?? []).map((c) => ({
    ...c,
    lesson_count: lessonCounts[c.id] ?? 0,
    enrollment_count: progressCounts[c.id] ?? 0,
  }))

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <EducationManagerClient
          initialCourses={enrichedCourses}
          analytics={{ totalEnrollments, completionRate, avgQuizScore }}
        />
      </div>
    </div>
  )
}
