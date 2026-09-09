
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // No `[&_svg]:size-4` here, matching fm-matrix-revamp. That rule compiles to
  // a descendant selector, which outranks an icon's own `h-5 w-5`/`h-6 w-6`
  // class and silently shrank every button icon in the app to 16px. Call sites
  // size their own icons (verified: none rely on a default).
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-center font-medium tracking-[0.5px] border-0 rounded-none ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-brand hover:bg-brand-hover !text-white [&_svg]:!text-white",
        destructive: "bg-brand-error-bg text-brand-error hover:bg-brand-error-light [&_svg]:text-brand-error",
        outline: "bg-brand-card text-brand border border-brand hover:bg-brand-selected [&_svg]:text-brand",
        secondary: "bg-brand-card-bg text-brand border-none hover:bg-brand-selected [&_svg]:text-brand",
        primary: "bg-brand-card-bg text-brand hover:bg-brand-selected [&_svg]:text-brand",
        ghost: "bg-transparent text-brand-text hover:bg-brand-selected [&_svg]:text-brand-text",
        link: "text-brand underline-offset-4 hover:underline [&_svg]:text-brand",
        success: "bg-brand-success text-white hover:opacity-90 [&_svg]:text-white",
        warning: "bg-brand-warning text-brand-text hover:opacity-90 [&_svg]:text-brand-text",
        icon: "bg-transparent text-brand [&_svg]:text-brand",
      },
      // Heights are deliberately NOT responsive. tailwind-merge cannot resolve
      // `sm:h-[36px]` against a caller's plain `h-20`/`h-24`, so a responsive
      // default silently clamps every custom-height button above 640px and its
      // content overflows the border. A single unmodified height stays
      // overridable, which is what tall tile-style buttons rely on.
      size: {
        default: "h-9 px-4 py-1.5 text-brand-body-4",
        sm: "h-9 px-3 py-1 text-brand-body-5",
        lg: "h-9 px-6 py-2 text-brand-body-3",
        icon: "h-9 w-9 p-1.5",
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
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
