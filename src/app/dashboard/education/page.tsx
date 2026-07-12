'use client'

import { GraduationCap, BookOpen, Award, TrendingUp, Clock, CheckCircle2, Sparkles, BarChart3, Shield } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { SectionHeader } from '@/components/dashboard/SectionHeader'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardBody } from '@/components/dashboard/DashboardCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const PATH_CONFIG: Record<string, { color: string; icon: typeof BookOpen }> = {
  beginner: { color: '#0ecb81', icon: BookOpen },
  intermediate: { color: '#00B4D8', icon: TrendingUp },
  'psychology-first': { color: '#8A2BE2', icon: Award },
  advanced: { color: '#9ea3ad', icon: BarChart3 },
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
    const status: 'completed' | 'active' | 'locked' = allDone ? 'completed' : noneStarted ? 'locked' : 'active'
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
        progress: progressPct,
        lessons: `${lessonsCompleted}`,
        time: `${Math.max(0, c.duration_minutes - lessonsCompleted * 15)} min remaining`,
        icon: cfg.icon,
        color: cfg.color,
      }
    })

  const certificates = (badges ?? [])
    .filter((b) => b.type === 'first_course_complete' || b.type === 'path_complete' || b.type === 'quiz_perfect' || b.type === 'all_courses_complete')
    .slice(0, 4)
    .map((b) => ({
      name: b.name,
      date: b.awarded_at ? new Date(b.awarded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      icon: Award,
      color: '#fcd535',
    }))

  const coursesCompleted = (progress ?? []).filter((p) => p.completed_at).length
  const coursesInProgress = (progress ?? []).filter((p) => !p.completed_at).length

  const streakDays = (() => {
    const dates = (progress ?? [])
      .filter((p: any) => p.completed_at)
      .map((p: any) => new Date(p.completed_at).toDateString())
    const unique = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    let streak = 0
    const now = new Date()
    for (let i = 0; i < unique.length; i++) {
      const expected = new Date(now)
      expected.setDate(expected.getDate() - i)
      if (unique[i] === expected.toDateString()) {
        streak++
      } else {
        break
      }
    }
    return streak > 0 ? `${streak} days` : '0 days'
  })()

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Education" description="Track your learning journey and certifications" icon={GraduationCap} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Education"
        description="Track your learning journey and certifications"
        icon={GraduationCap}
        action={
          <Link href="/education">
            <button className="rounded-lg bg-[#fcd535] px-3 py-1.5 text-xs font-semibold text-[#0b0e11] hover:bg-[#fde04e] transition-colors">
              Browse All Courses
            </button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Courses Completed" value={coursesCompleted} icon={CheckCircle2} />
        <StatCard label="In Progress" value={coursesInProgress} icon={BookOpen} />
        <StatCard label="Certifications" value={certificates.length} icon={Award} />
        <StatCard label="Learning Streak" value={streakDays} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard className="lg:col-span-2">
          <DashboardCardHeader>
            <DashboardCardTitle>Learning Paths</DashboardCardTitle>
            <p className="text-xs text-white/60 mt-0.5">Your structured learning journey</p>
          </DashboardCardHeader>
          <DashboardCardBody>
            {learningPaths.length === 0 ? (
              <EmptyState title="No learning paths available" description="Courses will appear here once they are added." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {learningPaths.map((p) => (
                  <div
                    key={p.title}
                    className={`rounded-lg border p-4 transition-colors ${
                      p.status === 'locked' ? 'border-white/5 opacity-50' : 'border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${p.color}15` }}>
                        <p.icon className="h-4 w-4" style={{ color: p.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{p.title}</p>
                        <StatusBadge label={p.status} variant={p.status === 'completed' ? 'success' : p.status === 'active' ? 'active' : 'idle'} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">{p.completed}/{p.total} lessons</span>
                        <span className="text-white/60">{p.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${p.progress}%`, backgroundColor: p.color }} />
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
            <DashboardCardTitle>Upcoming Quizzes</DashboardCardTitle>
            <p className="text-xs text-white/60 mt-0.5">Tests to complete this week</p>
          </DashboardCardHeader>
          <DashboardCardBody>
            <EmptyState
              title="No upcoming quizzes"
              description="Quizzes will appear here when scheduled."
            />
          </DashboardCardBody>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <DashboardCardHeader className="flex items-center justify-between">
            <DashboardCardTitle>Continue Learning</DashboardCardTitle>
            <button className="text-xs text-[#fcd535] hover:underline">View All</button>
          </DashboardCardHeader>
          <DashboardCardBody>
            {inProgressCourses.length === 0 ? (
              <EmptyState
                title="No courses in progress"
                description="Start a course to see it here."
              />
            ) : (
              <div className="space-y-3">
                {inProgressCourses.map((c) => (
                  <div key={c.title} className="flex items-center gap-3 rounded-lg border border-white/10 p-3 hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${c.color}15` }}>
                      <c.icon className="h-4 w-4" style={{ color: c.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{c.title}</p>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <span>{c.lessons} lessons</span>
                        <span>·</span>
                        <span>{c.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-white">{c.progress}%</div>
                      <div className="mt-1 h-1.5 w-16 rounded-full bg-white/5 overflow-hidden ml-auto">
                        <div className="h-full rounded-full" style={{ width: `${c.progress}%`, backgroundColor: c.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader className="flex items-center justify-between">
            <DashboardCardTitle>Certifications</DashboardCardTitle>
            <button className="text-xs text-[#fcd535] hover:underline">View All</button>
          </DashboardCardHeader>
          <DashboardCardBody>
            {certificates.length === 0 ? (
              <div className="space-y-3">
                <EmptyState
                  title="No certifications yet"
                  description="Complete courses to earn certifications."
                />
                <div className="rounded-lg border border-dashed border-white/10 p-4 text-center">
                  <Sparkles className="h-5 w-5 text-white/50 mx-auto mb-1" />
                  <p className="text-xs text-white/50">Complete Advanced Strategies to unlock next certification</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {certificates.map((c) => (
                  <div key={c.name} className="flex items-center gap-4 rounded-lg border border-white/10 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${c.color}15` }}>
                      <c.icon className="h-6 w-6" style={{ color: c.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{c.name}</p>
                      <p className="text-xs text-white/60">Earned {c.date}</p>
                    </div>
                    <StatusBadge label="Verified" variant="success" />
                  </div>
                ))}
                <div className="rounded-lg border border-dashed border-white/10 p-4 text-center">
                  <Sparkles className="h-5 w-5 text-white/50 mx-auto mb-1" />
                  <p className="text-xs text-white/50">Complete Advanced Strategies to unlock next certification</p>
                </div>
              </div>
            )}
          </DashboardCardBody>
        </DashboardCard>
      </div>
    </div>
  )
}
