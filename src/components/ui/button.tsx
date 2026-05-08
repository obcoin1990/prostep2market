import * as React from "react"
import { type ButtonHTMLAttributes } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "ghost" | "outline" | "default" | "link" | "warning" | "error"
  size?: "sm" | "md" | "lg"
}

const variantStyles = {
  primary: "bg-[#E53935] text-white hover:opacity-90",
  secondary: "bg-transparent border border-[#0B0B0B] text-[#0B0B0B] hover:bg-gray-50",
  success: "bg-[#2E7D32] text-white hover:opacity-90",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50",
  default: "bg-gray-500 text-white hover:bg-gray-600",
  link: "bg-transparent text-[#E53935] hover:underline",
  warning: "bg-amber-500 text-white hover:opacity-90",
  error: "bg-red-500 text-white hover:opacity-90",
}

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-[12px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}