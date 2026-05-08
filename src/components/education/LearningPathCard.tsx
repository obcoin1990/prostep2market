'use client';

import Link from 'next/link';
import { LearningPathConfig } from '@/types/education';
import { ProgressBar } from './ProgressBar';
import { BookOpen, Clock, Users } from 'lucide-react';

// Utility function for className combination
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface LearningPathCardProps {
  path: LearningPathConfig;
  progress?: number;
}

export function LearningPathCard({ path, progress = 0 }: LearningPathCardProps) {
  const totalCourses = path.courses.length;
  const totalMinutes = path.courses.reduce((sum, course) => sum + course.durationMinutes, 0);
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const durationLabel = hours > 0 
    ? `${hours}h ${minutes}m` 
    : `${minutes}m`;

  const pathColors = {
    beginner: 'from-green-500 to-emerald-600',
    intermediate: 'from-blue-500 to-indigo-600',
    advanced: 'from-purple-500 to-violet-600',
    'psychology-first': 'from-orange-500 to-amber-600',
  };

  const iconBgColors = {
    beginner: 'bg-green-500/10 text-green-500',
    intermediate: 'bg-blue-500/10 text-blue-500',
    advanced: 'bg-purple-500/10 text-purple-500',
    'psychology-first': 'bg-orange-500/10 text-orange-500',
  };

  return (
    <Link href={`/education/${path.id}`}>
      <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
        {/* Gradient accent bar */}
        <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${pathColors[path.id]}`} />
        
        <div className="flex items-start justify-between mb-4">
          <div className={cn('rounded-lg p-2.5', iconBgColors[path.id])}>
            <BookOpen className="h-5 w-5" />
          </div>
          {totalCourses > 0 && (
            <span className="text-sm text-muted-foreground">
              {totalCourses} course{totalCourses !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {path.name}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {path.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {path.recommendedFor.slice(0, 2).map((tag) => (
            <span 
              key={tag} 
              className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Duration */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{durationLabel}</span>
          </div>
          {path.courses.filter(c => c.certificateEligible).length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{path.courses.filter(c => c.certificateEligible).length} certifiable</span>
            </div>
          )}
        </div>

        {/* Progress */}
        {totalCourses > 0 && (
          <ProgressBar 
            progress={progress} 
            label={`${Math.round((progress / 100) * totalCourses)}/${totalCourses} completed`}
            size="sm"
          />
        )}
      </div>
    </Link>
  );
}