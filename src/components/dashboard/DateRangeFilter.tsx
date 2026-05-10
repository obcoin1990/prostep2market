'use client'

import { useState } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export type DateRangeType = '7days' | '30days' | '90days' | '6months' | '1year' | 'custom'

interface DateRangeFilterProps {
  selectedRange?: DateRangeType
  onRangeChange?: (range: DateRangeType, startDate?: Date, endDate?: Date) => void
  showLabel?: boolean
}

interface RangeOption {
  label: string
  value: DateRangeType
  days: number
}

const RANGE_OPTIONS: RangeOption[] = [
  { label: 'Last 7 Days', value: '7days', days: 7 },
  { label: 'Last 30 Days', value: '30days', days: 30 },
  { label: 'Last 90 Days', value: '90days', days: 90 },
  { label: 'Last 6 Months', value: '6months', days: 180 },
  { label: 'Last Year', value: '1year', days: 365 },
]

export function DateRangeFilter({
  selectedRange = '30days',
  onRangeChange,
  showLabel = true,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customStart, setCustomStart] = useState<string>('')
  const [customEnd, setCustomEnd] = useState<string>('')

  const selectedOption = RANGE_OPTIONS.find((opt) => opt.value === selectedRange)

  const handleRangeSelect = (range: DateRangeType) => {
    setIsOpen(false)
    if (range === 'custom') {
      // Keep modal open for custom date selection
      setIsOpen(true)
      return
    }

    const option = RANGE_OPTIONS.find((opt) => opt.value === range)
    if (option) {
      const endDate = new Date()
      const startDate = new Date(endDate.getTime() - option.days * 24 * 60 * 60 * 1000)
      onRangeChange?.(range, startDate, endDate)
    }
  }

  const handleCustomDates = () => {
    if (customStart && customEnd) {
      const startDate = new Date(customStart)
      const endDate = new Date(customEnd)
      if (startDate <= endDate) {
        onRangeChange?.('custom', startDate, endDate)
        setIsOpen(false)
        setCustomStart('')
        setCustomEnd('')
      }
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-[#0A0F1C] border border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors text-white"
        aria-label="Select date range"
      >
        <Calendar className="w-4 h-4" />
        <span className="hidden sm:inline">{selectedOption?.label || 'Select Range'}</span>
        <span className="sm:hidden">{selectedOption?.days || 30}d</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <Card className="absolute right-0 mt-2 w-64 z-50 bg-[#0A0F1C] border-[rgba(255,255,255,0.1)]">
            <CardContent className="p-4">
              <div className="space-y-2 mb-4">
                {RANGE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleRangeSelect(option.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedRange === option.value
                        ? 'bg-[rgba(0,180,216,0.1)] text-[#00B4D8]'
                        : 'text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.1)] hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Custom Date Range */}
              <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
                <p className="text-xs text-[rgba(255,255,255,0.5)] font-medium mb-3">
                  CUSTOM RANGE
                </p>
                <div className="space-y-2 mb-3">
                  <div>
                    <label className="block text-xs text-[rgba(255,255,255,0.6)] mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full px-2 py-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded text-sm text-white placeholder-[rgba(255,255,255,0.4)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[rgba(255,255,255,0.6)] mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full px-2 py-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded text-sm text-white placeholder-[rgba(255,255,255,0.4)]"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCustomDates}
                  disabled={!customStart || !customEnd}
                  className="w-full"
                  size="sm"
                >
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
