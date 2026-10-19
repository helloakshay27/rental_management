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
    title = 'Filter by',
    children,
    className,
}) => (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <DialogPrimitive.Content
                className={cn(
                    'fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-[480px] max-h-[86vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2',
                    'rounded-[24px] bg-[#FDFDFB] p-7 shadow-[0_24px_64px_rgba(26,26,24,0.18)]',
                    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    className
                )}
            >
                <div className="mb-5 flex items-center justify-between">
                    <DialogPrimitive.Title className="text-[16px] font-semibold text-[#1A1A18]">
                        {title}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Close className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[rgba(26,26,24,0.48)] transition-colors hover:bg-[rgba(26,26,24,0.07)] hover:text-[#1A1A18] focus:outline-none">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                </div>

                <div className="space-y-4">{children}</div>

                <div className="mt-7 flex justify-end gap-3">
                    <Button
                        onClick={() => {
                            onApply();
                            onOpenChange(false);
                        }}
                        className="fm-button-fix fm-button-brand"
                    >
                        Apply Filters
                    </Button>
                    <Button variant="outline" onClick={onReset} className="fm-button-fix">
                        Reset
                    </Button>
                </div>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
);

/**
 * A single labelled control inside the modal: label above the control
 * (12px/600 soft ink, 6px gap), never in a notch in the outline.
 */
export const FilterField: React.FC<{ label: string; children: React.ReactNode }> = ({
    label,
    children,
}) => (
    <div className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-[rgba(26,26,24,0.62)]">{label}</span>
        {children}
    </div>
);

export default TableFilterDialog;
