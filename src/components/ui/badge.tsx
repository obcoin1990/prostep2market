import * as React from "react"
import { type HTMLAttributes } from "react"

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * default  — Muted surface. Generic labels.
   * yellow   — Binance Yellow. "No.1" trust badges, top-tier indicators.
   * success  — Trading-up green. Positive / up signals.
   * warning  — Amber. Caution states.
   * error    — Trading-down red. Negative / down signals.
   * outline  — Hairline border only. Neutral meta labels.
   * info     — Blue. Informational.
   * dark     — Elevated dark surface. Dark-canvas labels.
   */
  variant?: "default" | "yellow" | "success" | "warning" | "error" | "outline" | "info" | "dark"
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-[#2b3139] text-[#eaecef]",
  yellow:  "bg-[#fcd535] text-[#181a20] font-semibold",
  success: "bg-[rgba(14,203,129,0.15)] text-[#0ecb81] border border-[rgba(14,203,129,0.3)]",
  warning: "bg-[rgba(252,213,53,0.15)] text-[#fcd535] border border-[rgba(252,213,53,0.3)]",
  error:   "bg-[rgba(246,70,93,0.15)] text-[#f6465d] border border-[rgba(246,70,93,0.3)]",
  outline: "bg-transparent border border-[#2b3139] text-[#9ea3ad]",
  info:    "bg-[rgba(59,130,246,0.15)] text-[#3b82f6] border border-[rgba(59,130,246,0.3)]",
  dark:    "bg-[#1e2329] text-[#eaecef] border border-[#2b3139]",
}

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
