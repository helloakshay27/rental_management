
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

/**
 * Segmented tab bar, matching fm-matrix-revamp: one full-width strip of
 * equal-width segments with hairline dividers. The active segment takes a warm
 * `--color-tab-active-bg` fill with brand-coloured text; inactive segments stay
 * white. Icons inside a trigger are brand-tinted in both states.
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // flex-wrap matches the reference: tab bars with many segments wrap to a
      // second row instead of overflowing or squeezing labels away.
      // The strip is outlined on all four sides with no divider between
      // segments — the active fill is what separates them — and the segments sit
      // inside a small gutter.
      "flex w-full flex-wrap justify-stretch h-auto overflow-hidden rounded-none border border-brand-border bg-brand-card px-1.5 py-1.5 gap-0 text-brand-body-4",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex flex-1 min-w-0 items-center justify-center gap-2 whitespace-nowrap border-0 px-6 py-2 text-brand-body-4 font-semibold transition-colors",
      "hover:bg-brand-selected",
      // Both states are declared as data-state variants rather than an
      // unmodified base plus an override. Two reasons: tailwind-merge keeps
      // `text-brand-body-4` (the size) only when no unmodified `text-*` colour
      // competes with it, and equal-specificity variants make the active fill
      // immune to utility-vs-variant cascade order.
      "data-[state=inactive]:bg-brand-card data-[state=inactive]:text-brand-text",
      "data-[state=active]:bg-brand-tab-active data-[state=active]:text-brand",
      "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-brand",
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
