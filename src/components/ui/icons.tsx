import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

export function DnaHelix({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2C8 2 4 4 4 8c0 2.5 2 4.5 4 5.5C6 14.5 4 16.5 4 19c0 4 4 6 8 6s8-2 8-6c0-2.5-2-4.5-4-5.5 2-1 4-3 4-5.5 0-4-4-6-8-6z" stroke="#fcd535" strokeWidth="1.5" fill="none"/>
      <path d="M8 6.5c2 1 2 3 0 4M16 6.5c-2 1-2 3 0 4M10 14c1.5 1 1.5 3 0 4M14 14c-1.5 1-1.5 3 0 4" stroke="#fcd535" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="12" cy="3" r="1" fill="#fcd535"/>
      <circle cx="12" cy="21" r="1" fill="#fcd535"/>
    </svg>
  )
}

export function TradeBuy({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 17L9 11L13 15L21 7" stroke="#0ecb81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 7H15M21 7V13" stroke="#0ecb81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function TradeSell({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 7L9 13L13 9L21 17" stroke="#f6465d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 17H15M21 17V11" stroke="#f6465d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function TrendUp({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M2 20L8 14L12 18L22 8" stroke="#0ecb81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 8V4M22 8H18" stroke="#0ecb81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="22" cy="8" r="1.5" fill="#0ecb81"/>
    </svg>
  )
}

export function TrendDown({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M2 4L8 10L12 6L22 16" stroke="#f6465d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 16V20M22 20H18" stroke="#f6465d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="22" cy="16" r="1.5" fill="#f6465d"/>
    </svg>
  )
}

export function CandlestickChart({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="6" width="3" height="12" rx="0.5" fill="#0ecb81"/>
      <rect x="3" y="10" width="3" height="4" fill="#0ecb81"/>
      <rect x="10" y="3" width="3" height="18" rx="0.5" fill="#f6465d"/>
      <rect x="10" y="14" width="3" height="3" fill="#f6465d"/>
      <rect x="17" y="8" width="3" height="10" rx="0.5" fill="#0ecb81"/>
      <rect x="17" y="12" width="3" height="3" fill="#0ecb81"/>
      <line x1="4.5" y1="2" x2="4.5" y2="5" stroke="#f0b90b" strokeWidth="1.2"/>
      <line x1="4.5" y1="19" x2="4.5" y2="22" stroke="#f0b90b" strokeWidth="1.2"/>
      <line x1="11.5" y1="2" x2="11.5" y2="3" stroke="#f0b90b" strokeWidth="1.2"/>
      <line x1="11.5" y1="21" x2="11.5" y2="22" stroke="#f0b90b" strokeWidth="1.2"/>
      <line x1="18.5" y1="2" x2="18.5" y2="7" stroke="#f0b90b" strokeWidth="1.2"/>
      <line x1="18.5" y1="19" x2="18.5" y2="22" stroke="#f0b90b" strokeWidth="1.2"/>
    </svg>
  )
}

export function RiskBadge({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2L3 7V12C3 17.5 7 22.5 12 24C17 22.5 21 17.5 21 12V7L12 2Z" stroke="#f0b90b" strokeWidth="1.5" fill="none"/>
      <path d="M12 8V13" stroke="#f0b90b" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1" fill="#f0b90b"/>
    </svg>
  )
}

export function CertificationBadge({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2L15 7L21 7.5L17 12L18 18L12 15.5L6 18L7 12L3 7.5L9 7L12 2Z" stroke="#fcd535" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M9 12L11 14L15 10" stroke="#fcd535" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function BrainIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 4C8 4 6 6 6 9C6 11.5 7.5 13 9 14C7.5 15 6 16.5 6 19C6 22 8 24 12 24C16 24 18 22 18 19C18 16.5 16.5 15 15 14C16.5 13 18 11.5 18 9C18 6 16 4 12 4Z" stroke="#fcd535" strokeWidth="1.5" fill="none"/>
      <path d="M12 2V4" stroke="#fcd535" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 24V22" stroke="#fcd535" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 9H15" stroke="#fcd535" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 13H15" stroke="#fcd535" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 17H15" stroke="#fcd535" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function LightbulbInsight({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2C8.5 2 6 4.5 6 8C6 10.5 7.5 12 9 13V16H15V13C16.5 12 18 10.5 18 8C18 4.5 15.5 2 12 2Z" stroke="#fcd535" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M9 19H15" stroke="#fcd535" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 21H14" stroke="#fcd535" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 13V9" stroke="#fcd535" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 9L14 11" stroke="#fcd535" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function PerformanceGauge({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#fcd535" strokeWidth="1.5" fill="none"/>
      <path d="M12 18C15.3 18 18 15.3 18 12C18 8.7 15.3 6 12 6" stroke="#fcd535" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 12L16 8" stroke="#fcd535" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.5" fill="#fcd535"/>
    </svg>
  )
}

export function AlertTriangle({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3L2 21H22L12 3Z" stroke="#fcd535" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M12 9V13" stroke="#fcd535" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="1" fill="#fcd535"/>
    </svg>
  )
}

export function RankingCrown({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M2 18L6 6L10 12L12 9L14 12L18 6L22 18H2Z" stroke="#fcd535" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M2 20H22" stroke="#fcd535" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="20" r="2" fill="#fcd535"/>
      <circle cx="8" cy="18" r="1" fill="#fcd535" opacity="0.5"/>
      <circle cx="16" cy="18" r="1" fill="#fcd535" opacity="0.5"/>
    </svg>
  )
}
