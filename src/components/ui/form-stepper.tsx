import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Horizontal step chips for long Add/Edit forms.
 *
 * Ported from fm-matrix-revamp's `AddAMCPage` stepper (`/maintenance/amc/add`),
 * keeping its exact geometry: each chip is a 187×40 inner box sitting inside a
 * 213×50 white shadowed box, joined by 60px dashed connectors that shrink on
 * narrower screens.
 *
 * Steps ahead of the current one stay locked until the previous step has been
 * completed, which is what the reference does too.
 *
 *   <FormStepper
 *     steps={['AMC Configuration', 'AMC Details']}
 *     current={step}
 *     completed={completedSteps}
 *     onStepChange={setStep}
 *   />
 */

interface FormStepperProps {
    steps: string[];
    /** Zero-based index of the active step. */
    current: number;
    /** Indices the user has already completed — these stay unlocked. */
    completed?: number[];
    onStepChange?: (index: number) => void;
    className?: string;
}

export const FormStepper: React.FC<FormStepperProps> = ({
    steps,
    current,
    completed = [],
    onStepChange,
    className,
}) => (
    <div className={cn('flex w-full items-center justify-center overflow-x-auto pb-1', className)}>
        {steps.map((label, index) => {
            const isActive = index === current;
            const isDone = completed.includes(index);
            const isLocked = index > current && !completed.includes(index - 1);

            return (
                <React.Fragment key={label}>
                    {/* outer shadowed frame */}
                    <div className="flex h-[50px] w-[213px] shrink-0 items-center justify-center rounded p-[5px] shadow-[0px_4px_14.2px_0px_rgba(0,0,0,0.1)] bg-white">
                        <button
                            type="button"
                            disabled={isLocked}
                            onClick={() => !isLocked && onStepChange?.(index)}
                            aria-current={isActive ? 'step' : undefined}
                            className={cn(
                                'relative flex h-10 w-[187px] items-center justify-center rounded px-5 text-[13px] font-medium transition-all duration-200',
                                isActive || isDone
                                    ? 'border-2 border-brand bg-brand text-white'
                                    : isLocked
                                        ? 'cursor-not-allowed border border-[rgba(200,200,200,1)] bg-[rgba(245,245,245,1)] text-[rgba(150,150,150,1)]'
                                        : 'border border-[rgba(196,184,157,1)] bg-white text-[rgba(196,184,157,1)] hover:opacity-90',
                                isActive && 'shadow-[0_2px_4px_rgba(218,119,86,0.3)]'
                            )}
                        >
                            {label}
                            {isDone && !isActive && (
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold">
                                    ✓
                                </span>
                            )}
                        </button>
                    </div>

                    {index < steps.length - 1 && (
                        <span
                            aria-hidden="true"
                            className="h-0 w-[60px] shrink-0 border-t border-dashed border-[rgba(196,184,157,1)] max-[1200px]:w-10 max-[900px]:w-[30px] max-[600px]:w-5"
                        />
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

export default FormStepper;
