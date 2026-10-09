
import * as React from "react"

import { cn } from "@/lib/utils"

export interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  selected?: boolean
  onClick?: (title: string) => void
  className?: string
  valueClassName?: string
  titleClassName?: string
  iconWrapperClassName?: string
  footer?: React.ReactNode
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  selected = false,
  onClick,
  className,
  valueClassName,
  titleClassName,
  iconWrapperClassName,
  footer,
}) => {
  const interactive = typeof onClick === "function"

  return (
    <div
      className={cn(
        "rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm hover:shadow-lg transition-shadow flex items-center gap-2 sm:gap-3 lg:gap-4 cursor-pointer",
        selected ? "bg-[rgb(230_226_218_/_1)]" : "bg-[#f6f4ee]",
        className
      )}
      onClick={() => onClick?.(title)}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick?.(title)
              }
            }
          : undefined
      }
    >
      {icon && (
        <div
          className={cn(
            "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#C4B89D54] flex items-center justify-center flex-shrink-0",
            iconWrapperClassName
          )}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-lg sm:text-xl lg:text-2xl font-semibold text-[#1A1A1A] truncate",
            valueClassName
          )}
        >
          {value}
        </p>
        <p
          className={cn(
            "text-xs sm:text-sm font-medium text-[#1A1A1A] truncate",
            titleClassName
          )}
        >
          {title}
        </p>
        {footer}
      </div>
    </div>
  )
}

export default StatsCard
