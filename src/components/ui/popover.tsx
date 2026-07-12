'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface PopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "start" | "center" | "end"
  side?: "bottom" | "top"
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Popover = ({
  trigger,
  children,
  align = "center",
  side = "bottom",
  className,
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const ref = React.useRef<HTMLDivElement>(null)

  const setOpen = (val: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(val)
    onOpenChange?.(val)
  }

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setOpen(false)
    }
    if (isOpen) document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  const sideClasses = {
    bottom: "top-full mt-2",
    top: "bottom-full mb-2",
  }

  return (
    <div ref={ref} className="relative inline-flex">
      <button type="button" onClick={() => setOpen(!isOpen)} aria-expanded={isOpen} className="cursor-pointer">
        {trigger}
      </button>
      {isOpen && (
        <div
          className={cn(
            "absolute z-[600] min-w-[160px] rounded-lg border border-[#2b3139] bg-[#1e2329] shadow-xl",
            sideClasses[side],
            alignClasses[align],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export interface PopoverItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "danger"
}

const PopoverItem = React.forwardRef<HTMLButtonElement, PopoverItemProps>(
  ({ className, variant = "default", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "w-full text-left px-3 py-2 text-sm transition-colors",
        "hover:bg-[#2b3139] first:rounded-t-lg last:rounded-b-lg",
        variant === "danger" ? "text-[#f6465d]" : "text-white/80",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)
PopoverItem.displayName = "PopoverItem"

export { Popover, PopoverItem }
