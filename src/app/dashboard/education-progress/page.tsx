'use client'

import { GraduationCap, BookOpen, Award, TrendingUp, Clock, CheckCircle2, PlayCircle, BarChart3 } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'

const PATH_CONFIG: Record<string, { color: string; icon: typeof BookOpen }> = {
  beginner: { color: '#0ecb81', icon: BookOpen },
  intermediate: { color: '#00B4D8', icon: TrendingUp },
  'psychology-first': { color: '#8A2BE2', icon: Award },
  advanced: { color: '#FF8A65', icon: PlayCircle },
}

const PATH_LABELS: Record<string, string> = {
  beginner: 'Beginner Foundation',
  intermediate: 'Technical Analysis',
  'psychology-first': 'Trading Psychology',
  advanced: 'Advanced Strategies',
}

export default function EducationDashboardPage() {
  const supabase = createClient()

  const { data: allCourses, loading: coursesLoading } = useRealtimeData<any[]>(
    async () => {
      const { data } = await supabase.from('courses').select('*').order('order_index')
      return data ?? []
    },
    [],
  )

  const { data: progress, loading: progressLoading } = useRealtimeData<any[]>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data } = await supabase
        .from('course_progress')
        .select('*, courses(*)')
        .eq('user_id', user.id)
      return data ?? []
    },
    [],
  )

  const { data: badges, loading: badgesLoading } = useRealtimeData<any[]>(
    async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data } = await supabase.from('badges').select('*').eq('user_id', user.id)
      return data ?? []
    },
    [],
  )

  const loading = coursesLoading || progressLoading || badgesLoading

  const progressMap = new Map<string, any>()
  for (const p of progress ?? []) {
    if (p.course_id) progressMap.set(p.course_id, p)
  }

  const pathGroups = new Map<string, any[]>()
  for (const course of allCourses ?? []) {
    const list = pathGroups.get(course.path) ?? []
    list.push(course)
    pathGroups.set(course.path, list)
  }

  const learningPaths = Array.from(pathGroups.entries()).map(([path, courses]) => {
    const cfg = PATH_CONFIG[path] ?? { color: '#9ea3ad', icon: BarChart3 }
    let completedCount = 0
    for (const c of courses) {
      const p = progressMap.get(c.id)
      if (p?.completed_at) completedCount++
    }
    const total = courses.length
    const progressPct = total > 0 ? Math.round((completedCount / total) * 100) : 0
    const allDone = completedCount === total && total > 0
    const noneStarted = courses.every((c: any) => !progressMap.get(c.id))
    const status: 'completed' | 'active' | 'idle' = allDone ? 'completed' : noneStarted ? 'idle' : 'active'
    return {
      title: PATH_LABELS[path] ?? path,
      progress: progressPct,
      total,
      completed: completedCount,
      status,
      color: cfg.color,
      icon: cfg.icon,
    }
  })

  const inProgressCourses = (allCourses ?? [])
    .filter((c) => {
      const p = progressMap.get(c.id)
      return p && !p.completed_at
    })
    .slice(0, 3)
    .map((c) => {
      const p = progressMap.get(c.id)
      const cfg = PATH_CONFIG[c.path] ?? { color: '#9ea3ad', icon: BarChart3 }
      const lessonsCompleted = p?.lessons_completed?.length ?? 0
      const progressPct = c.duration_minutes > 0 ? Math.round((lessonsCompleted / (c.duration_minutes / 15)) * 100) : 0
      return {
        title: c.title,
        path: PATH_LABELS[c.path] ?? c.path,
        progress: progressPct,
        lessons: `${lessonsCompleted}`,
        time: `${Math.max(0, c.duration_minutes - lessonsCompleted * 15)} min`,
        icon: cfg.icon,
        color: cfg.color,
      }
    })

  const certificates = (badges ?? [])
    .filter((b) => b.type === 'first_course_complete' || b.type === 'path_complete' || b.type === 'quiz_perfect' || b.type === 'all_courses_complete')
    .map((b) => ({
      name: b.name,
      earned: true,
      date: b.awarded_at ? new Date(b.awarded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    }))

  const coursesEnrolled = (progress ?? []).length

  const lessonsCompleted = (progress ?? []).reduce((sum: number, p: any) => {
    return sum + (p.lessons_completed?.length ?? 0)
  }, 0)

  const totalLearningMinutes = (progress ?? []).reduce((sum: number, p: any) => {
    return sum + (p.lessons_completed?.length ?? 0) * 15
  }, 0)
  const learningTime = totalLearningMinutes >= 60
    ? `${(totalLearningMinutes / 60).toFixed(1)}h`
    : `${totalLearningMinutes}m`

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Education Progress" description="Track your learning journey and certifications" icon={GraduationCap} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Education Progress"
        description="Track your learning journey and certifications"
        icon={GraduationCap}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Courses Enrolled" value={coursesEnrolled} icon={BookOpen} />
        <StatCard label="Lessons Completed" value={lessonsCompleted} icon={CheckCircle2} trend={lessonsCompleted > 0 ? { value: lessonsCompleted, positive: true } : undefined} />
        <StatCard label="Certificates Earned" value={certificates.length} icon={Award} />
        <StatCard label="Learning Time" value={learningTime} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle>Learning Paths</DashboardCardTitle>
          </DashboardCardHeader>
          <DashboardCardBody>
            {learningPaths.length === 0 ? (
              <EmptyState title="No learning paths" description="Courses will appear here once available." />
            ) : (
              <div className="space-y-4">
                {learningPaths.map((path) => {
                  const Icon = path.icon
                  return (
                    <div key={path.title} className="rounded-lg border border-white/10 p-4 hover:border-white/20 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${path.color}15` }}>
                            <Icon className="h-5 w-5" style={{ color: path.color }} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{path.title}</p>
                            <p className="text-[10px] text-white/60">{path.completed}/{path.total} lessons</p>
                          </div>
                        </div>
                        <StatusBadge
                          label={path.status === 'completed' ? 'Completed' : path.status === 'active' ? 'In Progress' : 'Not Started'}
                          variant={path.status === 'completed' ? 'success' : path.status === 'active' ? 'active' : 'idle'}
                        />
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${path.progress}%`, backgroundColor: path.color }} />
                      </div>
                      <p className="text-[10px] text-white/60 mt-1 text-right">{path.progress}%</p>
                    </div>
                  )
                })}
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>

        <div className="space-y-6">
          <DashboardCard>
            <DashboardCardHeader>
              <DashboardCardTitle>Continue Learning</DashboardCardTitle>
            </DashboardCardHeader>
            <DashboardCardBody>
              {inProgressCourses.length === 0 ? (
                <EmptyState
                  title="No courses in progress"
                  description="Start a course to see it here."
                />
              ) : (
                <div className="space-y-3">
                  {inProgressCourses.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${c.color}15` }}>
                        <c.icon className="h-4 w-4" style={{ color: c.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white">{c.title}</p>
                        <p className="text-[10px] text-white/60">{c.path} · {c.time}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${c.progress}%`, backgroundColor: c.color }} />
                          </div>
                          <span className="text-[10px] text-white/60">{c.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DashboardCardBody>
          </DashboardCard>

          <DashboardCard>
            <DashboardCardHeader>
              <DashboardCardTitle>Certificates</DashboardCardTitle>
            </DashboardCardHeader>
            <DashboardCardBody>
              {certificates.length === 0 ? (
                <EmptyState
                  title="No certificates yet"
                  description="Complete courses to earn certificates."
                />
              ) : (
                <div className="space-y-3">
                  {certificates.map((cert, i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0ecb81]/15">
                        <CheckCircle2 className="h-4 w-4 text-[#0ecb81]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white">{cert.name}</p>
                        <p className="text-[10px] text-[#0ecb81]">Earned {cert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DashboardCardBody>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}
