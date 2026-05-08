import * as React from "react"
import { type HTMLAttributes } from "react"
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error"
}

const variantStyles = {
  info: "bg-blue-50 border-blue-200",
  success: "bg-[#E8F5E9] border-[#2E7D32]",
  warning: "bg-[#F8D7D6] border-[#E53935]",
  error: "bg-red-50 border-red-500",
}

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
}

const iconColorMap = {
  info: "text-blue-500",
  success: "text-[#2E7D32]",
  warning: "text-[#E53935]",
  error: "text-red-500",
}

export function Alert({ variant = "info", className = "", children, ...props }: AlertProps) {
  const Icon = iconMap[variant]

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-[12px] border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColorMap[variant]}`} />
      <div className="flex-1">{children}</div>
    </div>
  )
}