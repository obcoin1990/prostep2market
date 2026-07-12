'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DeviceMockupProps {
  device: 'laptop' | 'tablet' | 'phone'
  children: ReactNode
  className?: string
}

export function DeviceMockup({ device, children, className = '' }: DeviceMockupProps) {
  if (device === 'laptop') {
    return (
      <div className={cn('relative', className)}>
        <div className="relative rounded-t-2xl bg-[#1a1d23] border border-[#2b3139] border-b-0 p-4 pb-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f6465d]/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#fcd535]/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#0ecb81]/60" />
          </div>
          <div className="rounded-t-lg bg-[#0b0e11] overflow-hidden aspect-[16/10]">
            {children}
          </div>
        </div>
        <div className="h-3 bg-[#1a1d23] border-x border-[#2b3139]" />
        <div className="mx-auto w-1/3 h-2 bg-[#1a1d23] border border-[#2b3139] border-t-0 rounded-b-xl" />
      </div>
    )
  }

  if (device === 'tablet') {
    return (
      <div className={cn('relative', className)}>
        <div className="rounded-[24px] bg-[#1a1d23] border border-[#2b3139] p-3">
          <div className="flex justify-center mb-2">
            <div className="w-8 h-1.5 rounded-full bg-[#2b3139]" />
          </div>
          <div className="rounded-[16px] bg-[#0b0e11] overflow-hidden aspect-[3/4]">
            {children}
          </div>
        </div>
      </div>
    )
  }

  // Phone
  return (
    <div className={cn('relative', className)}>
      <div className="rounded-[36px] bg-[#1a1d23] border border-[#2b3139] p-3">
        <div className="flex justify-center mb-1">
          <div className="w-20 h-5 bg-[#0b0e11] rounded-b-xl" />
        </div>
        <div className="rounded-[24px] bg-[#0b0e11] overflow-hidden aspect-[9/19]">
          {children}
        </div>
      </div>
    </div>
  )
}
