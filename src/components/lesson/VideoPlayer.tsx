'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import MuxPlayer from '@mux/mux-player-react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  lessonId:    string
  playbackId:  string       // Mux playback ID
  title:       string
  durationSec: number
  enrollmentId: string
  initialWatched?: number  // seconds already watched
  initialCompleted?: boolean
  onComplete?: () => void   // called when lesson marked complete
}

const SYNC_INTERVAL_SEC = 15  // sync progress every 15s

export function VideoPlayer({
  lessonId,
  playbackId,
  title,
  durationSec,
  enrollmentId,
  initialWatched = 0,
  initialCompleted = false,
  onComplete,
}: Props) {
  const playerRef        = useRef<any>(null)
  const watchedRef       = useRef(initialWatched)
  const completedRef     = useRef(initialCompleted)
  const lastSyncedRef    = useRef(initialWatched)
  const syncTimerRef     = useRef<ReturnType<typeof setInterval>>()

  const [completed, setCompleted] = useState(initialCompleted)
  const [syncing,   setSyncing]   = useState(false)

  // Sync progress to server
  const syncProgress = useCallback(
    async (watchedSec: number, forceComplete = false) => {
      if (Math.abs(watchedSec - lastSyncedRef.current) < 2 && !forceComplete) return

      setSyncing(true)
      try {
        const autoComplete =
          forceComplete ||
          (durationSec > 0 && watchedSec >= durationSec * 0.9)

        await fetch(`/api/lessons/${lessonId}/progress`, {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ watchedSec, completed: autoComplete, enrollmentId }),
        })

        lastSyncedRef.current = watchedSec

        if (autoComplete && !completedRef.current) {
          completedRef.current = true
          setCompleted(true)
          onComplete?.()
        }
      } catch (e) {
        console.error('Progress sync failed', e)
      } finally {
        setSyncing(false)
      }
    },
    [lessonId, enrollmentId, durationSec, onComplete]
  )

  // Periodic sync
  useEffect(() => {
    syncTimerRef.current = setInterval(() => {
      syncProgress(watchedRef.current)
    }, SYNC_INTERVAL_SEC * 1000)

    return () => {
      clearInterval(syncTimerRef.current)
      // Final sync on unmount
      syncProgress(watchedRef.current)
    }
  }, [syncProgress])

  function handleTimeUpdate(e: Event) {
    const el = e.target as HTMLVideoElement
    watchedRef.current = Math.floor(el.currentTime)
  }

  function handleEnded() {
    syncProgress(watchedRef.current, true)
  }

  function handlePause() {
    syncProgress(watchedRef.current)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Player */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
        <MuxPlayer
          ref={playerRef}
          playbackId={playbackId}
          streamType="on-demand"
          metadata={{ video_title: title }}
          startTime={initialWatched > 0 ? initialWatched : undefined}
          onTimeUpdate={handleTimeUpdate as any}
          onEnded={handleEnded}
          onPause={handlePause}
          className="w-full h-full"
          style={{ aspectRatio: '16/9', '--controls': 'auto' } as any}
          accentColor="#6366f1"
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <div className="flex items-center gap-2 text-xs">
          {syncing && (
            <span className="flex items-center gap-1 text-gray-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving…
            </span>
          )}
          {completed && (
            <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-green-700 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {durationSec > 0 && (
        <div className="h-1 w-full rounded-full bg-gray-100">
          <div
            className={cn(
              'h-1 rounded-full transition-all',
              completed ? 'bg-green-400' : 'bg-brand-500'
            )}
            style={{ width: `${Math.min(100, (initialWatched / durationSec) * 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}
