'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  shortcut?: string
  category?: string
  onSelect: () => void
}

export interface CommandPaletteProps {
  items: CommandItem[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  className?: string
}

const CommandPalette = ({
  items,
  open: controlledOpen,
  onOpenChange,
  placeholder = "Search commands...",
  className,
}: CommandPaletteProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const isOpen = controlledOpen ?? internalOpen

  const setOpen = (val: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(val)
    onOpenChange?.(val)
    if (!val) setQuery("")
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(!isOpen)
      }
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  React.useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setSelectedIndex(0)
    }
  }, [isOpen])

  const filtered = React.useMemo(() => {
    if (!query) return items
    const q = query.toLowerCase()
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
    )
  }, [items, query])

  React.useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      filtered[selectedIndex].onSelect()
      setOpen(false)
    }
  }

  if (!isOpen) return null

  const categories = [...new Set(filtered.map((i) => i.category).filter(Boolean))] as string[]

  return (
    <div
      className={cn("fixed inset-0 z-[500] flex items-start justify-center pt-[15vh] bg-black/60", className)}
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg rounded-xl border border-[#2b3139] bg-[#1e2329] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-[#2b3139]">
          <svg className="w-4 h-4 text-[#848e9c] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Search"
            aria-activedescendant={filtered[selectedIndex] ? `cmd-item-${filtered[selectedIndex].id}` : undefined}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            className="flex-1 py-3 bg-transparent text-white text-sm outline-none placeholder:text-[#848e9c]"
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-[#2b3139] text-[#848e9c]">
            ESC
          </kbd>
        </div>

        {filtered.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#848e9c]">No results found</div>
        ) : (
          <div id="command-palette-list" className="max-h-80 overflow-y-auto py-2">
            {categories.length > 0
              ? categories.map((cat) => (
                  <div key={cat}>
                    <div className="px-4 py-1.5 text-[10px] font-medium text-[#9ea3ad] uppercase tracking-wider">
                      {cat}
                    </div>
                    {filtered
                      .filter((i) => i.category === cat)
                      .map((item, idx) => {
                        const globalIdx = filtered.indexOf(item)
                        return (
                          <button
                            key={item.id}
                            id={`cmd-item-${item.id}`}
                            type="button"
                            onClick={() => { item.onSelect(); setOpen(false) }}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer",
                              globalIdx === selectedIndex
                                ? "bg-[#fcd535]/10 text-[#fcd535]"
                                : "text-white/80 hover:bg-[#2b3139]"
                            )}
                          >
                            {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
                            <div className="min-w-0 flex-1">
                              <div className="text-sm">{item.label}</div>
                              {item.description && (
                                <div className="text-xs text-[#848e9c] truncate">{item.description}</div>
                              )}
                            </div>
                            {item.shortcut && (
                              <kbd className="text-[10px] text-[#9ea3ad] bg-[#2b3139] px-1.5 py-0.5 rounded">
                                {item.shortcut}
                              </kbd>
                            )}
                          </button>
                        )
                      })}
                  </div>
                ))
              : filtered.map((item, idx) => (
                  <button
                    key={item.id}
                    id={`cmd-item-${item.id}`}
                    type="button"
                    onClick={() => { item.onSelect(); setOpen(false) }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer",
                      idx === selectedIndex
                        ? "bg-[#fcd535]/10 text-[#fcd535]"
                        : "text-white/80 hover:bg-[#2b3139]"
                    )}
                  >
                    {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-[#848e9c] truncate">{item.description}</div>
                      )}
                    </div>
                    {item.shortcut && (
                      <kbd className="text-[10px] text-[#9ea3ad] bg-[#2b3139] px-1.5 py-0.5 rounded">
                        {item.shortcut}
                      </kbd>
                    )}
                  </button>
                ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { CommandPalette }
