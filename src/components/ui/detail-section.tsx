import React from 'react';
import { ChevronDownCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Details-page primitives.
 *
 * Ported from fm-matrix-revamp's `ProjectTaskDetails` (`/vas/tasks/:id`): a
 * white rounded card whose header carries a rotating ChevronDownCircle and a
 * title-case 14px/600 section title, with label/value pairs inside.
 *
 *   <DetailHeader id="LSE000038" title="Idea Cellular Limited" meta={…} />
 *   <DetailSection title="Details">
 *     <DetailGrid>
 *       <DetailField label="Property" value="Worly" />
 *     </DetailGrid>
 *   </DetailSection>
 */

interface DetailSectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    title: React.ReactNode;
    /** Rendered next to the title, e.g. a status pill or an edit button. */
    action?: React.ReactNode;
    /** Shown in place of the body while collapsed. */
    summary?: React.ReactNode;
    collapsible?: boolean;
    defaultOpen?: boolean;
}

export const DetailSection: React.FC<DetailSectionProps> = ({
    title,
    action,
    summary,
    collapsible = true,
    defaultOpen = true,
    className,
    children,
    ...props
}) => {
    const [open, setOpen] = React.useState(defaultOpen);

    return (
        <div
            className={cn('mb-5 rounded-[16px] border border-[rgba(26,26,24,0.08)] bg-white px-5 py-5 shadow-none sm:px-7 sm:py-6', className)}
            {...props}
        >
            <div className="flex items-center gap-3 border-b border-[rgba(26,26,24,0.08)] pb-3">
                {collapsible && (
                    <ChevronDownCircle
                        size={18}
                        strokeWidth={1.8}
                        className={cn(
                            'shrink-0 cursor-pointer text-[rgba(26,26,24,0.62)] transition-transform',
                            open ? 'rotate-0' : 'rotate-180'
                        )}
                        onClick={() => setOpen(!open)}
                    />
                )}
                <h3 className="flex-1 text-[14px] font-semibold text-[#1A1A18]">{title}</h3>
                {action}
            </div>

            {open ? (
                <div className="mt-4">{children}</div>
            ) : (
                summary && <div className="mt-4 flex flex-wrap items-center gap-6 text-[12px]">{summary}</div>
            )}
        </div>
    );
};

/** Label/value pair. */
export const DetailField: React.FC<{
    label: React.ReactNode;
    value: React.ReactNode;
    className?: string;
}> = ({ label, value, className }) => (
    <div className={cn('flex flex-col gap-1', className)}>
        <span className="text-[12px] font-[500] text-brand-text-light">{label}</span>
        <span className="text-brand-body-4 text-brand-text">{value ?? '-'}</span>
    </div>
);

/** Field grid used inside a section. */
export const DetailGrid: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    children,
    ...props
}) => (
    <div
        className={cn('grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3', className)}
        {...props}
    >
        {children}
    </div>
);

interface DetailHeaderProps {
    /** Record identifier, shown brand-coloured before the title. */
    id?: React.ReactNode;
    title: React.ReactNode;
    /** Small meta line under the rule: created by, dates, status… */
    meta?: React.ReactNode;
    /** Right-aligned actions, e.g. Edit. */
    actions?: React.ReactNode;
    className?: string;
}

/** Record title block: 22px/600 record title, hairline rule and meta row. */
export const DetailHeader: React.FC<DetailHeaderProps> = ({
    id,
    title,
    meta,
    actions,
    className,
}) => (
    <div className={cn('pt-1', className)}>
        <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
                {id && <span className="text-brand">{id}</span>}
                <h1 className="text-[22px] font-semibold leading-[1.2] tracking-[-0.015em] text-[#1A1A18]">{title}</h1>
            </div>
            {actions}
        </div>

        <div className="mt-3 border-b border-[rgba(26,26,24,0.08)]" />

        {meta && (
            <div className="my-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#323232]">
                {meta}
            </div>
        )}
    </div>
);

export default DetailSection;
