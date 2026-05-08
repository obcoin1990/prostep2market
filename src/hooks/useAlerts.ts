'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Alert } from '@/types/guardian';

/**
 * Fetch alerts from API
 */
async function fetchAlerts(userId: string, options?: { acknowledged?: boolean; limit?: number; type?: string }): Promise<Alert[]> {
  const params = new URLSearchParams();
  if (options?.acknowledged !== undefined) params.set('acknowledged', String(options.acknowledged));
  if (options?.limit) params.set('limit', String(options.limit));
  if (options?.type) params.set('type', options.type);

  const response = await fetch(`/api/alerts?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch alerts');
  }
  const data = await response.json();
  return data.alerts;
}

/**
 * Acknowledge an alert via API
 */
async function acknowledgeAlert(alertId: string): Promise<Alert> {
  const response = await fetch(`/api/alerts/${alertId}/acknowledge`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    throw new Error('Failed to acknowledge alert');
  }
  const data = await response.json();
  return data.alert;
}

/**
 * Hook for managing alerts
 */
export function useAlerts(userId: string) {
  const queryClient = useQueryClient();

  // Fetch alerts query
  const { data: alerts = [], isLoading, refetch } = useQuery({
    queryKey: ['alerts', userId],
    queryFn: () => fetchAlerts(userId),
    enabled: !!userId,
    staleTime: 30000 // 30 seconds
  });

  // Acknowledge mutation
  const acknowledgeMutation = useMutation({
    mutationFn: acknowledgeAlert,
    onSuccess: () => {
      // Invalidate alerts query to refetch
      queryClient.invalidateQueries({ queryKey: ['alerts', userId] });
    }
  });

  const acknowledgeAlertFn = useCallback(async (id: string) => {
    await acknowledgeMutation.mutateAsync(id);
  }, [acknowledgeMutation]);

  const refetchAlerts = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    alerts,
    loading: isLoading,
    acknowledgeAlert: acknowledgeAlertFn,
    refetch: refetchAlerts
  };
}