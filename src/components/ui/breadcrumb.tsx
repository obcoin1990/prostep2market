import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, separator = "/", ...props }, ref) => (
    <nav ref={ref} aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-sm", className)} {...props}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <React.Fragment key={`${item.label}-${i}`}>
            {i > 0 && (
              <span className="text-[#848e9c] select-none" aria-hidden="true">
                {separator}
              </span>
            )}
            {isLast || !item.href ? (
              <span className={cn(isLast ? "text-white font-medium" : "text-[#848e9c]")} aria-current={isLast ? "page" : undefined}>
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="text-[#848e9c] hover:text-white transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
)
Breadcrumb.displayName = "Breadcrumb"

export { Breadcrumb }
