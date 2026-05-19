import * as React from "react"
import { type ButtonHTMLAttributes } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * primary        — Binance Yellow (#fcd535) with black text. Universal primary CTA.
   * primary-pill   — Same yellow, pill shape. Top-of-page sign-up moments.
   * secondary      — Dark surface (#1e2329) with white text. Less-emphasized actions.
   * secondary-light— White surface with ink text. Light-mode transactional pages.
   * tertiary       — Transparent, body text. Log In / inline text actions.
   * trading-up     — Green (#0ecb81). Buy / Long actions only.
   * trading-down   — Red (#f6465d). Sell / Short actions only.
   * subscribe      — Compact yellow. Dense table rows.
   * ghost          — Transparent with subtle hover. Icon buttons.
   * danger         — Red fill. Destructive confirmations.
   * outline        — Hairline border, no fill. Secondary on dark.
   * default        — Neutral gray fallback.
   * success        — Alias for trading-up (non-semantic contexts).
   * warning        — Amber. Non-trading warning actions.
   * error          — Alias for danger.
   * link           — Yellow text-link, no background.
   */
  variant?:
    | "primary"
    | "primary-pill"
    | "secondary"
    | "secondary-light"
    | "tertiary"
    | "trading-up"
    | "trading-down"
    | "subscribe"
    | "ghost"
    | "danger"
    | "outline"
    | "default"
    | "success"
    | "warning"
    | "error"
    | "link"
  size?: "xs" | "sm" | "md" | "lg"
}

const base =
  "inline-flex items-center justify-center font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fcd535] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0e11] disabled:cursor-not-allowed select-none"

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  /* ── Primary: yellow with black text ── */
  "primary":
    "bg-[#fcd535] text-[#181a20] rounded-[6px] hover:bg-[#f0b90b] active:bg-[#f0b90b] disabled:bg-[#3a3a1f] disabled:text-[#707a8a]",

  /* ── Primary pill: top-of-page CTA ── */
  "primary-pill":
    "bg-[#fcd535] text-[#181a20] rounded-full hover:bg-[#f0b90b] active:bg-[#f0b90b] disabled:bg-[#3a3a1f] disabled:text-[#707a8a]",

  /* ── Secondary: dark surface ── */
  "secondary":
    "bg-[#1e2329] text-white border border-[#2b3139] rounded-[6px] hover:bg-[#2b3139] active:bg-[#2b3139]",

  /* ── Secondary: light surface ── */
  "secondary-light":
    "bg-white text-[#181a20] border border-[#eaecef] rounded-[6px] hover:bg-[#f5f5f5] active:bg-[#f5f5f5]",

  /* ── Tertiary: transparent text ── */
  "tertiary":
    "bg-transparent text-[#eaecef] hover:text-white rounded-[6px]",

  /* ── Trading: green Buy / Long ── */
  "trading-up":
    "bg-[#0ecb81] text-white rounded-[4px] hover:opacity-90 active:opacity-80",

  /* ── Trading: red Sell / Short ── */
  "trading-down":
    "bg-[#f6465d] text-white rounded-[4px] hover:opacity-90 active:opacity-80",

  /* ── Subscribe: compact yellow for table rows ── */
  "subscribe":
    "bg-[#fcd535] text-[#181a20] rounded-[4px] hover:bg-[#f0b90b]",

  /* ── Ghost: transparent, subtle hover ── */
  "ghost":
    "bg-transparent text-[#eaecef] hover:bg-[#1e2329] rounded-[6px]",

  /* ── Danger: red destructive ── */
  "danger":
    "bg-[#f6465d] text-white rounded-[6px] hover:opacity-90",

  /* ── Outline: hairline border ── */
  "outline":
    "bg-transparent border border-[#2b3139] text-[#eaecef] rounded-[6px] hover:bg-[#1e2329]",

  /* ── Default: neutral gray ── */
  "default":
    "bg-[#2b3139] text-[#eaecef] rounded-[6px] hover:bg-[#707a8a]",

  /* ── Success (alias trading-up) ── */
  "success":
    "bg-[#0ecb81] text-white rounded-[6px] hover:opacity-90",

  /* ── Warning ── */
  "warning":
    "bg-amber-500 text-white rounded-[6px] hover:opacity-90",

  /* ── Error (alias danger) ── */
  "error":
    "bg-[#f6465d] text-white rounded-[6px] hover:opacity-90",

  /* ── Text link ── */
  "link":
    "bg-transparent text-[#fcd535] hover:text-[#f0b90b] underline-offset-2 hover:underline rounded-none",
}

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "text-xs px-3 py-1 h-7",
  sm: "text-sm px-4 py-1.5 h-8",
  md: "text-sm px-6 py-3 h-10",   /* matches Binance button-primary spec */
  lg: "text-sm px-8 py-3.5 h-12",
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
