'use client';

import Link from 'next/link';
import { Course } from '@/types/education';
import { Clock, BookOpen, Lock, CheckCircle, Circle } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  progress?: number;
  isEnrolled?: boolean;
  isCompleted?: boolean;
}

export function CourseCard({ course, progress = 0, isEnrolled = false, isCompleted = false }: CourseCardProps) {
  const typeLabels = {
    video: 'Video',
    interactive: 'Interactive',
    'case-study': 'Case Study',
    workshop: 'Workshop',
  };

  const typeColors = {
    video: 'bg-blue-500/10 text-blue-500',
    interactive: 'bg-purple-500/10 text-purple-500',
    'case-study': 'bg-amber-500/10 text-amber-500',
    workshop: 'bg-green-500/10 text-green-500',
  };

  const hours = Math.floor(course.durationMinutes / 60);
  const minutes = course.durationMinutes % 60;
  const durationLabel = hours > 0 
    ? `${hours}h ${minutes}m` 
    : `${minutes}m`;

  return (
    <Link href={isEnrolled ? `/education/${course.path}/courses/${course.id}` : '#'}>
      <div className={`group relative overflow-hidden rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${!isEnrolled && 'opacity-75'}`}>
        <div className="flex items-start gap-3">
          {/* Status icon */}
          <div className="mt-1">
            {!isEnrolled && <Lock className="h-4 w-4 text-muted-foreground" />}
            {isEnrolled && isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
            {isEnrolled && !isCompleted && progress > 0 && (
              <div className="h-4 w-4 rounded-full border-2 border-primary" style={{ 
                background: `conic-gradient(var(--primary) ${progress * 3.6}deg, transparent 0deg)` 
              }} />
            )}
            {isEnrolled && !isCompleted && progress === 0 && <Circle className="h-4 w-4 text-muted-foreground" />}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors truncate">
              {course.title}
            </h4>
            
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {course.description}
            </p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className={`px-1.5 py-0.5 rounded ${typeColors[course.type]}`}>
                {typeLabels[course.type]}
              </span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{durationLabel}</span>
              </div>
              {course.certificateEligible && (
                <span className="text-amber-600">Certificate</span>
              )}
            </div>

            {/* Progress bar for enrolled courses */}
            {isEnrolled && progress > 0 && (
              <div className="mt-3">
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {Math.round(progress)}% complete
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}