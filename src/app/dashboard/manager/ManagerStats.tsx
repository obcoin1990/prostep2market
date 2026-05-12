'use client'

import { useEffect, useState } from 'react'
import { StatCard } from '@/components/dashboard/StatCard'
import { CompletionTrendChart, TopCoursesChart, ActiveUsersPie } from '@/components/dashboard/Charts'
import { Users, TrendingUp, BookOpen, AlertTriangle } from 'lucide-react'

export default function ManagerStats() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics?days=30')
      .then(r => r.json())
      .then(j => setData(j.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  if (!data) return <p className="text-sm text-red-500">Failed to load analytics.</p>

  const { summary, topCourses, completionsByDay, skillImprovements } = data

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Users"       value={summary.totalUsers}          icon={Users}         color="brand"  />
        <StatCard label="Active Rate"        value={summary.activeRate}          icon={TrendingUp}    color="green"  suffix="%" />
        <StatCard label="Completion Rate"    value={summary.completionRate}      icon={BookOpen}      color="brand"  suffix="%" />
        <StatCard label="Overdue Courses"    value={summary.overdueCount}        icon={AlertTriangle} color="red"    />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Completion trend */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Course Completions (30 days)</h3>
          <CompletionTrendChart data={completionsByDay} />
        </div>

        {/* Active users pie */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">User Activity</h3>
          <ActiveUsersPie
            active={summary.activeUsers}
            inactive={summary.totalUsers - summary.activeUsers}
          />
        </div>
      </div>

      {/* Top courses */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Courses by Enrollment</h3>
        <TopCoursesChart data={topCourses} />
      </div>

      {/* Skill improvements */}
      {skillImprovements?.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Skill Improvements</h3>
          <div className="space-y-2">
            {skillImprovements.map((s: any) => (
              <div key={s.skill} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{s.skill}</span>
                <span className="font-semibold text-brand-600">
                  {Math.round(s._avg.score)}% avg
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
