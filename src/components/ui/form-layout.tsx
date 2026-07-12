import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  description?: string
  error?: string
  required?: boolean
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, description, error, required, children, ...props }, ref) => {
    const fieldId = React.useId()
    const errorId = `${fieldId}-error`
    const child = React.Children.only(children) as React.ReactElement

    return (
      <div ref={ref} className={cn("space-y-1.5", className)} {...props}>
        {label && (
          <label htmlFor={fieldId} className="block text-sm font-medium text-white">
            {label}
            {required && <span className="text-[#f6465d] ml-0.5">*</span>}
          </label>
        )}
        {description && <p className="text-xs text-[#848e9c]">{description}</p>}
        {React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
          id: fieldId,
          'aria-required': required || undefined,
          'aria-invalid': error ? true : undefined,
          'aria-describedby': error ? errorId : undefined,
        })}
        {error && <p id={errorId} className="text-xs text-[#f6465d]">{error}</p>}
      </div>
    )
  }
)
FormField.displayName = "FormField"

export interface FormRowProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4
}

const FormRow = React.forwardRef<HTMLDivElement, FormRowProps>(
  ({ className, columns = 2, children, ...props }, ref) => {
    const gridCols = {
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    }
    return (
      <div
        ref={ref}
        className={cn("grid gap-4", gridCols[columns], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
FormRow.displayName = "FormRow"

export interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, title, description, children, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-4", className)} {...props}>
      {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
      {description && <p className="text-sm text-[#848e9c]">{description}</p>}
      <div className="space-y-4">{children}</div>
    </div>
  )
)
FormSection.displayName = "FormSection"

export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "center" | "right"
}

const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(
  ({ className, align = "right", children, ...props }, ref) => {
    const alignClass = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    }
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-3 pt-4 border-t border-[#2b3139]", alignClass[align], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
FormActions.displayName = "FormActions"

export { FormField, FormRow, FormSection, FormActions }
