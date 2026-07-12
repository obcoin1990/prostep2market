'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  delay?: number
}

const Tooltip = ({ content, children, side = "top", delay = 300 }: TooltipProps) => {
  const tooltipId = React.useId()
  const [open, setOpen] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  const handleEnter = () => {
    timerRef.current = setTimeout(() => setOpen(true), delay)
  }

  const handleLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setOpen(false)
  }

  React.useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>

  return (
    <div className="relative inline-flex" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {React.cloneElement(child, {
        onFocus: handleEnter,
        onBlur: handleLeave,
        'aria-describedby': open ? tooltipId : undefined,
      })}
      {open && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            "absolute z-[800] px-2.5 py-1.5 text-xs rounded-md pointer-events-none whitespace-nowrap",
            "bg-[#2b3139] text-white shadow-lg",
            sideClasses[side]
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export { Tooltip }
