'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAlertStore } from '@/lib/risk-guardian/alertStore';
import { Alert, AlertType, Severity } from '@/types/guardian';
import { toast } from 'sonner';

/**
 * Supabase Realtime subscription hook for real-time alerts
 */
export function useAlertSubscription(userId: string) {
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);
  const addAlert = useAlertStore((state) => state.addAlert);
  const setReconnecting = useAlertStore((state) => state.setReconnecting);

  const showAlertNotification = useCallback((alertData: unknown) => {
    const alert = alertData as {
      id: string;
      type: AlertType;
      severity: Severity;
      title: string;
      message: string;
      suggested_action?: string;
      user_id: string;
      triggered_at: string;
      acknowledged: boolean;
    };

    const fullAlert: Alert = {
      id: alert.id,
      userId: alert.user_id,
      type: alert.type,
      severity: alert.severity,
      title: alert.title,
      message: alert.message,
      suggestedAction: alert.suggested_action || '',
      triggeredAt: new Date(alert.triggered_at),
      acknowledged: alert.acknowledged
    };

    // Add to store
    addAlert(fullAlert);

    // Show toast based on severity
    switch (alert.severity) {
      case 'critical':
        toast.error(fullAlert.message, {
          id: fullAlert.id,
          duration: 0,
          action: {
            label: 'View',
            onClick: () => window.location.href = '/alerts'
          },
          cancel: {
            label: 'Dismiss',
            onClick: () => toast.dismiss(fullAlert.id)
          }
        });
        break;
      case 'warning':
        toast.warning(fullAlert.message, {
          id: fullAlert.id,
          duration: 8000,
          action: {
            label: 'View',
            onClick: () => window.location.href = '/alerts'
          }
        });
        break;
      case 'info':
        toast.info(fullAlert.message, {
          id: fullAlert.id,
          duration: 5000,
          action: {
            label: 'View',
            onClick: () => window.location.href = '/alerts'
          }
        });
        break;
    }
  }, [addAlert]);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`alerts:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          showAlertNotification(payload.new);
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Connection health check every 5 minutes
    const healthCheck = setInterval(() => {
      if (channel.state !== 'joined') {
        setReconnecting(true);
        // Re-subscribe
        channel.subscribe();
        setReconnecting(false);
      }
    }, 5 * 60 * 1000);

    // Re-subscribe on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && channel.state !== 'joined') {
        channel.subscribe();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(healthCheck);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      supabase.removeChannel(channel);
    };
  }, [userId, showAlertNotification, setReconnecting]);
}

/**
 * Show alert notification (exported for use in other components)
 */
export function showAlert(alert: Alert) {
  switch (alert.severity) {
    case 'critical':
      toast.error(alert.message, {
        id: alert.id,
        duration: 0,
        action: {
          label: 'View',
          onClick: () => window.location.href = '/alerts'
        },
        cancel: {
          label: 'Dismiss',
          onClick: () => toast.dismiss(alert.id)
        }
      });
      break;
    case 'warning':
      toast.warning(alert.message, {
        id: alert.id,
        duration: 8000,
        action: {
          label: 'View',
          onClick: () => window.location.href = '/alerts'
        }
      });
      break;
    case 'info':
      toast.info(alert.message, {
        id: alert.id,
        duration: 5000,
        action: {
          label: 'View',
          onClick: () => window.location.href = '/alerts'
        }
      });
      break;
  }
}