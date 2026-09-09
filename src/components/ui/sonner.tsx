import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * The app's only toast surface, matching fm-matrix-revamp: top-right, rich
 * colours (so success/error read at a glance), a close button, and a plain
 * white card with a hairline border.
 */
const Toaster = ({ ...props }: ToasterProps) => (
    <Sonner
        theme="light"
        position="top-right"
        richColors
        closeButton
        className="toaster group"
        toastOptions={{
            duration: 4000,
            style: {
                background: "white",
                border: "1px solid #e5e7eb",
                color: "#374151",
            },
            classNames: {
                toast:
                    "group toast group-[.toaster]:shadow-lg",
                description: "group-[.toast]:text-muted-foreground",
                actionButton:
                    "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                cancelButton:
                    "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
            },
        }}
        {...props}
    />
)

export { Toaster, toast }
