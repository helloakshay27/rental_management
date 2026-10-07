
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
      "inline-flex flex-wrap items-center justify-center rounded-[10px] bg-[#f3f4f6] p-1 text-gray-500 w-full",
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
      "inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
      "max-sm:flex-col max-sm:gap-1 max-sm:whitespace-normal max-sm:break-words max-sm:px-2 max-sm:py-2 max-sm:text-center max-sm:text-[11px] max-sm:leading-tight max-sm:[&_svg]:mr-0 max-sm:[&_svg]:ml-0",
      "data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 data-[state=inactive]:bg-transparent data-[state=inactive]:[&_svg]:text-gray-500",
      "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=active]:[&_svg]:text-gray-900",
      "[&_svg]:size-4 [&_svg]:shrink-0",
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
