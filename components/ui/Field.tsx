import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { ACCENT_HINT, ACCENT_LABEL, type FormAccent } from './formTokens';

export interface FieldProps {
  /** Micro-typography label. Omit for unlabelled controls. */
  label?: string;
  /** Optional node pinned to the right of the label row (counters, hints). */
  labelAccessory?: ReactNode;
  /** Small helper text rendered beneath the control. */
  hint?: ReactNode;
  /** Validation message. Replaces the hint when present. */
  error?: string;
  accent?: FormAccent;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Wraps a control with its label and helper text.
 *
 * The `group` class is what drives the label's `group-focus-within` highlight,
 * so every field block must be wrapped in exactly one `Field`.
 */
export function Field({
  label,
  labelAccessory,
  hint,
  error,
  accent = 'indigo',
  htmlFor,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn('group', className)}>
      {label && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <label
            htmlFor={htmlFor}
            className={cn(
              'block text-[11px] font-bold uppercase tracking-wider transition-colors',
              ACCENT_LABEL[accent]
            )}
          >
            {label}
          </label>

          {labelAccessory && (
            <span className="text-[11px] font-medium text-slate-400">{labelAccessory}</span>
          )}
        </div>
      )}

      {children}

      {error ? (
        <p className="mt-1.5 text-xs font-semibold text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className={cn('mt-1.5 text-xs font-normal', ACCENT_HINT[accent])}>{hint}</p>
      ) : null}
    </div>
  );
}

/** Vertical rhythm for a stack of fields. */
export const FIELD_STACK = 'space-y-6';
