import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { Field, type FieldProps } from './Field';
import { ACCENT_CONTROL, CONTROL_BASE, CONTROL_ERROR, type FormAccent } from './formTokens';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  accent?: FormAccent;
  hint?: FieldProps['hint'];
  labelAccessory?: FieldProps['labelAccessory'];
}

/**
 * Native select with the design-system control surface.
 *
 * `appearance-none` removes the platform arrow, so a decorative chevron is
 * positioned over the control and made pointer-transparent.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, helperText, accent = 'indigo', hint, labelAccessory, id, children, ...props },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s/g, '-');

    const control = (
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          className={cn(
            CONTROL_BASE,
            'h-11 appearance-none px-4 pr-10 font-medium text-slate-800',
            ACCENT_CONTROL[accent],
            error && CONTROL_ERROR,
            className
          )}
          {...props}
        >
          {children}
        </select>

        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );

    if (!label && !error && !helperText) return control;

    return (
      <Field
        label={label}
        labelAccessory={labelAccessory}
        hint={hint ?? helperText}
        error={error}
        accent={accent}
        htmlFor={selectId}
      >
        {control}
      </Field>
    );
  }
);

Select.displayName = 'Select';

export { Select };
