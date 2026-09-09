import React from 'react';
import { ChevronDownCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Details-page primitives.
 *
 * Ported from fm-matrix-revamp's `ProjectTaskDetails` (`/vas/tasks/:id`): a
 * white rounded card whose header carries a rotating ChevronDownCircle and an
 * ALL-CAPS title, with label/value pairs inside.
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
            className={cn('mb-5 rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm', className)}
            {...props}
        >
            <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                {collapsible && (
                    <ChevronDownCircle
                        color="#E95420"
                        size={22}
                        className={cn(
                            'shrink-0 cursor-pointer transition-transform',
                            open ? 'rotate-0' : 'rotate-180'
                        )}
                        onClick={() => setOpen(!open)}
                    />
                )}
                <h3 className="flex-1 text-brand-body-3 font-semibold uppercase text-[#1A1A1A]">{title}</h3>
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

/** Record title block with the reference's 3px rule and meta row. */
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
                <span className="text-brand-body-2 font-semibold text-brand-text">{title}</span>
            </div>
            {actions}
        </div>

        <div className="mt-2 border-b-[3px] border-[rgba(190,190,190,1)]" />

        {meta && (
            <div className="my-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#323232]">
                {meta}
            </div>
        )}
    </div>
);

export default DetailSection;
