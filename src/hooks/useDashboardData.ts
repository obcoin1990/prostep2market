'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * Edge Score data structure from API
 */
export interface EdgeScoreData {
  score: {
    disciplineScore: number;
    riskScore: number;
    emotionalStabilityScore: number;
    consistencyScore: number;
    strategyAdherenceScore: number;
    compositeScore: number;
    rank: string;
    date: string;
  } | null;
  tips: Array<{
    level: 'warning' | 'improvement' | 'success';
    message: string;
    category: string;
  }>;
  behavioralTriggers?: string[];
  isNewUser: boolean;
}

/**
 * Edge Score History data structure
 */
export interface EdgeScoreHistory {
  history: Array<{
    date: string;
    disciplineScore: number;
    riskScore: number;
    emotionalStabilityScore: number;
    consistencyScore: number;
    strategyAdherenceScore: number;
    compositeScore: number;
    rank: string;
  }>;
  sparklineData: Array<{
    date: string;
    score: number;
  }>;
  days: number;
  totalRecords: number;
}

/**
 * Dashboard Analytics data structure
 */
export interface DashboardAnalytics {
  aiAlerts: Array<{
    id: string;
    date: string;
    [key: string]: unknown;
  }>;
  tradeStats: {
    pairs: Array<{
      pair: string;
      totalTrades: number;
      winRate: number;
      avgRR: number;
    }>;
    times: Array<{
      session: string;
      winRate: number;
      avgRR: number;
      totalTrades: number;
    }>;
  };
  heatmap: Array<{
    dayOfWeek: number;
    session: string;
    totalTrades: number;
    totalPnl: number;
    winRate: number;
    avgRR: number;
  }>;
  insights: Array<{
    [key: string]: unknown;
  }>;
}

/**
 * Leaderboard data structure
 */
export interface LeaderboardData {
  entries: Array<{
    rank: number;
    userId: string;
    displayName: string;
    compositeScore: number;
    rankLabel: string;
    isCurrentUser: boolean;
    visibility: 'public' | 'anonymous' | 'hidden';
    avatarUrl: string | null;
  }>;
  userRank: { rank: number; score: number } | null;
  period: 'weekly' | 'monthly' | 'all-time';
  pagination: {
    total: number;
    hasMore: boolean;
  };
}

/**
 * Guardian Settings data structure
 */
export interface GuardianSettings {
  userId: string;
  maxSessionDuration: number;
  maxTradesPerSession: number;
  maxTradesPerWindow: number;
  exposureMultiplier: number;
  fatigueWarningEnabled: boolean;
  revengeTradingAlertEnabled: boolean;
  emotionalInstabilityThreshold: number;
}

/**
 * Fetch edge score data
 */
async function fetchEdgeScore(): Promise<EdgeScoreData> {
  const response = await fetch('/api/scores');
  if (!response.ok) {
    throw new Error('Failed to fetch edge score');
  }
  return response.json();
}

/**
 * Fetch edge score history
 */
async function fetchEdgeScoreHistory(days: number = 30): Promise<EdgeScoreHistory> {
  const response = await fetch(`/api/scores/history?days=${days}`);
  if (!response.ok) {
    throw new Error('Failed to fetch edge score history');
  }
  return response.json();
}

/**
 * Fetch dashboard analytics
 */
async function fetchDashboardAnalytics(days: number = 7): Promise<DashboardAnalytics> {
  const response = await fetch(`/api/analytics/dashboard?days=${days}`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard analytics');
  }
  return response.json();
}

/**
 * Fetch leaderboard data
 */
async function fetchLeaderboard(period: 'weekly' | 'monthly' | 'all-time' = 'monthly'): Promise<LeaderboardData> {
  const response = await fetch(`/api/leaderboard?period=${period}&limit=100`);
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }
  return response.json();
}

/**
 * Fetch guardian settings
 */
async function fetchGuardianSettings(): Promise<{ settings: GuardianSettings }> {
  const response = await fetch('/api/guardian/settings');
  if (!response.ok) {
    throw new Error('Failed to fetch guardian settings');
  }
  return response.json();
}

interface UseDashboardDataOptions {
  days?: number;
  leaderboardPeriod?: 'weekly' | 'monthly' | 'all-time';
}

/**
 * Hook for fetching all dashboard data
 * Manages scores, analytics, leaderboard, and guardian settings
 */
export function useDashboardData(options: UseDashboardDataOptions = {}) {
  const { days = 30, leaderboardPeriod = 'monthly' } = options;

  // Edge Score query
  const edgeScoreQuery = useQuery({
    queryKey: ['edgeScore'],
    queryFn: fetchEdgeScore,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Edge Score History query
  const edgeScoreHistoryQuery = useQuery({
    queryKey: ['edgeScoreHistory', days],
    queryFn: () => fetchEdgeScoreHistory(days),
    staleTime: 5 * 60 * 1000,
  });

  // Dashboard Analytics query
  const analyticsQuery = useQuery({
    queryKey: ['dashboardAnalytics', days],
    queryFn: () => fetchDashboardAnalytics(days),
    staleTime: 5 * 60 * 1000,
  });

  // Leaderboard query
  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard', leaderboardPeriod],
    queryFn: () => fetchLeaderboard(leaderboardPeriod),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Guardian Settings query
  const guardianSettingsQuery = useQuery({
    queryKey: ['guardianSettings'],
    queryFn: fetchGuardianSettings,
    staleTime: 10 * 60 * 1000,
  });

  // Refetch all data
  const refetchAll = useCallback(async () => {
    await Promise.all([
      edgeScoreQuery.refetch(),
      edgeScoreHistoryQuery.refetch(),
      analyticsQuery.refetch(),
      leaderboardQuery.refetch(),
      guardianSettingsQuery.refetch(),
    ]);
  }, [
    edgeScoreQuery,
    edgeScoreHistoryQuery,
    analyticsQuery,
    leaderboardQuery,
    guardianSettingsQuery,
  ]);

  const isLoading =
    edgeScoreQuery.isLoading ||
    edgeScoreHistoryQuery.isLoading ||
    analyticsQuery.isLoading ||
    leaderboardQuery.isLoading ||
    guardianSettingsQuery.isLoading;

  const isError =
    edgeScoreQuery.isError ||
    edgeScoreHistoryQuery.isError ||
    analyticsQuery.isError ||
    leaderboardQuery.isError ||
    guardianSettingsQuery.isError;

  return {
    // Individual query data
    edgeScore: edgeScoreQuery.data,
    edgeScoreHistory: edgeScoreHistoryQuery.data,
    analytics: analyticsQuery.data,
    leaderboard: leaderboardQuery.data,
    guardianSettings: guardianSettingsQuery.data?.settings,

    // Loading states
    isLoadingEdgeScore: edgeScoreQuery.isLoading,
    isLoadingHistory: edgeScoreHistoryQuery.isLoading,
    isLoadingAnalytics: analyticsQuery.isLoading,
    isLoadingLeaderboard: leaderboardQuery.isLoading,
    isLoadingGuardianSettings: guardianSettingsQuery.isLoading,
    isLoading,

    // Error states
    edgeScoreError: edgeScoreQuery.error,
    historyError: edgeScoreHistoryQuery.error,
    analyticsError: analyticsQuery.error,
    leaderboardError: leaderboardQuery.error,
    guardianSettingsError: guardianSettingsQuery.error,
    isError,

    // Refetch
    refetchAll,
    refetchEdgeScore: edgeScoreQuery.refetch,
    refetchHistory: edgeScoreHistoryQuery.refetch,
    refetchAnalytics: analyticsQuery.refetch,
    refetchLeaderboard: leaderboardQuery.refetch,
    refetchGuardianSettings: guardianSettingsQuery.refetch,
  };
}
