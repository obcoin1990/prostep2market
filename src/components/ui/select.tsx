'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  error?: string
  disabled?: boolean
  className?: string
  theme?: "dark" | "light"
}

const Select = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  error,
  disabled,
  className,
  theme = "dark",
}: SelectProps) => {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false)
    }
    if (open) document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open])

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg border transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fcd535]/60",
          "disabled:cursor-not-allowed disabled:opacity-50",
          theme === "dark"
            ? "bg-[#1e2329] text-white border-[#2b3139]"
            : "bg-white text-[#181a20] border-[#eaecef]",
          error && "border-[#f6465d]"
        )}
      >
        <span className={selected ? "" : "text-[#848e9c]"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={cn("w-4 h-4 text-[#848e9c] transition-transform", open && "rotate-180")}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {error && <p className="mt-1 text-xs text-[#f6465d]">{error}</p>}
      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute z-[100] w-full mt-1 rounded-lg border shadow-xl max-h-60 overflow-y-auto",
            theme === "dark" ? "bg-[#1e2329] border-[#2b3139]" : "bg-white border-[#eaecef]"
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              role="option"
              aria-selected={value === option.value}
              onClick={() => { onChange?.(option.value); setOpen(false) }}
              className={cn(
                "w-full text-left px-4 py-2 text-sm transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-40",
                value === option.value
                  ? "bg-[#fcd535]/10 text-[#fcd535]"
                  : theme === "dark"
                    ? "text-white/80 hover:bg-[#2b3139]"
                    : "text-[#181a20] hover:bg-[#f5f7fa]",
                "first:rounded-t-lg last:rounded-b-lg"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { Select }
