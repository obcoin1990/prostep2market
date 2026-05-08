'use client';

import { Lesson } from '@/types/education';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LessonPlayer } from '@/components/education/LessonPlayer';

export function ClientLessonPlayer({ lesson, isCompleted }: { lesson: Lesson; isCompleted: boolean }) {
  const router = useRouter();
  const [completed, setCompleted] = useState(isCompleted);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkComplete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/progress/mark-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: lesson.courseId,
          lessonId: lesson.id,
        }),
      });

      if (response.ok) {
        setCompleted(true);
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LessonPlayer
      lesson={lesson}
      isCompleted={completed}
      onMarkComplete={handleMarkComplete}
    />
  );
}