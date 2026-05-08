import * as React from "react"
import { type HTMLAttributes } from "react"

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "outline"
}

const variantStyles = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-[#E8F5E9] border border-[#2E7D32] text-[#2E7D32]",
  warning: "bg-[#F8D7D6] border border-[#E53935] text-[#E53935]",
  error: "bg-red-50 border border-red-500 text-red-700",
  outline: "bg-transparent border border-gray-300 text-gray-700",
}

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}