
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // No `[&_svg]:size-4` here, matching fm-matrix-revamp. That rule compiles to
  // a descendant selector, which outranks an icon's own `h-5 w-5`/`h-6 w-6`
  // class and silently shrank every button icon in the app to 16px. Call sites
  // size their own icons (verified: none rely on a default).
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-center font-semibold tracking-normal border-0 rounded-[8px] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      // One ink primary per view. Secondary actions sit on a neutral surface with
      // a hairline; text and icons keep the same colour at rest, hover and focus.
      variant: {
        default: "bg-brand hover:bg-brand-hover !text-white [&_svg]:!text-white",
        // Danger: neutral secondary shell with danger text; the icon follows the text.
        destructive: "bg-[#FDFDFB] text-[#A32126] border border-[rgba(26,26,24,0.12)] hover:bg-[rgba(229,72,77,0.08)] hover:text-[#A32126] focus-visible:text-[#A32126] [&_svg]:text-current",
        outline: "bg-[#FDFDFB] text-[#1A1A18] border border-[rgba(26,26,24,0.12)] hover:bg-[#F5F4F0] hover:text-[#1A1A18] focus-visible:text-[#1A1A18] [&_svg]:text-current",
        secondary: "bg-[#FDFDFB] text-[#1A1A18] border border-[rgba(26,26,24,0.12)] hover:bg-[#F5F4F0] hover:text-[#1A1A18] focus-visible:text-[#1A1A18] [&_svg]:text-current",
        primary: "bg-[#FDFDFB] text-[#1A1A18] border border-[rgba(26,26,24,0.12)] hover:bg-[#F5F4F0] hover:text-[#1A1A18] [&_svg]:text-current",
        ghost: "bg-transparent text-brand-text hover:bg-brand-selected hover:text-brand-text [&_svg]:text-current",
        link: "text-brand underline-offset-4 hover:underline [&_svg]:text-current",
        success: "bg-brand-success text-white hover:opacity-90 [&_svg]:text-white",
        warning: "bg-brand-warning text-brand-text hover:opacity-90 [&_svg]:text-brand-text",
        icon: "bg-transparent text-brand hover:bg-brand-selected [&_svg]:text-current",
      },
      // Heights are deliberately NOT responsive. tailwind-merge cannot resolve
      // `sm:h-[36px]` against a caller's plain `h-20`/`h-24`, so a responsive
      // default silently clamps every custom-height button above 640px and its
      // content overflows the border. A single unmodified height stays
      // overridable, which is what tall tile-style buttons rely on.
      size: {
        // Standard action: 42px, radius 8px, padding 0 22px, 13px/600.
        default: "h-[42px] rounded-[8px] px-[22px] text-[13px] font-semibold",
        // Compact action: 40px, padding 0 18px, 12.5px/600.
        sm: "h-10 rounded-[8px] px-[18px] text-[12.5px] font-semibold",
        lg: "h-[42px] rounded-[8px] px-[22px] text-[13px] font-semibold",
        // Inline icon control: 32x32 ghost target, 8px corners.
        icon: "h-8 w-8 rounded-[8px] p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
