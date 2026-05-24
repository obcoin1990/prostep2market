'use client'

import { useState, useEffect, useCallback, Fragment } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Alert } from '@/components/ui/alert'
import { toast } from 'sonner'
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  GraduationCap,
  Users,
  BarChart3,
  CheckSquare,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Course {
  id: string
  title: string
  path: string
  type: string
  description: string
  duration_minutes: number
  order_index: number
  certificate_eligible: boolean
  lesson_count: number
  enrollment_count: number
}

interface Lesson {
  id: string
  course_id: string
  title: string
  content: string
  type: string
  duration_minutes: number
  order_index: number
}

interface Analytics {
  totalEnrollments: number
  completionRate: number
  avgQuizScore: number
}

interface Props {
  initialCourses: Course[]
  analytics: Analytics
}

// ─── Constants ────────────────────────────────────────────────────────────────

// DB CHECK: path IN ('beginner', 'intermediate', 'advanced', 'psychology-first')
const PATHS = ['beginner', 'intermediate', 'advanced', 'psychology-first']
// DB CHECK: type IN ('video', 'interactive', 'case-study', 'workshop')
const COURSE_TYPES = ['video', 'interactive', 'case-study', 'workshop']
// DB CHECK: type IN ('reading', 'video', 'interactive')
const LESSON_TYPES = ['reading', 'video', 'interactive']

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pathBadgeVariant(path: string) {
  const map: Record<string, string> = {
    beginner: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700',
    'psychology-first': 'bg-amber-100 text-amber-700',
  }
  return map[path] ?? 'bg-gray-100 text-[#374151]'
}

function typeBadgeVariant(type: string) {
  const map: Record<string, string> = {
    video: 'bg-blue-50 text-blue-700',
    quiz: 'bg-orange-50 text-orange-700',
    case_study: 'bg-violet-50 text-violet-700',
    mixed: 'bg-teal-50 text-teal-700',
    text: 'bg-gray-50 text-[#374151]',
    exercise: 'bg-pink-50 text-pink-700',
  }
  return map[type] ?? 'bg-gray-100 text-[#374151]'
}

// ─── Course Form ──────────────────────────────────────────────────────────────

interface CourseFormData {
  title: string
  path: string
  type: string
  description: string
  duration_minutes: number
  order_index: number
  certificate_eligible: boolean
}

const emptyCourseForm = (): CourseFormData => ({
  title: '',
  path: 'beginner',
  type: 'video',
  description: '',
  duration_minutes: 0,
  order_index: 0,
  certificate_eligible: false,
})

function CourseForm({
  initial,
  onSave,
  onCancel,
  loading,
}: {
  initial?: Partial<CourseFormData>
  onSave: (data: CourseFormData) => void
  onCancel: () => void
  loading: boolean
}) {
  const [form, setForm] = useState<CourseFormData>({ ...emptyCourseForm(), ...initial })

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Course title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Path *</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
            value={form.path}
            onChange={(e) => setForm((f) => ({ ...f, path: e.target.value }))}
          >
            {PATHS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          >
            {COURSE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
          <input
            type="number"
            min={0}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
            value={form.duration_minutes}
            onChange={(e) => setForm((f) => ({ ...f, duration_minutes: Number(e.target.value) }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
          <input
            type="number"
            min={0}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
            value={form.order_index}
            onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))}
          />
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            id="cert"
            checked={form.certificate_eligible}
            onChange={(e) => setForm((f) => ({ ...f, certificate_eligible: e.target.checked }))}
            className="w-4 h-4 rounded border-gray-300 accent-[#E53935]"
          />
          <label htmlFor="cert" className="text-sm font-medium text-gray-700">Certificate Eligible</label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Course description"
        />
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          <X className="h-4 w-4 mr-1" /> Cancel
        </Button>
        <Button
          onClick={() => onSave(form)}
          disabled={loading || !form.title}
          className="bg-[#E53935] hover:bg-[#C62828] text-white"
        >
          {loading ? 'Saving…' : 'Save Course'}
        </Button>
      </div>
    </div>
  )
}

// ─── Lesson Form ──────────────────────────────────────────────────────────────

interface LessonFormData {
  course_id: string
  title: string
  content: string
  type: string
  duration_minutes: number
  order_index: number
}

function LessonForm({
  courseId,
  initial,
  onSave,
  onCancel,
  loading,
}: {
  courseId: string
  initial?: Partial<LessonFormData>
  onSave: (data: LessonFormData) => void
  onCancel: () => void
  loading: boolean
}) {
  const [form, setForm] = useState<LessonFormData>({
    course_id: courseId,
    title: '',
    content: '',
    type: 'video',
    duration_minutes: 0,
    order_index: 0,
    ...initial,
  })

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Lesson title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          >
            {LESSON_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
          <input
            type="number"
            min={0}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
            value={form.duration_minutes}
            onChange={(e) => setForm((f) => ({ ...f, duration_minutes: Number(e.target.value) }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
          <input
            type="number"
            min={0}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
            value={form.order_index}
            onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          placeholder="Lesson content (markdown supported)"
        />
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          <X className="h-4 w-4 mr-1" /> Cancel
        </Button>
        <Button
          onClick={() => onSave(form)}
          disabled={loading || !form.title}
          className="bg-[#E53935] hover:bg-[#C62828] text-white"
        >
          {loading ? 'Saving…' : 'Save Lesson'}
        </Button>
      </div>
    </div>
  )
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function EducationManagerClient({ initialCourses, analytics }: Props) {
  const [tab, setTab] = useState('courses')
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [loadingLessons, setLoadingLessons] = useState(false)

  // Course form state
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [courseFormLoading, setCourseFormLoading] = useState(false)

  // Lesson form state
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [lessonFormLoading, setLessonFormLoading] = useState(false)

  const fetchLessons = useCallback(async (courseId: string) => {
    if (!courseId) { setLessons([]); return }
    setLoadingLessons(true)
    try {
      const res = await fetch(`/api/admin/education/lessons?course_id=${courseId}`)
      const json = await res.json()
      if (json.success) setLessons(json.data ?? [])
      else toast.error(json.error ?? 'Failed to fetch lessons')
    } catch {
      toast.error('Network error fetching lessons')
    } finally {
      setLoadingLessons(false)
    }
  }, [])

  useEffect(() => {
    if (tab === 'lessons' && selectedCourseId) {
      fetchLessons(selectedCourseId)
    }
  }, [tab, selectedCourseId, fetchLessons])

  // ── Course CRUD ──

  async function handleCreateCourse(data: CourseFormData) {
    setCourseFormLoading(true)
    try {
      const res = await fetch('/api/admin/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) {
        setCourses((prev) => [...prev, { ...json.data, lesson_count: 0, enrollment_count: 0 }])
        setShowCourseForm(false)
        toast.success('Course created')
      } else {
        toast.error(json.error ?? 'Failed to create course')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setCourseFormLoading(false)
    }
  }

  async function handleUpdateCourse(data: CourseFormData) {
    if (!editingCourse) return
    setCourseFormLoading(true)
    try {
      const res = await fetch(`/api/admin/education/${editingCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) {
        setCourses((prev) =>
          prev.map((c) =>
            c.id === editingCourse.id
              ? { ...c, ...json.data }
              : c
          )
        )
        setEditingCourse(null)
        toast.success('Course updated')
      } else {
        toast.error(json.error ?? 'Failed to update course')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setCourseFormLoading(false)
    }
  }

  async function handleDeleteCourse(id: string) {
    if (!confirm('Delete this course? All lessons will also be deleted.')) return
    try {
      const res = await fetch(`/api/admin/education/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setCourses((prev) => prev.filter((c) => c.id !== id))
        toast.success('Course deleted')
      } else {
        toast.error(json.error ?? 'Failed to delete course')
      }
    } catch {
      toast.error('Network error')
    }
  }

  // ── Lesson CRUD ──

  async function handleCreateLesson(data: LessonFormData) {
    setLessonFormLoading(true)
    try {
      const res = await fetch('/api/admin/education/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) {
        setLessons((prev) => [...prev, json.data])
        setCourses((prev) =>
          prev.map((c) =>
            c.id === data.course_id ? { ...c, lesson_count: c.lesson_count + 1 } : c
          )
        )
        setShowLessonForm(false)
        toast.success('Lesson created')
      } else {
        toast.error(json.error ?? 'Failed to create lesson')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLessonFormLoading(false)
    }
  }

  async function handleUpdateLesson(data: LessonFormData) {
    if (!editingLesson) return
    setLessonFormLoading(true)
    try {
      const res = await fetch(`/api/admin/education/lessons/${editingLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) {
        setLessons((prev) => prev.map((l) => (l.id === editingLesson.id ? { ...l, ...json.data } : l)))
        setEditingLesson(null)
        toast.success('Lesson updated')
      } else {
        toast.error(json.error ?? 'Failed to update lesson')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLessonFormLoading(false)
    }
  }

  async function handleDeleteLesson(id: string, courseId: string) {
    if (!confirm('Delete this lesson?')) return
    try {
      const res = await fetch(`/api/admin/education/lessons/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setLessons((prev) => prev.filter((l) => l.id !== id))
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId ? { ...c, lesson_count: Math.max(0, c.lesson_count - 1) } : c
          )
        )
        toast.success('Lesson deleted')
      } else {
        toast.error(json.error ?? 'Failed to delete lesson')
      }
    } catch {
      toast.error('Network error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E53935]/10 rounded-lg">
            <GraduationCap className="h-6 w-6 text-[#E53935]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0A0F1C]">Education Manager</h1>
            <p className="text-sm text-gray-500">Manage courses, lessons, and learning analytics</p>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="courses">
            <BookOpen className="h-4 w-4 mr-2" /> Courses
          </TabsTrigger>
          <TabsTrigger value="lessons">
            <CheckSquare className="h-4 w-4 mr-2" /> Lessons
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" /> Analytics
          </TabsTrigger>
        </TabsList>

        {/* ── Courses Tab ── */}
        <TabsContent value="courses">
          <Card variant="light" className="border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">All Courses</CardTitle>
              <Button
                className="bg-[#E53935] hover:bg-[#C62828] text-white"
                onClick={() => { setShowCourseForm(true); setEditingCourse(null) }}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Course
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {showCourseForm && !editingCourse && (
                <CourseForm
                  onSave={handleCreateCourse}
                  onCancel={() => setShowCourseForm(false)}
                  loading={courseFormLoading}
                />
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                      <th className="text-left py-3 px-4">Title</th>
                      <th className="text-left py-3 px-4">Path</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Duration</th>
                      <th className="text-center py-3 px-4">Cert</th>
                      <th className="text-center py-3 px-4">Lessons</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-400">
                          No courses yet. Add your first course above.
                        </td>
                      </tr>
                    )}
                    {courses.map((course) => (
                      <Fragment key={course.id}>
                        <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-medium text-[#0A0F1C]">{course.title}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pathBadgeVariant(course.path)}`}>
                              {course.path}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeBadgeVariant(course.type)}`}>
                              {course.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{course.duration_minutes}m</td>
                          <td className="py-3 px-4 text-center">
                            {course.certificate_eligible ? (
                              <span className="text-emerald-600 font-semibold">✓</span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant="outline">{course.lesson_count}</Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                className="h-8 px-3 text-xs"
                                onClick={() => {
                                  setEditingCourse(course)
                                  setShowCourseForm(false)
                                }}
                              >
                                <Pencil className="h-3 w-3 mr-1" /> Edit
                              </Button>
                              <Button
                                variant="outline"
                                className="h-8 px-3 text-xs text-[#E53935] border-[#E53935] hover:bg-[#E53935]/5"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" /> Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {editingCourse?.id === course.id && (
                          <tr key={`${course.id}-edit`}>
                            <td colSpan={7} className="py-2 px-4">
                              <CourseForm
                                initial={editingCourse}
                                onSave={handleUpdateCourse}
                                onCancel={() => setEditingCourse(null)}
                                loading={courseFormLoading}
                              />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Lessons Tab ── */}
        <TabsContent value="lessons">
          <Card variant="light" className="border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
              <CardTitle className="text-lg font-semibold">Lessons</CardTitle>
              <div className="flex items-center gap-3">
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value)
                    setShowLessonForm(false)
                    setEditingLesson(null)
                    if (e.target.value) fetchLessons(e.target.value)
                    else setLessons([])
                  }}
                >
                  <option value="">— Select a course —</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
                {selectedCourseId && (
                  <Button
                    className="bg-[#E53935] hover:bg-[#C62828] text-white"
                    onClick={() => { setShowLessonForm(true); setEditingLesson(null) }}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Lesson
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedCourseId && (
                <Alert className="bg-blue-50 border-blue-200 text-blue-700">
                  Select a course to manage its lessons.
                </Alert>
              )}

              {showLessonForm && selectedCourseId && !editingLesson && (
                <LessonForm
                  courseId={selectedCourseId}
                  onSave={handleCreateLesson}
                  onCancel={() => setShowLessonForm(false)}
                  loading={lessonFormLoading}
                />
              )}

              {selectedCourseId && (
                <>
                  {loadingLessons ? (
                    <div className="py-8 text-center text-gray-400">Loading lessons…</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                            <th className="text-left py-3 px-4">Title</th>
                            <th className="text-left py-3 px-4">Type</th>
                            <th className="text-center py-3 px-4">Duration</th>
                            <th className="text-center py-3 px-4">Order</th>
                            <th className="text-right py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lessons.length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-gray-400">
                                No lessons yet. Add the first lesson above.
                              </td>
                            </tr>
                          )}
                          {lessons.map((lesson) => (
                            <Fragment key={lesson.id}>
                              <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 font-medium text-[#0A0F1C]">{lesson.title}</td>
                                <td className="py-3 px-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeBadgeVariant(lesson.type)}`}>
                                    {lesson.type}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center text-gray-600">{lesson.duration_minutes}m</td>
                                <td className="py-3 px-4 text-center text-gray-600">{lesson.order_index}</td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      variant="outline"
                                      className="h-8 px-3 text-xs"
                                      onClick={() => {
                                        setEditingLesson(lesson)
                                        setShowLessonForm(false)
                                      }}
                                    >
                                      <Pencil className="h-3 w-3 mr-1" /> Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="h-8 px-3 text-xs text-[#E53935] border-[#E53935] hover:bg-[#E53935]/5"
                                      onClick={() => handleDeleteLesson(lesson.id, lesson.course_id)}
                                    >
                                      <Trash2 className="h-3 w-3 mr-1" /> Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                              {editingLesson?.id === lesson.id && (
                                <tr key={`${lesson.id}-edit`}>
                                  <td colSpan={5} className="py-2 px-4">
                                    <LessonForm
                                      courseId={selectedCourseId}
                                      initial={editingLesson}
                                      onSave={handleUpdateLesson}
                                      onCancel={() => setEditingLesson(null)}
                                      loading={lessonFormLoading}
                                    />
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Analytics Tab ── */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="light" className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Enrollments</p>
                    <p className="text-2xl font-bold text-[#0A0F1C]">{analytics.totalEnrollments.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="light" className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <CheckSquare className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completion Rate</p>
                    <p className="text-2xl font-bold text-[#0A0F1C]">{analytics.completionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="light" className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg Quiz Score</p>
                    <p className="text-2xl font-bold text-[#0A0F1C]">{analytics.avgQuizScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card variant="light" className="border border-gray-200 mt-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Course Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                      <th className="text-left py-3 px-4">Course</th>
                      <th className="text-left py-3 px-4">Path</th>
                      <th className="text-center py-3 px-4">Enrollments</th>
                      <th className="text-center py-3 px-4">Lessons</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id} className="border-b border-gray-50">
                        <td className="py-3 px-4 font-medium text-[#0A0F1C]">{course.title}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pathBadgeVariant(course.path)}`}>
                            {course.path}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">{course.enrollment_count}</td>
                        <td className="py-3 px-4 text-center">{course.lesson_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
