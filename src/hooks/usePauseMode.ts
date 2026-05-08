'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PauseMode } from '@/types/guardian';

interface UsePauseModeReturn {
  isPaused: boolean;
  pauseInfo: PauseMode | null;
  remainingTime: number | null;
  activatePause: (durationMinutes?: number, reason?: 'user_initiated' | 'system_suggested') => Promise<void>;
  resumeTrading: () => Promise<void>;
  loading: boolean;
}

/**
 * Hook for managing pause mode state client-side
 */
export function usePauseMode(userId: string): UsePauseModeReturn {
  const [isPaused, setIsPaused] = useState(false);
  const [pauseInfo, setPauseInfo] = useState<PauseMode | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch current pause status
  const fetchPauseStatus = useCallback(async () => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/guardian/pause/status');
      const data = await response.json();
      
      if (data.pauseMode) {
        setIsPaused(true);
        setPauseInfo({
          active: data.pauseMode.active,
          startedAt: new Date(data.pauseMode.startedAt),
          durationMinutes: data.pauseMode.durationMinutes,
          reason: data.pauseMode.reason
        });
      } else {
        setIsPaused(false);
        setPauseInfo(null);
        setRemainingTime(null);
      }
    } catch (error) {
      console.error('Error fetching pause status:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchPauseStatus();
  }, [fetchPauseStatus]);

  // Countdown timer
  useEffect(() => {
    if (!isPaused || !pauseInfo?.durationMinutes) {
      setRemainingTime(null);
      return;
    }

    const calculateRemaining = () => {
      if (!pauseInfo?.startedAt || !pauseInfo?.durationMinutes) return null;
      
      const elapsed = Date.now() - new Date(pauseInfo.startedAt).getTime();
      const totalMs = pauseInfo.durationMinutes * 60 * 1000;
      const remaining = totalMs - elapsed;
      
      return remaining > 0 ? remaining : 0;
    };

    setRemainingTime(calculateRemaining());

    intervalRef.current = setInterval(() => {
      const remaining = calculateRemaining();
      setRemainingTime(remaining);
      
      // Auto-expire when time reaches 0
      if (remaining !== null && remaining <= 0) {
        setIsPaused(false);
        setPauseInfo(null);
        setRemainingTime(null);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, pauseInfo]);

  // Activate pause
  const activatePause = useCallback(async (durationMinutes?: number, reason: 'user_initiated' | 'system_suggested' = 'user_initiated') => {
    try {
      const response = await fetch('/api/guardian/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          durationMinutes: durationMinutes ?? null,
          reason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to activate pause');
      }

      const data = await response.json();
      
      setIsPaused(true);
      setPauseInfo({
        active: true,
        startedAt: new Date(data.pauseMode.startedAt),
        durationMinutes: data.pauseMode.durationMinutes,
        reason: data.pauseMode.reason
      });
    } catch (error) {
      console.error('Error activating pause:', error);
      throw error;
    }
  }, []);

  // Resume trading
  const resumeTrading = useCallback(async () => {
    try {
      const response = await fetch('/api/guardian/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to resume trading');
      }

      setIsPaused(false);
      setPauseInfo(null);
      setRemainingTime(null);
    } catch (error) {
      console.error('Error resuming trading:', error);
      throw error;
    }
  }, []);

  return {
    isPaused,
    pauseInfo,
    remainingTime,
    activatePause,
    resumeTrading,
    loading
  };
}