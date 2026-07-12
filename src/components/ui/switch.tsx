import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  theme?: "dark" | "light"
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, theme = "dark", disabled, ...props }, ref) => {
    const handleClick = () => {
      if (!disabled) onCheckedChange?.(!checked)
    }

    return (
      <button
        ref={ref}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fcd535]/60",
          "disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "bg-[#fcd535]"
            : theme === "dark"
              ? "bg-[#2b3139]"
              : "bg-[#eaecef]",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-[3px]"
          )}
        />
      </button>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
