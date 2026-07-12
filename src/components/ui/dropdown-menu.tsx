'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "start" | "center" | "end"
  className?: string
}

const DropdownMenu = ({ trigger, children, align = "start", className }: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

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

  const alignClasses = { start: "left-0", center: "left-1/2 -translate-x-1/2", end: "right-0" }

  return (
    <div ref={ref} className="relative inline-flex">
      <button type="button" onClick={() => setOpen(!open)} aria-haspopup="true" aria-expanded={open} className="cursor-pointer">
        {trigger}
      </button>
      {open && (
        <div
          className={cn(
            "absolute top-full mt-1 z-[100] min-w-[180px] rounded-lg border border-[#2b3139] bg-[#1e2329] shadow-xl py-1",
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

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "danger"
  icon?: React.ReactNode
  inset?: boolean
}

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, variant = "default", icon, inset, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors",
        "hover:bg-[#2b3139]",
        variant === "danger" ? "text-[#f6465d]" : "text-white/80",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {icon && <span className="w-4 h-4 shrink-0">{icon}</span>}
      {children}
    </button>
  )
)
DropdownMenuItem.displayName = "DropdownMenuItem"

export interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenuSeparator = ({ className, ...props }: DropdownMenuSeparatorProps) => (
  <div className={cn("h-px bg-[#2b3139] my-1", className)} {...props} />
)

export { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator }
