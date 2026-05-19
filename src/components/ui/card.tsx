import * as React from "react"
import { type HTMLAttributes } from "react"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * dark     — Surface card on dark canvas (#1e2329). Dashboard default.
   * elevated — One step lighter (#2b3139). Nested / hover state cards.
   * light    — White card for transactional light-mode pages.
   * flat     — No background, no border. Transparent content block.
   */
  variant?: "dark" | "elevated" | "light" | "flat" | "default"
}

const variantStyles: Record<NonNullable<CardProps["variant"]>, string> = {
  dark:     "bg-[#1e2329] border border-[#2b3139]",
  elevated: "bg-[#2b3139] border border-[#2b3139]",
  light:    "bg-white border border-[#eaecef]",
  flat:     "bg-transparent border-0",
  default:  "bg-[#1e2329] border border-[#2b3139]",
}

export function Card({
  variant = "dark",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-[12px] p-6 ${variantStyles[variant]} ${className}`}
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
    <div className={`mt-4 pt-4 border-t border-[#2b3139] ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className = "", children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-base font-semibold text-white leading-[1.4] ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
}
