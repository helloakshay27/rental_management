import React from 'react';
import { Building2, CalendarDays, Car, ChevronDown, CircleDollarSign, ClipboardList, FileText, Paperclip, ShieldCheck, User, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Section card for Add/Edit pages.
 *
 * Shared screenshot-style section: white rounded shell, compact icon,
 * uppercase title and an accessible collapse button.
 *
 *   <FormSection step={1} title="Basic details">
 *     <FormGrid>…fields…</FormGrid>
 *   </FormSection>
 */

interface FormSectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    title: React.ReactNode;
    /** Legacy section order; step numbering belongs in the form's stepper. */
    step?: number;
    icon?: LucideIcon;
    /** Set false to render a static header with no chevron. */
    collapsible?: boolean;
    defaultOpen?: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({
    title,
    step,
    icon,
    collapsible = true,
    defaultOpen = true,
    className,
    children,
    ...props
}) => {
    const [expanded, setExpanded] = React.useState(defaultOpen);
    const contentId = React.useId();
    const titleId = React.useId();
    const isOpen = !collapsible || expanded;
    const label = typeof title === 'string' ? title.toLowerCase() : '';
    const Icon = icon ?? (
        /attachment|document|file/.test(label) ? Paperclip :
        /parking|vehicle/.test(label) ? Car :
        /date|period|schedule/.test(label) ? CalendarDays :
        /rent|charge|payment|tax|cost|penalty/.test(label) ? CircleDollarSign :
        /property|facility|amenit/.test(label) ? Building2 :
        /tenant|lessee|landlord|signing|contact/.test(label) ? User :
        /compliance|review/.test(label) ? ShieldCheck :
        /agreement|term/.test(label) ? FileText : ClipboardList
    );
    const heading = <><span className="form-section-icon"><Icon aria-hidden="true" /></span><span className="form-section-title">{title}</span>{collapsible && <ChevronDown aria-hidden="true" className={cn('form-section-chevron', isOpen && 'is-open')} />}</>;

    return (
        <div className={cn('asset-form-section form-section-shell', className)} {...props}>
            <h2 id={titleId} className="form-section-heading">
                {collapsible ? <button type="button" className="form-section-header" aria-expanded={isOpen} aria-controls={contentId} onClick={() => setExpanded(value => !value)}>{heading}</button> : <span className="form-section-header">{heading}</span>}
            </h2>
            <div id={contentId} aria-labelledby={titleId} hidden={!isOpen} className="form-section-content">{children}</div>
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
    <div className={cn('flex flex-wrap justify-end gap-3 mt-8 pt-6 border-t border-gray-100', className)} {...props}>
        {children}
    </div>
);

export default FormSection;
