import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { ACTION_GROUP, ACTION_ROW } from './formTokens';

export interface FormActionsProps {
  /** Left cluster: destructive and secondary actions. */
  children?: ReactNode;
  /** Right cluster: the primary action. */
  primary?: ReactNode;
  className?: string;
}

/**
 * Bottom action toolbar for a form.
 *
 * Destructive actions sit on the far left and the primary action on the far
 * right, separated from the last field by a hairline rule.
 */
export function FormActions({ children, primary, className }: FormActionsProps) {
  return (
    <div className={cn(ACTION_ROW, className)}>
      {children ? <div className={ACTION_GROUP}>{children}</div> : <span aria-hidden />}

      {primary && <div className={ACTION_GROUP}>{primary}</div>}
    </div>
  );
}
