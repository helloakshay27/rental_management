import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TableFilterDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Commit the pending filter values. The dialog closes itself afterwards. */
    onApply: () => void;
    /** Clear the filters back to their defaults. The dialog stays open. */
    onReset: () => void;
    title?: string;
    /** The filter fields — usually one <FilterField> per control. */
    children: React.ReactNode;
    className?: string;
}

/**
 * The "FILTER BY" modal used by every EnhancedTable filter button.
 *
 * Built on the Radix primitives rather than `@/components/ui/dialog` because
 * that wrapper bakes in its own close button and header spacing, which fight
 * the flat layout this modal needs.
 */
export const TableFilterDialog: React.FC<TableFilterDialogProps> = ({
    open,
    onOpenChange,
    onApply,
    onReset,
    title = 'FILTER BY',
    children,
    className,
}) => (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <DialogPrimitive.Content
                className={cn(
                    'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2',
                    'rounded-lg bg-white p-6 shadow-xl',
                    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    className
                )}
            >
                <div className="mb-5 flex items-start justify-between">
                    <DialogPrimitive.Title className="text-base font-bold tracking-wide text-[#1a1a1a]">
                        {title}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Close className="rounded-sm text-gray-400 transition-colors hover:text-gray-700 focus:outline-none">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                </div>

                <div className="space-y-5">{children}</div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        onClick={() => {
                            onApply();
                            onOpenChange(false);
                        }}
                        className="fm-button-fix fm-button-brand px-6 py-2"
                    >
                        Apply Filters
                    </Button>
                    <Button variant="outline" onClick={onReset} className="fm-button-fix px-6 py-2">
                        Reset
                    </Button>
                </div>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
);

/**
 * A single labelled control inside the modal. The label sits on the field's
 * top border, matching the reference design's notched-outline look.
 */
export const FilterField: React.FC<{ label: string; children: React.ReactNode }> = ({
    label,
    children,
}) => (
    <div className="relative rounded-md border border-gray-300 px-3 pb-3 pt-3">
        <span className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500">{label}</span>
        {children}
    </div>
);

export default TableFilterDialog;
