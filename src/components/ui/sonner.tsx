import { Check, X } from "lucide-react"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

// Shared screenshot-style toast: white top-right card, dark text and status icon.
const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="light"
    position="top-right"
    offset={24}
    duration={4000}
    visibleToasts={3}
    closeButton
    className="toaster group"
    style={{
      "--normal-bg": "#ffffff",
      "--normal-text": "#1a1a18",
      "--normal-border": "#e5e7eb",
      "--border-radius": "8px",
      "--width": "min(480px, calc(100vw - 32px))",
      width: "min(480px, calc(100vw - 32px))",
    } as React.CSSProperties}
    icons={{
      success: <Check className="h-4 w-4" strokeWidth={2.5} />,
      error: <X className="h-4 w-4" strokeWidth={2.5} />,
    }}
    toastOptions={{
      classNames: {
        toast: "!w-full !max-w-full !left-auto !right-0 !ml-auto !mr-0 !px-4 !py-4 !gap-3 !shadow-lg !font-medium !text-sm",
        title: "!font-semibold",
        description: "!text-[#1a1a18] !font-normal",
        content: "min-w-0 break-words",
        icon: "!text-[#1a1a18]",
        warning: "[&_[data-icon]]:!text-[#7a4a00]",
        info: "[&_[data-icon]]:!text-[#245a8a]",
        closeButton: "!bg-white !text-[#1a1a18] !border-[#e5e7eb]",
        actionButton: "!bg-[#1a1a18] !text-white",
        cancelButton: "!bg-black/10 !text-[#1a1a18]",
      },
    }}
    {...props}
  />
)

export { Toaster, toast }
