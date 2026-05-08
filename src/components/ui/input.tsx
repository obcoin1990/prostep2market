import * as React from "react"
import { type InputHTMLAttributes, type LabelHTMLAttributes } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export function Input({ className = "", error, ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        className={`w-full px-4 py-2.5 text-[#0B0B0B] bg-white border rounded-[6px] transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E53935] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? "border-[#E53935]" : "border-gray-200"} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[#E53935]">{error}</p>
      )}
    </div>
  )
}

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className = "", children, ...props }: LabelProps) {
  return (
    <label
      className={`block text-sm font-medium text-[#0B0B0B] mb-1.5 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}