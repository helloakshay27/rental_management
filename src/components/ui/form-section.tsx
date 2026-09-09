import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Section card for Add/Edit pages.
 *
 * Ported from fm-matrix-revamp's `AddAssetAuditPage`
 * (`/maintenance/audit/assets/add`): a white card with a clickable header
 * carrying a brand-filled numbered circle, an ALL-CAPS brand-coloured title and
 * a chevron that collapses the body.
 *
 *   <FormSection step={1} title="Basic details">
 *     <FormGrid>…fields…</FormGrid>
 *   </FormSection>
 */

interface FormSectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    title: React.ReactNode;
    /** Number shown in the circle. Omit for an un-numbered section. */
    step?: number;
    /** Set false to render a static header with no chevron. */
    collapsible?: boolean;
    defaultOpen?: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({
    title,
    step,
    collapsible = true,
    defaultOpen = true,
    className,
    children,
    ...props
}) => {
    const [expanded, setExpanded] = React.useState(defaultOpen);

    return (
        <div className={cn('rounded-lg border bg-white shadow-sm', className)} {...props}>
            <div
                className={cn(
                    'flex items-center justify-between p-4',
                    expanded && 'border-b',
                    collapsible && 'cursor-pointer'
                )}
                onClick={collapsible ? () => setExpanded(!expanded) : undefined}
            >
                <div className="flex items-center gap-3">
                    {step !== undefined && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand">
                            <span className="text-sm text-white">{step}</span>
                        </div>
                    )}
                    <h2 className="text-brand-body-3 font-semibold text-brand">{title}</h2>
                </div>
                {collapsible && (expanded ? <ChevronUp /> : <ChevronDown />)}
            </div>

            {expanded && <div className="p-4 sm:p-6">{children}</div>}
        </div>
    );
};

/** The reference's field grid: up to four columns on desktop. */
export const FormGrid: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    children,
    ...props
}) => (
    <div
        className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4', className)}
        {...props}
    >
        {children}
    </div>
);

/** Centred action row, sitting outside the section cards. */
export const FormActions: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    children,
    ...props
}) => (
    <div className={cn('flex flex-wrap justify-center gap-4', className)} {...props}>
        {children}
    </div>
);

export default FormSection;
