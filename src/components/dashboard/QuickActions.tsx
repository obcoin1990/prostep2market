'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, BookOpen, Play, Pause, PlayCircle } from 'lucide-react';
import { usePauseMode } from '@/hooks/usePauseMode';

/**
 * QuickActions - Dashboard quick action buttons (DASH-08)
 */
export function QuickActions({ userId }: { userId: string }) {
  const router = useRouter();
  const { isPaused, remainingTime, activatePause, resumeTrading, loading } = usePauseMode(userId);
  const [showModal, setShowModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [systemSuggested, setSystemSuggested] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handlePauseClick = () => {
    setSelectedDuration(null);
    setSystemSuggested(false);
    setShowModal(true);
  };

  const handleActivatePause = async () => {
    try {
      await activatePause(selectedDuration ?? undefined, systemSuggested ? 'system_suggested' : 'user_initiated');
      setShowModal(false);
    } catch (error) {
      console.error('Failed to activate pause:', error);
    }
  };

  const handleResume = async () => {
    try {
      await resumeTrading();
    } catch (error) {
      console.error('Failed to resume:', error);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const durationOptions = [
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 60, label: '60 min' },
    { value: null, label: 'Manual' }
  ];

  if (loading) {
    return (
      <div className="flex gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 w-24 rounded-md" style={{ backgroundColor: '#2b3139' }} />
        ))}
      </div>
    );
  }

  const actionBtnStyle = {
    backgroundColor: '#1e2329',
    color: '#eaecef',
    border: '1px solid #2b3139',
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {/* Upload Trade */}
        <button
          onClick={() => handleNavigation('/trades/new')}
          disabled={isPaused}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:brightness-125"
          style={actionBtnStyle}
        >
          <Upload className="w-4 h-4" />
          <span className="text-sm font-medium">Upload Trade</span>
        </button>

        {/* Journal */}
        <button
          onClick={() => handleNavigation('/journal')}
          disabled={isPaused}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:brightness-125"
          style={actionBtnStyle}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-sm font-medium">Journal</span>
        </button>

        {/* Simulation */}
        <button
          onClick={() => handleNavigation('/strategy-lab')}
          disabled={isPaused}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:brightness-125"
          style={actionBtnStyle}
        >
          <Play className="w-4 h-4" />
          <span className="text-sm font-medium">Simulation</span>
        </button>

        {/* Pause Mode */}
        {isPaused ? (
          <button
            onClick={handleResume}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] transition-colors hover:brightness-110"
            style={{ backgroundColor: '#0ecb81', color: '#0b0e11' }}
          >
            {remainingTime !== null ? (
              <>
                <PlayCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Resume ({formatTime(remainingTime)})</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Resume</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handlePauseClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] transition-colors hover:brightness-125"
            style={actionBtnStyle}
          >
            <Pause className="w-4 h-4" />
            <span className="text-sm font-medium">Pause Mode</span>
          </button>
        )}
      </div>

      {/* Pause Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div
            className="rounded-[12px] shadow-xl p-6 w-full max-w-md mx-4"
            style={{ backgroundColor: '#1e2329', border: '1px solid #2b3139' }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#eaecef' }}>
              Activate Pause Mode
            </h2>

            {systemSuggested && (
              <div
                className="mb-4 p-3 rounded-[8px]"
                style={{ backgroundColor: 'rgba(252,213,53,0.1)', border: '1px solid rgba(252,213,53,0.3)' }}
              >
                <p className="text-sm" style={{ color: '#fcd535' }}>
                  We noticed signs of trading fatigue. Consider taking a break?
                </p>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <p className="text-sm" style={{ color: '#707a8a' }}>Select pause duration:</p>
              <div className="grid grid-cols-2 gap-2">
                {durationOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setSelectedDuration(option.value)}
                    className="px-4 py-3 rounded-[8px] transition-colors text-sm font-medium"
                    style={
                      selectedDuration === option.value
                        ? { backgroundColor: 'rgba(252,213,53,0.15)', border: '2px solid #fcd535', color: '#fcd535' }
                        : { backgroundColor: '#2b3139', border: '2px solid #2b3139', color: '#b7bdc6' }
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-[8px] transition-colors text-sm font-medium"
                style={{ backgroundColor: '#2b3139', border: '1px solid #2b3139', color: '#b7bdc6' }}
              >
                Cancel
              </button>
              <button
                onClick={handleActivatePause}
                className="flex-1 px-4 py-2 rounded-[8px] transition-colors text-sm font-medium"
                style={{ backgroundColor: '#fcd535', color: '#0b0e11' }}
              >
                Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
