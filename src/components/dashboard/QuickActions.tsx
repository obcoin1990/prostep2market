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
          <div key={i} className="h-12 w-24 bg-gray-200 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {/* Upload Trade */}
        <button
          onClick={() => handleNavigation('/trades/new')}
          disabled={isPaused}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0B0B0B] text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span className="text-sm font-medium">Upload Trade</span>
        </button>

        {/* Journal */}
        <button
          onClick={() => handleNavigation('/journal')}
          disabled={isPaused}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0B0B0B] text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-sm font-medium">Journal</span>
        </button>

        {/* Simulation */}
        <button
          onClick={() => handleNavigation('/strategy-lab')}
          disabled={isPaused}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0B0B0B] text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Play className="w-4 h-4" />
          <span className="text-sm font-medium">Simulation</span>
        </button>

        {/* Pause Mode */}
        {isPaused ? (
          <button
            onClick={handleResume}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
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
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0B0B0B] text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <Pause className="w-4 h-4" />
            <span className="text-sm font-medium">Pause Mode</span>
          </button>
        )}
      </div>

      {/* Pause Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Activate Pause Mode</h2>
            
            {systemSuggested && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  We noticed signs of trading fatigue. Consider taking a break?
                </p>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-600">Select pause duration:</p>
              <div className="grid grid-cols-2 gap-2">
                {durationOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setSelectedDuration(option.value)}
                    className={`px-4 py-3 rounded-md border-2 transition-colors ${
                      selectedDuration === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleActivatePause}
                className="flex-1 px-4 py-2 bg-[#0B0B0B] text-white rounded-md hover:bg-gray-800 transition-colors"
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