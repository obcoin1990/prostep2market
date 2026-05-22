'use client';

import { useQuery } from '@tanstack/react-query';

export interface Enrollment {
  id: string;
  courseId: string;
  enrolledAt: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'OVERDUE';
  progress: number; // 0–100
  completedAt: string | null;
  course: {
    title: string;
    _count: { modules: number };
  };
}

async function fetchEnrollments(): Promise<Enrollment[]> {
  const res = await fetch('/api/enrollments');
  if (!res.ok) throw new Error('Failed to fetch enrollments');
  const json = await res.json();
  // apiSuccess wraps in { data: ... }
  return json.data ?? [];
}

export function useLearningProgress() {
  const query = useQuery({
    queryKey: ['enrollments'],
    queryFn: fetchEnrollments,
    staleTime: 5 * 60_000,
  });

  return {
    enrollments: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
