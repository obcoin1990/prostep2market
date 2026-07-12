import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = "", fallback, size = "md", ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false)

    if (src && !imgError) {
      return (
        <div
          ref={ref}
          className={cn("rounded-full overflow-hidden shrink-0", sizeMap[size], className)}
          {...props}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-full flex items-center justify-center font-medium shrink-0",
          "bg-[#fcd535] text-[#181a20]",
          sizeMap[size],
          className
        )}
        {...props}
      >
        {fallback ? getInitials(fallback) : "?"}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }
