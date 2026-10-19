
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit items-center whitespace-nowrap rounded-full px-[10px] py-[3px] text-[11px] font-medium leading-[1.4] transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
  {
    variants: {
      variant: {
        // No saturated fill with inverse text: the default is the neutral metadata chip.
        default: "border border-[rgba(26,26,24,0.08)] bg-[#F5F4F0] text-[#1A1A18]",
        neutral: "border border-[rgba(26,26,24,0.08)] bg-[#F5F4F0] text-[#1A1A18]",
        secondary: "border border-[rgba(26,26,24,0.08)] bg-[#F5F4F0] text-[#1A1A18]",
        destructive: "border-transparent bg-brand-error-bg text-brand-error",
        outline: "text-brand-text border border-brand-border",
        brand: "border-transparent bg-brand-light text-brand",
        success: "border-transparent bg-brand-success-bg text-brand-success",
        warning: "border-transparent bg-[#FFF2D6] text-[#8A5A00]",
        info: "border-transparent bg-[rgba(47,111,224,0.12)] text-[#1F55B8]",
        tag: "border-transparent bg-brand-purple-light text-brand-text",
        pending: "border-transparent bg-[#FFF2D6] text-[#8A5A00]",
        rejected: "border-transparent bg-brand-error-bg text-brand-error",
        accepted: "border-transparent bg-brand-success-bg text-brand-success",
        active: "border-transparent bg-brand-success-bg text-brand-success",
        inactive: "border-transparent bg-[rgba(26,26,24,0.06)] text-[rgba(26,26,24,0.72)]",
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
