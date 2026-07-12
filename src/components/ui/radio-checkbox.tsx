import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => (
    <label htmlFor={id} className="inline-flex items-center gap-2 cursor-pointer group">
      <input
        ref={ref}
        type="checkbox"
        id={id}
        className={cn(
          "appearance-none w-4 h-4 rounded border transition-colors shrink-0",
          "checked:bg-[#fcd535] checked:border-[#fcd535]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fcd535]/60",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "bg-[#1e2329] border-[#2b3139]",
          className
        )}
        {...props}
      />
      {label && <span className="text-sm text-white/80 select-none">{label}</span>}
    </label>
  )
)
Checkbox.displayName = "Checkbox"

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => (
    <label htmlFor={id} className="inline-flex items-center gap-2 cursor-pointer group">
      <input
        ref={ref}
        type="radio"
        id={id}
        className={cn(
          "appearance-none w-4 h-4 rounded-full border transition-colors shrink-0",
          "checked:bg-[#fcd535] checked:border-[#fcd535] checked:shadow-[inset_0_0_0_2px_#0b0e11]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fcd535]/60",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "bg-[#1e2329] border-[#2b3139]",
          className
        )}
        {...props}
      />
      {label && <span className="text-sm text-white/80 select-none">{label}</span>}
    </label>
  )
)
Radio.displayName = "Radio"

export { Checkbox, Radio }
