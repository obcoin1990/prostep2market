import * as React from "react"
import { cn } from "@/lib/utils"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "compact" | "full-page"
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, variant = "default", ...props }, ref) => {
    const containerClass = variant === "full-page"
      ? "min-h-[60vh] flex items-center justify-center"
      : variant === "compact"
        ? "py-8"
        : "py-16"

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center px-6",
          containerClass,
          className
        )}
        {...props}
      >
        {icon && <div className="mb-4 text-[#848e9c]">{icon}</div>}
        <h3 className={cn("font-semibold text-white", variant === "compact" ? "text-sm" : "text-lg")}>
          {title}
        </h3>
        {description && (
          <p className={cn("mt-1 text-[#848e9c] max-w-sm", variant === "compact" ? "text-xs" : "text-sm")}>
            {description}
          </p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
