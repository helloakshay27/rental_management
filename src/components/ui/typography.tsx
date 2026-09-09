
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Reusable typography primitives for the Lockated design system.
 *
 * Modelled on fm-matrix-revamp's `ui/heading.tsx`, but driven by the brand type
 * tokens in `src/styles/theme.css` instead of hardcoded Tailwind steps. Those
 * tokens shrink on tablet and mobile, so a `<Heading>` is responsive without
 * per-breakpoint classes.
 *
 * Scale (desktop → mobile):
 *   h1  26px → 16px      body-1  20px → 12px
 *   h2  24px → 14px      body-2  18px → 12px
 *                        body-3  16px → 12px
 *                        body-4  14px → 10px   (default body text)
 *                        body-5  12px → 10px
 *                        caption 10px → 10px
 */

const headingVariants = cva("font-sans tracking-tight text-brand-text", {
  variants: {
    level: {
      h1: "text-brand-h1 font-semibold leading-tight",
      h2: "text-brand-h2 font-semibold leading-tight",
      h3: "text-brand-body-1 font-semibold leading-tight",
      h4: "text-brand-body-2 font-medium leading-tight",
      h5: "text-brand-body-3 font-medium leading-tight",
      h6: "text-brand-body-4 font-medium leading-tight",
    },
    variant: {
      default: "text-brand-text",
      primary: "text-brand",
      muted: "text-brand-text-light",
      success: "text-brand-success",
      error: "text-brand-error",
    },
    spacing: {
      none: "mb-0",
      tight: "mb-2",
      normal: "mb-4",
      loose: "mb-6",
    },
  },
  defaultVariants: {
    level: "h1",
    variant: "default",
    spacing: "none",
  },
})

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  /** Render a different tag than the visual level (e.g. an h2-looking h1). */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div"
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, variant, spacing, as, ...props }, ref) => {
    const Comp = (as || level || "h1") as React.ElementType

    return (
      <Comp
        className={cn(headingVariants({ level: level || (as as any), variant, spacing }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

const textVariants = cva("font-sans", {
  variants: {
    size: {
      lg: "text-brand-body-2",
      md: "text-brand-body-3",
      base: "text-brand-body-4",
      sm: "text-brand-body-5",
      caption: "text-brand-caption",
    },
    variant: {
      default: "text-brand-text",
      muted: "text-brand-text-light",
      primary: "text-brand",
      success: "text-brand-success",
      warning: "text-brand-warning",
      error: "text-brand-error",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "base",
    variant: "default",
    weight: "regular",
  },
})

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div" | "label"
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, variant, weight, as = "p", ...props }, ref) => {
    const Comp = as as React.ElementType

    return (
      <Comp
        className={cn(textVariants({ size, variant, weight }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"

export { Heading, headingVariants, Text, textVariants }
