import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LessonSidebar } from '@/components/lesson/LessonSidebar'
import { LessonContent } from './LessonContent'

interface Props {
  params: Promise<{ id: string; lessonId: string }>
}

export default async function LessonPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const { id: courseId, lessonId } = await params

  // Verify enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  })
  if (!enrollment) redirect(`/courses/${courseId}`)

  // Fetch course with all modules/lessons
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            include: { quiz: { select: { id: true } } },
          },
        },
      },
    },
  })
  if (!course) notFound()

  // Fetch active lesson
  const lesson = await prisma.lesson.findUnique({
    where:   { id: lessonId },
    include: {
      quiz: {
        include: {
          questions: {
            orderBy: { order: 'asc' },
            include: { options: { orderBy: { order: 'asc' }, select: { id: true, text: true, order: true } } },
          },
        },
      },
    },
  })
  if (!lesson) notFound()

  // Fetch all lesson progress for this enrollment
  const allProgress = await prisma.lessonProgress.findMany({
    where:  { enrollmentId: enrollment.id },
    select: { lessonId: true, completed: true, watchedSec: true },
  })

  const lessonProgress = allProgress.find(p => p.lessonId === lessonId)

  // Quiz attempt history
  const quizHistory = lesson.quiz
    ? await prisma.quizAttempt.findMany({
        where:   { quizId: lesson.quiz.id, userId: session.user.id },
        orderBy: { startedAt: 'desc' },
      })
    : []

  // Find next lesson
  const allLessons = course.modules.flatMap(m => m.lessons)
  const currentIdx = allLessons.findIndex(l => l.id === lessonId)
  const nextLesson = allLessons[currentIdx + 1] ?? null

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <LessonSidebar
        courseId={courseId}
        courseTitle={course.title}
        modules={course.modules as any}
        lessonProgress={allProgress}
        activeLessonId={lessonId}
      />

      <main className="flex-1 overflow-y-auto">
        <LessonContent
          lesson={lesson as any}
          enrollmentId={enrollment.id}
          lessonProgress={lessonProgress ?? null}
          quizHistory={quizHistory}
          nextLesson={nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null}
          courseId={courseId}
        />
      </main>
    </div>
  )
}
