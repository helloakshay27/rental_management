
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const useComposedRefs = <T,>(
  ...refs: Array<React.ForwardedRef<T> | undefined>
) =>
  React.useCallback(
    (node: T | null) => {
      refs.forEach((ref) => {
        if (!ref) return
        if (typeof ref === "function") {
          ref(node)
          return
        }
        ref.current = node
      })
    },
    [refs]
  )

type IndicatorStyle = Pick<
  React.CSSProperties,
  "height" | "left" | "opacity" | "top" | "width"
>

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const localRef = React.useRef<React.ElementRef<typeof TabsPrimitive.List>>(null)
  const composedRef = useComposedRefs(ref, localRef)
  const [indicatorStyle, setIndicatorStyle] = React.useState<IndicatorStyle>({
    opacity: 0,
  })

  const syncIndicator = React.useCallback(() => {
    const list = localRef.current
    const activeTab = list?.querySelector<HTMLElement>(
      '[role="tab"][data-state="active"]'
    )

    if (!list || !activeTab) {
      setIndicatorStyle({ opacity: 0 })
      return
    }

    const listRect = list.getBoundingClientRect()
    const activeRect = activeTab.getBoundingClientRect()

    setIndicatorStyle({
      height: activeRect.height,
      left: activeRect.left - listRect.left + list.scrollLeft,
      opacity: 1,
      top: activeRect.top - listRect.top + list.scrollTop,
      width: activeRect.width,
    })
  }, [])

  React.useLayoutEffect(() => {
    syncIndicator()
  }, [children, syncIndicator])

  React.useEffect(() => {
    const list = localRef.current
    if (!list) return

    const observer = new MutationObserver(syncIndicator)
    observer.observe(list, {
      attributes: true,
      attributeFilter: ["data-state"],
      childList: true,
      subtree: true,
    })

    const resizeObserver = new ResizeObserver(syncIndicator)
    resizeObserver.observe(list)
    list
      .querySelectorAll<HTMLElement>('[role="tab"]')
      .forEach((tab) => resizeObserver.observe(tab))

    window.addEventListener("resize", syncIndicator)

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener("resize", syncIndicator)
    }
  }, [children, syncIndicator])

  const { onClickCapture, onKeyUpCapture, ...listProps } = props

  return (
    <TabsPrimitive.List
      ref={composedRef}
      className={cn(
        "relative inline-flex w-fit max-w-full flex-wrap items-center justify-start gap-[3px] overflow-hidden rounded-xl bg-[rgba(26,26,24,0.055)] p-[3px] text-[12.5px] text-[rgba(26,26,24,0.55)]",
        className
      )}
      onClickCapture={(event) => {
        onClickCapture?.(event)
        window.requestAnimationFrame(syncIndicator)
      }}
      onKeyUpCapture={(event) => {
        onKeyUpCapture?.(event)
        window.requestAnimationFrame(syncIndicator)
      }}
      {...listProps}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute z-0 rounded-lg bg-white shadow-[0_1px_2px_rgba(26,26,24,0.1),0_0_0_1px_rgba(26,26,24,0.05)] transition-[left,top,width,height,opacity] duration-200 ease-out"
        style={indicatorStyle}
      />
      {children}
    </TabsPrimitive.List>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative z-10 inline-flex min-h-8 items-center justify-center gap-[7px] whitespace-nowrap rounded-lg border-0 bg-transparent px-4 py-2 font-semibold leading-none transition-[color,transform] duration-150",
      "max-sm:flex-col max-sm:gap-1 max-sm:whitespace-normal max-sm:break-words max-sm:px-2 max-sm:py-2 max-sm:text-center max-sm:text-[11px] max-sm:leading-tight max-sm:[&_svg]:mr-0 max-sm:[&_svg]:ml-0",
      "data-[state=inactive]:text-[rgba(26,26,24,0.55)] data-[state=inactive]:hover:text-[#1A1A18] data-[state=inactive]:[&_svg]:text-[rgba(26,26,24,0.48)]",
      "data-[state=active]:text-[#1A1A18] data-[state=active]:[&_svg]:text-[#1A1A18]",
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
      "mt-4 ring-offset-background data-[state=active]:animate-[tab-panel-in_220ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
