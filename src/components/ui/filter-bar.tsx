'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
}

export interface FilterBarProps {
  groups: FilterGroup[]
  selected: Record<string, string[]>
  onSelectionChange: (groupId: string, values: string[]) => void
  className?: string
}

const FilterBar = ({ groups, selected, onSelectionChange, className }: FilterBarProps) => {
  const hasSelection = Object.values(selected).some((v) => v.length > 0)

  const toggle = (groupId: string, value: string) => {
    const current = selected[groupId] ?? []
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onSelectionChange(groupId, next)
  }

  const clearAll = () => {
    for (const group of groups) {
      onSelectionChange(group.id, [])
    }
  }

  const allSelectedValues = Object.entries(selected).flatMap(([, values]) => values)

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <div key={group.id} className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-[#848e9c] font-medium mr-1">{group.label}:</span>
            {group.options.map((option) => {
              const isSelected = (selected[group.id] ?? []).includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggle(group.id, option.value)}
                  aria-pressed={isSelected}
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer",
                    isSelected
                      ? "bg-[#fcd535] text-[#181a20] font-medium"
                      : "bg-[#2b3139] text-white/60 hover:bg-[#3a4250] hover:text-white"
                  )}
                >
                  {option.label}
                  {option.count !== undefined && (
                    <span className={cn("text-[10px]", isSelected ? "text-[#181a20]/60" : "text-[#9ea3ad]")}>
                      {option.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {hasSelection && (
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {allSelectedValues.map((val) => {
              const option = groups.flatMap((g) => g.options).find((o) => o.value === val)
              return option ? (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[#fcd535]/10 text-[#fcd535]"
                >
                  {option.label}
                </span>
              ) : null
            })}
          </div>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-[#848e9c] hover:text-white transition-colors cursor-pointer ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}

export { FilterBar }
