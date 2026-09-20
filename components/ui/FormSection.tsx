import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import {
  ACCENT_BORDER_HOVER,
  ACCENT_HEADER,
  ACCENT_SUBTEXT,
  ACCENT_SURFACE,
  ACCENT_TITLE,
  SECTION_BODY,
  SECTION_HEADER,
  SECTION_SHELL,
  SECTION_SUBTEXT,
  SECTION_TITLE,
  type FormAccent,
} from './formTokens';

export interface FormSectionProps {
  title: string;
  description?: string;
  /** Step marker rendered before the title (e.g. "02"). */
  eyebrow?: string;
  accent?: FormAccent;
  /** Rendered in the header's top-right corner. */
  headerAccessory?: ReactNode;
  /** Shell element. Use `div` when nesting inside another form element. */
  as?: 'section' | 'div';
  /** Overrides the body padding/rhythm when a section needs custom layout. */
  bodyClassName?: string;
  className?: string;
  children: ReactNode;
}

/**
 * A logical form section: rounded card, tinted gradient surface and a crisp
 * header block carrying the section title and its supporting description.
 */
export function FormSection({
  title,
  description,
  eyebrow,
  accent = 'indigo',
  headerAccessory,
  as = 'section',
  bodyClassName,
  className,
  children,
}: FormSectionProps) {
  const Shell = as;

  return (
    <Shell
      className={cn(
        SECTION_SHELL,
        ACCENT_BORDER_HOVER[accent],
        'bg-gradient-to-b',
        ACCENT_SURFACE[accent],
        className
      )}
    >
      <div className={cn(SECTION_HEADER, ACCENT_HEADER[accent])}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className={cn(SECTION_TITLE, ACCENT_TITLE[accent])}>
              {eyebrow && (
                <span className="mr-2 text-xs font-semibold tabular-nums opacity-60">
                  {eyebrow}
                </span>
              )}
              {title}
            </h2>

            {description && (
              <p className={cn(SECTION_SUBTEXT, ACCENT_SUBTEXT[accent])}>{description}</p>
            )}
          </div>

          {headerAccessory && <div className="shrink-0">{headerAccessory}</div>}
        </div>
      </div>

      <div className={cn(SECTION_BODY, bodyClassName)}>{children}</div>
    </Shell>
  );
}
