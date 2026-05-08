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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        {/* Animated pause icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#2E7D32]/10 flex items-center justify-center animate-pulse">
              <Pause className="w-12 h-12 text-[#2E7D32]" />
            </div>
            <div className="absolute inset-0 rounded-full bg-[#2E7D32]/20 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trading Paused</h2>

        {/* Message based on reason */}
        <p className="text-gray-600 mb-4">
          {pauseInfo.reason === 'system_suggested' 
            ? "We noticed signs of trading fatigue. Take a break?"
            : "You've activated pause mode."}
        </p>

        {/* Countdown timer or manual message */}
        {remainingTime !== null ? (
          <div className="mb-6">
            <p className="text-sm text-gray-500">Time remaining</p>
            <p className="text-3xl font-mono font-bold text-[#2E7D32] mt-1">
              {formatTime(remainingTime)}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-6">
            Pause is active until you resume.
          </p>
        )}

        {/* Resume button */}
        <button
          onClick={handleResume}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#2E7D32] text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <PlayCircle className="w-5 h-5" />
          Resume Trading
        </button>

        <p className="text-xs text-gray-400 mt-4">
          You can still access Journal, Education, and Profile pages.
        </p>
      </div>
    </div>
  );
}