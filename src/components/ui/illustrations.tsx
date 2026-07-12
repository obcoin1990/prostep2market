import React from 'react'

interface IllustrationProps {
  className?: string
  size?: number
}

export function EmptyTrading({ className, size = 120 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <rect x="10" y="40" width="100" height="60" rx="8" stroke="#2b3139" strokeWidth="2" fill="#1e2329"/>
      <path d="M20 80L40 60L55 75L75 45L100 70" stroke="#2b3139" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="10" y1="50" x2="110" y2="50" stroke="#2b3139" strokeWidth="1" strokeDasharray="4 4"/>
      <line x1="10" y1="70" x2="110" y2="70" stroke="#2b3139" strokeWidth="1" strokeDasharray="4 4"/>
      <line x1="10" y1="90" x2="110" y2="90" stroke="#2b3139" strokeWidth="1" strokeDasharray="4 4"/>
      <line x1="40" y1="40" x2="40" y2="100" stroke="#2b3139" strokeWidth="1" strokeDasharray="4 4"/>
      <line x1="70" y1="40" x2="70" y2="100" stroke="#2b3139" strokeWidth="1" strokeDasharray="4 4"/>
      <circle cx="75" cy="45" r="4" fill="#fcd535" opacity="0.3"/>
      <circle cx="100" cy="70" r="4" fill="#0ecb81" opacity="0.3"/>
      <text x="60" y="30" textAnchor="middle" fill="#848e9c" fontSize="12" fontFamily="sans-serif">No trades yet</text>
    </svg>
  )
}

export function EmptyAnalytics({ className, size = 120 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <rect x="15" y="25" width="90" height="75" rx="8" stroke="#2b3139" strokeWidth="2" fill="#1e2329"/>
      <rect x="25" y="40" width="15" height="35" rx="2" fill="#2b3139"/>
      <rect x="45" y="30" width="15" height="45" rx="2" fill="#2b3139"/>
      <rect x="65" y="50" width="15" height="25" rx="2" fill="#2b3139"/>
      <rect x="85" y="35" width="10" height="40" rx="2" fill="#2b3139"/>
      <rect x="25" y="40" width="15" height="5" rx="1" fill="#fcd535" opacity="0.5"/>
      <rect x="45" y="30" width="15" height="5" rx="1" fill="#0ecb81" opacity="0.5"/>
      <rect x="65" y="50" width="15" height="5" rx="1" fill="#f6465d" opacity="0.5"/>
      <text x="60" y="18" textAnchor="middle" fill="#848e9c" fontSize="12" fontFamily="sans-serif">No analytics data</text>
    </svg>
  )
}

export function EmptyCourses({ className, size = 120 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <rect x="15" y="20" width="90" height="80" rx="8" stroke="#2b3139" strokeWidth="2" fill="#1e2329"/>
      <rect x="25" y="30" width="70" height="55" rx="4" stroke="#2b3139" strokeWidth="1" fill="none"/>
      <path d="M40 55L50 65L70 45" stroke="#2b3139" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="30" y1="75" x2="90" y2="75" stroke="#2b3139" strokeWidth="1"/>
      <circle cx="35" cy="83" r="3" fill="#2b3139"/>
      <circle cx="50" cy="83" r="3" fill="#2b3139"/>
      <circle cx="65" cy="83" r="3" fill="#2b3139"/>
      <text x="60" y="15" textAnchor="middle" fill="#848e9c" fontSize="12" fontFamily="sans-serif">No courses enrolled</text>
    </svg>
  )
}

export function ErrorState({ className, size = 120 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <circle cx="60" cy="55" r="40" stroke="#f6465d" strokeWidth="2" fill="#1e2329" opacity="0.5"/>
      <path d="M45 40L75 70" stroke="#f6465d" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M75 40L45 70" stroke="#f6465d" strokeWidth="2.5" strokeLinecap="round"/>
      <text x="60" y="100" textAnchor="middle" fill="#848e9c" fontSize="12" fontFamily="sans-serif">Something went wrong</text>
    </svg>
  )
}

export function SuccessState({ className, size = 120 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <circle cx="60" cy="55" r="40" stroke="#0ecb81" strokeWidth="2" fill="#1e2329" opacity="0.5"/>
      <path d="M40 55L53 68L80 42" stroke="#0ecb81" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="60" cy="55" r="20" stroke="#0ecb81" strokeWidth="1" fill="none" opacity="0.3"/>
      <text x="60" y="100" textAnchor="middle" fill="#848e9c" fontSize="12" fontFamily="sans-serif">Completed successfully</text>
    </svg>
  )
}

export function AchievementUnlocked({ className, size = 120 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <circle cx="60" cy="50" r="35" stroke="#fcd535" strokeWidth="2" fill="#1e2329"/>
      <path d="M40 50L53 63L80 37" stroke="#fcd535" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M30 50H25" stroke="#fcd535" strokeWidth="2" strokeLinecap="round"/>
      <path d="M95 50H90" stroke="#fcd535" strokeWidth="2" strokeLinecap="round"/>
      <path d="M60 15V10" stroke="#fcd535" strokeWidth="2" strokeLinecap="round"/>
      <path d="M60 90V85" stroke="#fcd535" strokeWidth="2" strokeLinecap="round"/>
      <text x="60" y="110" textAnchor="middle" fill="#848e9c" fontSize="12" fontFamily="sans-serif">Achievement unlocked</text>
    </svg>
  )
}
