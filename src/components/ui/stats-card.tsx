
import * as React from "react"

import { cn } from "@/lib/utils"

export interface StatsCardProps {
  /** Small label under the value, e.g. "Open Tasks". */
  title: string
  value: string | number
  /** Rendered inside the tan chip; brand-tinted automatically. */
  icon?: React.ReactNode
  /** Highlights the card, for click-to-filter tiles. */
  selected?: boolean
  onClick?: (title: string) => void
  className?: string
  valueClassName?: string
  titleClassName?: string
  iconWrapperClassName?: string
  /** Optional line below the label, e.g. a period-over-period delta. */
  footer?: React.ReactNode
}

/**
 * Stat tile, matching fm-matrix-revamp: a warm cream card with a tan rounded
 * icon chip on the left, then the value above a small muted label. Sizes step
 * up across breakpoints so a row of these stays readable on mobile.
 */
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
        "flex items-center gap-3 rounded-lg p-3 sm:p-4",
        "shadow-[0_4px_14px_0_rgba(44,44,44,0.10)] transition-shadow",
        "hover:shadow-[0_6px_18px_0_rgba(44,44,44,0.14)]",
        selected ? "bg-brand-stat-selected" : "bg-brand-stat",
        interactive && "cursor-pointer",
        className
      )}
      onClick={interactive ? () => onClick?.(title) : undefined}
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
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-stat-icon sm:h-11 sm:w-11",
            "[&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-brand sm:[&_svg]:h-5 sm:[&_svg]:w-5",
            iconWrapperClassName
          )}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-brand-body-2 font-semibold text-brand-text sm:text-brand-body-1",
            valueClassName
          )}
        >
          {value}
        </p>
        <p
          className={cn(
            "truncate text-brand-body-5 font-medium text-brand-text-light",
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
