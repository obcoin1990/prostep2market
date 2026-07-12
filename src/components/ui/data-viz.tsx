import * as React from "react"
import { cn } from "@/lib/utils"

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  change?: { value: number; label?: string }
  icon?: React.ReactNode
  trend?: "up" | "down" | "neutral"
  variant?: "dark" | "elevated" | "light"
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, change, icon, trend, variant = "dark", ...props }, ref) => {
    const bgMap = {
      dark: "bg-[#1e2329] border-[#2b3139]",
      elevated: "bg-[#2b3139] border-[#3a4250]",
      light: "bg-white border-[#eaecef]",
    }

    const trendColors = {
      up: "text-[#0ecb81]",
      down: "text-[#f6465d]",
      neutral: "text-[#848e9c]",
    }

    return (
      <div
        ref={ref}
        className={cn("rounded-xl border p-5", bgMap[variant], className)}
        {...props}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={cn("text-sm", variant === "light" ? "text-[#9ea3ad]" : "text-[#848e9c]")}>
            {label}
          </span>
          {icon && <span className={cn("w-5 h-5", variant === "light" ? "text-[#9ea3ad]" : "text-[#848e9c]")}>{icon}</span>}
        </div>
        <div className={cn("text-2xl font-bold", variant === "light" ? "text-[#181a20]" : "text-white")}>
          {value}
        </div>
        {change && (
          <div className="flex items-center gap-1 mt-1">
            <span className={cn("text-sm font-medium", trendColors[trend ?? (change.value >= 0 ? "up" : "down")])}>
              {change.value >= 0 ? "+" : ""}{change.value}%
            </span>
            {change.label && <span className="text-xs text-[#848e9c]">{change.label}</span>}
          </div>
        )}
      </div>
    )
  }
)
StatCard.displayName = "StatCard"

export interface MiniChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[]
  color?: string
  height?: number
}

const MiniChart = React.forwardRef<HTMLDivElement, MiniChartProps>(
  ({ className, data, color = "#0ecb81", height = 40, ...props }, ref) => {
    if (data.length < 2) return null

    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const width = 100

    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((d - min) / range) * height
      return `${x},${y}`
    })

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none" role="img" aria-label="Trend chart">
          <polyline
            points={points.join(" ")}
            fill="none"
            stroke={color}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    )
  }
)
MiniChart.displayName = "MiniChart"

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  color?: string
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  label?: string
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, max = 100, color = "#fcd535", size = "md", showLabel, label, ...props }, ref) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100))
    const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" }

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {(showLabel || label) && (
          <div className="flex items-center justify-between mb-1">
            {label && <span className="text-xs text-[#848e9c]">{label}</span>}
            {showLabel && <span className="text-xs text-[#848e9c]">{Math.round(pct)}%</span>}
          </div>
        )}
        <div className={cn("w-full rounded-full bg-[#2b3139] overflow-hidden", heights[size])}>
          <div
            className={cn("rounded-full transition-all duration-300", heights[size])}
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      </div>
    )
  }
)
ProgressBar.displayName = "ProgressBar"

export interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
}

const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(
  ({ className, value, max = 100, size = 80, strokeWidth = 6, color = "#fcd535", label, ...props }, ref) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100))
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (pct / 100) * circumference

    return (
      <div ref={ref} className={cn("relative inline-flex items-center justify-center", className)} {...props}>
        <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${pct.toFixed(0)}% complete`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2b3139"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        {label && (
          <span className="absolute text-sm font-semibold text-white">{label}</span>
        )}
      </div>
    )
  }
)
DonutChart.displayName = "DonutChart"

export { StatCard, MiniChart, ProgressBar, DonutChart }
