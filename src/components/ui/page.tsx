import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Heading, Text } from '@/components/ui/typography';

/**
 * Page layout primitives — the single source of truth for how every screen is
 * spaced. Pages had drifted apart (p-6 vs p-8, space-y-6 vs space-y-8, some
 * with their own bg/min-height), which is what made the padding and the gap
 * between the stat row and the table look different from page to page.
 *
 *   <PageContainer>
 *     <PageHeader title="…" description="…" />
 *     <StatsGrid>…</StatsGrid>
 *     <TableSection>…</TableSection>
 *   </PageContainer>
 */

/** Outer wrapper: page padding + the vertical rhythm between page sections. */
export const PageContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    children,
    ...props
}) => (
    <div className={cn('p-6 space-y-5', className)} {...props}>
        {children}
    </div>
);

interface PageHeaderProps {
    title: React.ReactNode;
    description?: React.ReactNode;
    /** Right-aligned header content. Table actions belong in the table toolbar. */
    actions?: React.ReactNode;
    /** Route for the standard back link above the title, e.g. "/masters". */
    backTo?: string;
    /** Custom breadcrumb, for the rare case `backTo` is not enough. */
    breadcrumb?: React.ReactNode;
    className?: string;
}

/** Title + description block, with an optional right-hand action slot. */
export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    actions,
    backTo,
    breadcrumb,
    className,
}) => (
    <div className={cn('space-y-1', className)}>
        {backTo ? (
            <Link
                to={backTo}
                className="inline-flex items-center gap-1 text-brand-body-5 text-gray-500 transition-colors hover:text-gray-700"
            >
                <ChevronLeft className="h-4 w-4" />
                Back
            </Link>
        ) : null}
        {breadcrumb}
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
                <Heading level="h1">{title}</Heading>
                {description ? (
                    <Text size="sm" variant="muted" className="mt-1 block">
                        {description}
                    </Text>
                ) : null}
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
    </div>
);

/** Stat tile row: one column count and one gap for the whole app. */
export const StatsGrid: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    children,
    ...props
}) => (
    <div
        className={cn('grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-4', className)}
        {...props}
    >
        {children}
    </div>
);

/**
 * Wrapper for a table and its toolbar. Borderless by design — the table draws
 * its own rules, so a card around it only added a second frame.
 */
export const TableSection: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    children,
    ...props
}) => (
    <div className={cn('space-y-3', className)} {...props}>
        {children}
    </div>
);

export default PageContainer;
