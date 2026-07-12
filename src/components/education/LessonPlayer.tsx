'use client';

import dynamic from 'next/dynamic';
import { Lesson } from '@/types/education';
import { Play, CheckCircle } from 'lucide-react';

const MarkdownContent = dynamic(
  () => import('./MarkdownContent').then(mod => ({ default: mod.MarkdownContent })),
  { ssr: false }
);

interface LessonPlayerProps {
  lesson: Lesson;
  isCompleted: boolean;
  onMarkComplete: () => void;
}

export function LessonPlayer({ lesson, isCompleted, onMarkComplete }: LessonPlayerProps) {
  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="capitalize">{lesson.type}</span>
            <span>{lesson.durationMinutes} min</span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle className="h-4 w-4" />
                Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="rounded-lg border bg-card p-6">
        {lesson.type === 'video' ? (
          <div className="relative aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted-foreground/10 mb-4">
                <Play className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">{lesson.title}</h3>
              <p className="text-sm text-muted-foreground">Duration: {lesson.durationMinutes} min</p>
              <p className="text-sm text-muted-foreground mt-2">Video content will be available soon</p>
            </div>
          </div>
        ) : lesson.type === 'reading' || lesson.type === 'interactive' ? (
          <MarkdownContent content={lesson.content} />
        ) : null}
      </div>

      {/* Mark Complete Button */}
      {!isCompleted && (
        <div className="flex justify-end">
          <button type="button" 
            onClick={onMarkComplete}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            Mark as Complete
          </button>
        </div>
      )}

      {/* Completion indicator */}
      {isCompleted && (
        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-center">
          <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
          <p className="text-green-500 font-medium">Lesson Completed</p>
          <p className="text-sm text-muted-foreground">Continue to the next lesson</p>
        </div>
      )}
    </div>
  );
}