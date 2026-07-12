'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  className?: string
}

function getPageRange(current: number, total: number, siblings: number): (number | "ellipsis")[] {
  const totalNumbers = siblings * 2 + 5
  if (totalNumbers >= total) return Array.from({ length: total }, (_, i) => i + 1)

  const leftSibling = Math.max(current - siblings, 1)
  const rightSibling = Math.min(current + siblings, total)
  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < total - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3 + 2 * siblings
    const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1)
    return [...leftRange, "ellipsis", total]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + 2 * siblings
    const rightRange = Array.from({ length: rightCount }, (_, i) => total - rightCount + i + 1)
    return [1, "ellipsis", ...rightRange]
  }

  return [1, "ellipsis", ...Array.from({ length: rightSibling - leftSibling + 1 }, (_, i) => leftSibling + i), "ellipsis", total]
}

const Pagination = ({ currentPage, totalPages, onPageChange, siblingCount = 1, className }: PaginationProps) => {
  const pages = getPageRange(currentPage, totalPages, siblingCount)

  if (totalPages <= 1) return null

  const btnBase = "inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm transition-colors"

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(btnBase, "text-[#848e9c] hover:bg-[#2b3139] disabled:opacity-30 disabled:cursor-not-allowed")}
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className={cn(btnBase, "text-[#848e9c] cursor-default")}>
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              btnBase,
              page === currentPage
                ? "bg-[#fcd535] text-[#181a20] font-medium"
                : "text-[#848e9c] hover:bg-[#2b3139] hover:text-white"
            )}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(btnBase, "text-[#848e9c] hover:bg-[#2b3139] disabled:opacity-30 disabled:cursor-not-allowed")}
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  )
}

export { Pagination }
