import * as React from "react"
import { type HTMLAttributes } from "react"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated"
}

export function Card({
  variant = "default",
  className = "",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-white border border-gray-100",
    elevated: "bg-[#F5F7FA] shadow-[0_6px_18px_rgba(11,11,11,0.06)]",
  }

  return (
    <div
      className={`rounded-[12px] p-4 md:p-6 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className = "", children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg font-semibold text-[#0B0B0B] ${className}`} {...props}>
      {children}
    </h3>
  )
}