import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The app's loading indicators. Every page and section used to spin up its own
 * (h-8/h-6/h-10 spinners, hardcoded #C72030, and a few CSS border-spinners), so
 * the wait state looked different depending on where you were.
 *
 *   <PageLoader />                        full page / route
 *   <PageLoader message="Loading…" />     with a caption
 *   <SectionLoader />                     inside a card or panel
 *   <Spinner />                           inline, e.g. in a button
 */

interface LoaderProps {
    message?: string;
    className?: string;
}

/** Route-level loader: fills the viewport height. */
export const PageLoader: React.FC<LoaderProps> = ({ message, className }) => (
    <div className={cn('flex h-screen flex-col items-center justify-center gap-3', className)}>
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        {message ? <p className="text-brand-body-5 text-brand-text-light">{message}</p> : null}
    </div>
);

/** Section-level loader: centred in whatever block contains it. */
export const SectionLoader: React.FC<LoaderProps> = ({ message, className }) => (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12', className)}>
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        {message ? <p className="text-brand-body-5 text-brand-text-light">{message}</p> : null}
    </div>
);

/** Inline spinner, sized to sit next to text. */
export const Spinner: React.FC<{ className?: string }> = ({ className }) => (
    <Loader2 className={cn('h-4 w-4 animate-spin', className)} />
);

export default PageLoader;
