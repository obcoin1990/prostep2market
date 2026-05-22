'use client';

import { useQuery } from '@tanstack/react-query';

export interface Strategy {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at?: string;
  // common strategy-lab fields
  timeframe?: string;
  risk_per_trade?: number;
  win_rate?: number;
}

async function fetchStrategies(): Promise<Strategy[]> {
  const res = await fetch('/api/strategies');
  if (!res.ok) throw new Error('Failed to fetch strategies');
  const json = await res.json();
  return json.strategies ?? [];
}

export function useWatchlist() {
  const query = useQuery({
    queryKey: ['watchlist'],
    queryFn: fetchStrategies,
    staleTime: 5 * 60_000,
  });

  return {
    strategies: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
