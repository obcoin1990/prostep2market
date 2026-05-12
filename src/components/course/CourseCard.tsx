import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users, BarChart2, BookOpen } from 'lucide-react'
import { cn, formatDuration } from '@/lib/utils'
import type { CourseCard as CourseCardType } from '@/types'

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER:     'bg-green-100 text-green-700',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-700',
  ADVANCED:     'bg-orange-100 text-orange-700',
  EXPERT:       'bg-red-100 text-red-700',
}

interface Props {
  course:   CourseCardType
  progress?: number   // 0-100, show progress bar if provided
  compact?: boolean
}

export function CourseCard({ course, progress, compact }: Props) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className={cn(
        'group flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5',
        compact ? 'p-3' : 'overflow-hidden'
      )}
    >
      {/* Thumbnail */}
      {!compact && (
        <div className="relative h-44 w-full bg-gray-100">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="h-12 w-12 text-gray-300" />
            </div>
          )}
          {/* Level badge */}
          <span
            className={cn(
              'absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-medium',
              LEVEL_COLORS[course.level]
            )}
          >
            {course.level}
          </span>
        </div>
      )}

      {/* Content */}
      <div className={cn('flex flex-col gap-2', compact ? '' : 'p-4')}>
        <p className="text-xs font-medium uppercase tracking-wide text-brand-500">
          {course.category}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-brand-600">
          {course.title}
        </h3>

        {!compact && (
          <p className="line-clamp-2 text-xs text-gray-500">{course.description}</p>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(course.durationMins)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {course._count.enrollments}
          </span>
          <span className="flex items-center gap-1">
            <BarChart2 className="h-3.5 w-3.5" />
            {course._count.modules} modules
          </span>
        </div>

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="mt-1">
            <div className="flex justify-between text-xs text-gray-500 mb-0.5">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100">
              <div
                className="h-1.5 rounded-full bg-brand-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Author */}
        {!compact && course.author?.name && (
          <div className="flex items-center gap-2 mt-1">
            {course.author.avatarUrl && (
              <Image
                src={course.author.avatarUrl}
                alt={course.author.name}
                width={20}
                height={20}
                className="rounded-full"
              />
            )}
            <span className="text-xs text-gray-500">{course.author.name}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
