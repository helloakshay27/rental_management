import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Content panel primitives — for the side-by-side "list of rows" cards that sit
 * next to tables (top performers, performance metrics, quick actions…).
 *
 * These had each grown their own row treatment: some rows outlined, some filled
 * with a tint, values at different sizes. `Panel` + `PanelRow` give them one
 * shell and one row style.
 */

interface PanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    title: React.ReactNode;
    description?: React.ReactNode;
    /** Right-aligned header content, e.g. a "view all" link. */
    action?: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({
    title,
    description,
    action,
    className,
    children,
    ...props
}) => (
    <Card className={cn('bg-white shadow-none hover:shadow-none', className)} {...props}>
        <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-0.5">
                    {/*
                     * CardTitle is an <h3>, so it inherits the 20px global heading size
                     * plus `leading-none tracking-tight` — which read as cramped next to
                     * a 14px description. Both are pinned here instead.
                     */}
                    <CardTitle className="text-brand-body-3 leading-snug tracking-normal">
                        {title}
                    </CardTitle>
                    {description ? (
                        <CardDescription className="text-brand-body-5 leading-snug">
                            {description}
                        </CardDescription>
                    ) : null}
                </div>
                {action}
            </div>
        </CardHeader>
        <CardContent className="pt-0">
            <div className="space-y-2">{children}</div>
        </CardContent>
    </Card>
);

interface PanelRowProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Optional leading element — an avatar, rank badge or icon. */
    leading?: React.ReactNode;
    label: React.ReactNode;
    /** Small line under the label. */
    hint?: React.ReactNode;
    value: React.ReactNode;
}

/** One label/value row. Same height, padding and border on every panel. */
export const PanelRow: React.FC<PanelRowProps> = ({
    leading,
    label,
    hint,
    value,
    className,
    ...props
}) => (
    <div
        className={cn(
            'flex items-center justify-between gap-3 rounded-md border border-brand-border px-3 py-2.5',
            className
        )}
        {...props}
    >
        <div className="flex min-w-0 items-center gap-3">
            {leading}
            <div className="min-w-0">
                <div className="truncate text-brand-body-4 font-medium text-brand-text">{label}</div>
                {hint ? <div className="text-brand-caption text-brand-text-light">{hint}</div> : null}
            </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-brand-body-3 font-semibold text-brand-text">
            {value}
        </div>
    </div>
);

/**
 * Status marker for panel rows: a small dot plus caption text, no filled pill.
 * A tinted pill (the shared `Badge`) competes with the row's value for weight —
 * status here is secondary information, so it stays quiet while keeping its
 * semantic colour.
 */
export const PanelBadge: React.FC<{ tone?: string; className?: string; children: React.ReactNode }> = ({
    tone = 'text-brand-text-light',
    className,
    children,
}) => (
    <span
        className={cn('inline-flex items-center gap-1.5 text-brand-caption font-normal', tone, className)}
    >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
        {children}
    </span>
);

/** Numbered rank chip used by "top N" panels. */
export const PanelRank: React.FC<{ index: number }> = ({ index }) => (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-brand-body-5 font-bold text-white">
        {index + 1}
    </span>
);

export default Panel;
