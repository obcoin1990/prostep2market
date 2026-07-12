"use client"

import * as React from "react"
import { DayPicker, type DayPickerProps, UI, DayFlag, SelectionState } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useT } from "@/contexts/LanguageContext"

export interface DatePickerProps extends Omit<DayPickerProps, "mode"> {
  mode?: "single" | "range" | "multiple"
  value?: Date | { from?: Date; to?: Date } | Date[]
  onChange?: (date: Date | { from?: Date; to?: Date } | Date[] | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  inputClassName?: string
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function ChevronFn({ orientation }: { orientation?: "up" | "left" | "right" | "down" }) {
  const Icon = orientation === "left" ? ChevronLeft : ChevronRight
  return <Icon className="h-4 w-4 text-[#848e9c]" />
}

function DatePicker({
  mode = "single",
  value,
  onChange,
  placeholder,
  disabled = false,
  className,
  inputClassName,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const t = useT()
  const resolvedPlaceholder = placeholder ?? t("ui.datePickerPlaceholder")

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const displayValue = React.useMemo(() => {
    if (!value) return ""
    if (mode === "single" && value instanceof Date) return formatDate(value)
    if (mode === "range" && typeof value === "object" && "from" in value) {
      if (value.from && value.to) return `${formatDate(value.from)} — ${formatDate(value.to)}`
      if (value.from) return formatDate(value.from)
    }
    if (mode === "multiple" && Array.isArray(value)) {
      if (value.length === 0) return ""
      if (value.length === 1) return formatDate(value[0])
      return `${formatDate(value[0])} +${value.length - 1} more`
    }
    return ""
  }, [value, mode])

  return (
    <div ref={ref} className={cn("relative inline-flex w-full", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-[8px] border border-[#2b3139] bg-[#1e2329] px-3 py-2 text-sm text-left transition-colors",
          "hover:border-[#3a3a5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fcd535] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0e11]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          inputClassName
        )}
      >
        <span className={cn("truncate", !value && "text-[#848e9c]")}>
          {displayValue || resolvedPlaceholder}
        </span>
        <svg
          className="ml-2 h-4 w-4 shrink-0 text-[#848e9c]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-[600] mt-2 rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-3 shadow-xl" role="dialog" aria-label="Choose date">
          <DayPicker
            mode={mode as "single" | "range" | "multiple"}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            selected={value as any}
            onSelect={(date: Date | { from?: Date; to?: Date } | Date[] | undefined) => {
              onChange?.(date as Date | { from?: Date; to?: Date } | Date[] | undefined)
              if (mode === "single" && date) setOpen(false)
            }}
            showOutsideDays
            fixedWeeks
            components={{
              Chevron: ChevronFn,
            }}
            classNames={{
              [UI.Root]: "p-0",
              [UI.Months]: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              [UI.Month]: "space-y-4",
              [UI.MonthCaption]: "flex justify-center pt-1 items-center",
              [UI.CaptionLabel]: "text-sm font-medium text-white",
              [UI.Nav]: "flex items-center",
              [UI.PreviousMonthButton]: "absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity",
              [UI.NextMonthButton]: "absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity",
              [UI.MonthGrid]: "w-full border-collapse space-y-1",
              [UI.Weekdays]: "flex",
              [UI.Weekday]: "text-[#848e9c] w-9 font-normal text-xs",
              [UI.Week]: "flex w-full mt-2",
              [UI.Day]: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
              [UI.DayButton]: "h-9 w-9 p-0 font-normal rounded-[6px] transition-colors hover:bg-[#2b3139]",
              [UI.Footer]: "sr-only",
              [SelectionState.selected]: "bg-[#fcd535] text-[#181a20] hover:bg-[#fcd535] hover:text-[#181a20] focus:bg-[#fcd535] focus:text-[#181a20]",
              [DayFlag.today]: "text-white font-semibold",
              [DayFlag.outside]: "text-[#6b7280]",
              [DayFlag.disabled]: "text-[#6b7280] opacity-50",
              [SelectionState.range_middle]: "bg-[rgba(252,213,53,0.1)] text-white",
              [DayFlag.hidden]: "invisible",
            }}
            {...props}
          />
        </div>
      )}
    </div>
  )
}

export { DatePicker }
