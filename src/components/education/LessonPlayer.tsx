'use client';

import { Lesson } from '@/types/education';
import { MarkdownContent } from './MarkdownContent';
import { VideoPlayer } from './VideoPlayer';
import { CheckCircle } from 'lucide-react';

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
          <VideoPlayer 
            title={lesson.title}
            duration={`${lesson.durationMinutes} min`}
          />
        ) : lesson.type === 'reading' || lesson.type === 'interactive' ? (
          <MarkdownContent content={lesson.content} />
        ) : null}
      </div>

      {/* Mark Complete Button */}
      {!isCompleted && (
        <div className="flex justify-end">
          <button
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