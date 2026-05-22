'use client';

import { useQuery } from '@tanstack/react-query';

export interface Trade {
  id: string;
  user_id: string;
  symbol: string;
  entry_price: number;
  exit_price: number | null;
  stop_loss: number;
  take_profit: number;
  lot_size: number;
  entry_time: string;
  exit_time: string | null;
  session: string | null;
  result: 'win' | 'loss' | 'breakeven' | null;
  pnl: number | null;
  emotional_state: string | null;
  notes: string | null;
}

interface TradesResponse {
  trades: Trade[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

async function fetchOpenTrades(): Promise<Trade[]> {
  // Fetch most recent trades (open = no exit_time; we show last 10 total)
  const res = await fetch('/api/trades?limit=10&page=1');
  if (!res.ok) throw new Error('Failed to fetch trades');
  const json: TradesResponse = await res.json();
  return json.trades ?? [];
}

export function useOpenTrades() {
  const query = useQuery({
    queryKey: ['openTrades'],
    queryFn: fetchOpenTrades,
    staleTime: 60_000, // 1 min — trades change frequently
  });

  return {
    trades: query.data ?? [],
    // Trades without an exit are truly "open"
    openTrades: (query.data ?? []).filter((t) => t.exit_time === null),
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
