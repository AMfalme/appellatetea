import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { Field, type FieldProps } from './Field';
import { ACCENT_CONTROL, CONTROL_BASE, CONTROL_ERROR, type FormAccent } from './formTokens';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  accent?: FormAccent;
  hint?: FieldProps['hint'];
  labelAccessory?: FieldProps['labelAccessory'];
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, accent = 'indigo', hint, labelAccessory, id, rows = 4, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s/g, '-');

    const control = (
      <textarea
        id={textareaId}
        ref={ref}
        rows={rows}
        className={cn(
          CONTROL_BASE,
          'resize-y px-4 py-3 font-normal leading-relaxed text-slate-800',
          ACCENT_CONTROL[accent],
          error && CONTROL_ERROR,
          className
        )}
        {...props}
      />
    );

    if (!label && !error && !helperText) return control;

    return (
      <Field
        label={label}
        labelAccessory={labelAccessory}
        hint={hint ?? helperText}
        error={error}
        accent={accent}
        htmlFor={textareaId}
      >
        {control}
      </Field>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
