'use client';

import { useQuery } from '@tanstack/react-query';

export interface Certificate {
  id: string;
  courseId: string;
  title: string;
  issueDate: string;
  verificationToken: string;
  course: {
    id: string;
    title: string;
    author: { name: string | null } | null;
  } | null;
}

async function fetchCertificates(): Promise<Certificate[]> {
  const res = await fetch('/api/certificates');
  if (!res.ok) throw new Error('Failed to fetch certificates');
  const json = await res.json();
  // apiSuccess wraps in { data: ... }
  return json.data ?? [];
}

export function useCertificates() {
  const query = useQuery({
    queryKey: ['certificates'],
    queryFn: fetchCertificates,
    staleTime: 10 * 60_000,
  });

  return {
    certificates: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
