import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  theme?: "dark" | "light"
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, theme = "dark", ...props }, ref) => {
    const errorId = React.useId()
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full px-4 py-2.5 text-sm rounded-lg border transition-colors outline-none",
            "focus:ring-2 focus:ring-[#fcd535]/60 focus:border-[#fcd535]",
            "disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[80px]",
            theme === "dark"
              ? "bg-[#1e2329] text-white border-[#2b3139] placeholder:text-[#848e9c]"
              : "bg-white text-[#181a20] border-[#eaecef] placeholder:text-[#9ca3af]",
            error && "border-[#f6465d] focus:ring-[#f6465d]/40 focus:border-[#f6465d]",
            className
          )}
          {...props}
        />
        {error && <p id={errorId} className="mt-1 text-xs text-[#f6465d]">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
