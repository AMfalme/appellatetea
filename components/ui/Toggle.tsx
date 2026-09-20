import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { ACCENT_BORDER_HOVER, ACCENT_SURFACE, type FormAccent } from './formTokens';

export interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  accent?: FormAccent;
  disabled?: boolean;
  className?: string;
  /** Name is required for native form submission; omit to keep it client-only. */
  name?: string;
}

/**
 * Pill toggle switch backed by a real checkbox.
 *
 * The input keeps native semantics (`peer` + `sr-only`) while the track and
 * sliding indicator provide the visual affordance.
 */
export function Toggle({
  id,
  checked,
  onChange,
  label,
  description,
  accent = 'emerald',
  disabled,
  className,
  name,
}: ToggleProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-gradient-to-r p-5 shadow-sm transition-all duration-300 hover:shadow-md sm:p-6',
        ACCENT_BORDER_HOVER[accent],
        ACCENT_SURFACE[accent],
        disabled && 'opacity-60',
        className
      )}
    >
      <div className="min-w-0">
        <label
          htmlFor={id}
          className="cursor-pointer text-sm font-bold text-slate-900"
        >
          {label}
        </label>

        {description && (
          <p className="mt-0.5 text-xs font-medium text-slate-500">{description}</p>
        )}
      </div>

      <label className="relative inline-flex shrink-0 cursor-pointer items-center">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />

        <span
          aria-hidden
          className={cn(
            'relative h-6 w-11 rounded-full bg-slate-200 transition-colors duration-200 ease-in-out',
            'after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full',
            'after:bg-white after:shadow-sm after:transition-transform after:duration-200',
            'peer-checked:after:translate-x-full',
            accent === 'emerald' && 'peer-checked:bg-emerald-600 peer-focus:ring-4 peer-focus:ring-emerald-500/10',
            accent === 'indigo' && 'peer-checked:bg-indigo-600 peer-focus:ring-4 peer-focus:ring-indigo-500/10',
            accent === 'sky' && 'peer-checked:bg-sky-600 peer-focus:ring-4 peer-focus:ring-sky-500/10',
            accent === 'amber' && 'peer-checked:bg-amber-600 peer-focus:ring-4 peer-focus:ring-amber-500/10'
          )}
        />
      </label>
    </div>
  );
}
