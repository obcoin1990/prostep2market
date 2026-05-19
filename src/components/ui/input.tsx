import * as React from "react"
import { type InputHTMLAttributes, type LabelHTMLAttributes } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  /**
   * dark  — Search input on dark canvas (#1e2329 bg). Dashboard default.
   * light — Transactional input on white canvas. Login / forms.
   */
  theme?: "dark" | "light"
}

export function Input({ className = "", error, theme = "dark", ...props }: InputProps) {
  const base =
    "w-full px-4 py-2.5 text-sm rounded-[6px] transition-colors outline-none disabled:cursor-not-allowed"

  const themeStyles =
    theme === "light"
      ? `bg-white text-[#181a20] border placeholder:text-[#929aa5] focus:ring-2 focus:ring-[#fcd535]/40 focus:border-[#fcd535] disabled:bg-[#f5f5f5] ${error ? "border-[#f6465d]" : "border-[#eaecef]"}`
      : `bg-[#1e2329] text-white border placeholder:text-[#707a8a] focus:border-[#fcd535] disabled:opacity-50 ${error ? "border-[#f6465d]" : "border-[#2b3139]"}`

  return (
    <div className="w-full">
      <input
        className={`${base} ${themeStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-[#f6465d]">{error}</p>
      )}
    </div>
  )
}

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  theme?: "dark" | "light"
}

export function Label({ className = "", theme = "dark", children, ...props }: LabelProps) {
  const color = theme === "light" ? "text-[#181a20]" : "text-[#eaecef]"
  return (
    <label
      className={`block text-sm font-medium mb-1.5 ${color} ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}
