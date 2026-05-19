'use client';

import { Pause, PlayCircle } from 'lucide-react';
import { usePauseMode } from '@/hooks/usePauseMode';

/**
 * PauseOverlay - Full-screen overlay shown when pause mode is active
 */
export function PauseOverlay({ userId }: { userId: string }) {
  const { pauseInfo, remainingTime, resumeTrading, loading } = usePauseMode(userId);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleResume = async () => {
    try {
      await resumeTrading();
    } catch (error) {
      console.error('Failed to resume:', error);
    }
  };

  if (loading) {
    return null;
  }

  if (!pauseInfo) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
      <div className="rounded-[12px] p-8 max-w-md w-full mx-4 text-center" style={{ backgroundColor: '#1e2329', border: '1px solid #2b3139' }}>
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: 'rgba(14,203,129,0.1)' }}>
              <Pause className="w-12 h-12" style={{ color: '#0ecb81' }} />
            </div>
            <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: 'rgba(14,203,129,0.15)', animationDuration: '2s' }} />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2" style={{ color: '#ffffff' }}>Trading Paused</h2>

        <p className="mb-4" style={{ color: '#eaecef' }}>
          {pauseInfo.reason === 'system_suggested'
            ? "We noticed signs of trading fatigue. Take a break?"
            : "You've activated pause mode."}
        </p>

        {remainingTime !== null ? (
          <div className="mb-6">
            <p className="text-sm" style={{ color: '#707a8a' }}>Time remaining</p>
            <p className="text-3xl font-bold mt-1" style={{ color: '#0ecb81', fontFamily: 'var(--font-mono)' }}>
              {formatTime(remainingTime)}
            </p>
          </div>
        ) : (
          <p className="text-sm mb-6" style={{ color: '#707a8a' }}>Pause is active until you resume.</p>
        )}

        <button
          onClick={handleResume}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-[6px] font-semibold transition-colors"
          style={{ backgroundColor: '#0ecb81', color: '#ffffff' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <PlayCircle className="w-5 h-5" />
          Resume Trading
        </button>

        <p className="text-xs mt-4" style={{ color: '#707a8a' }}>
          You can still access Journal, Education, and Profile pages.
        </p>
      </div>
    </div>
  );
}