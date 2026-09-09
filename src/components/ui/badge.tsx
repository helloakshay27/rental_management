
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-brand-body-5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand text-white hover:bg-brand-hover",
        secondary: "border-transparent bg-brand-green-light text-brand-success",
        destructive: "border-transparent bg-brand-error-bg text-brand-error",
        outline: "text-brand-text border border-brand-border",
        brand: "border-transparent bg-brand-light text-brand",
        success: "border-transparent bg-brand-success-bg text-brand-success",
        warning: "border-transparent bg-brand-warning-light text-brand-text",
        info: "border-transparent bg-brand-teal-light text-brand-text",
        tag: "border-transparent bg-brand-purple-light text-brand-text",
        pending: "border-transparent bg-brand-warning-light text-brand-text",
        rejected: "border-transparent bg-brand-error-bg text-brand-error",
        accepted: "border-transparent bg-brand-success-bg text-brand-success",
        active: "border-transparent bg-brand-success-bg text-brand-success",
        inactive: "border-transparent bg-brand-muted text-brand-text",
        expired: "border-transparent bg-brand-error-bg text-brand-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
