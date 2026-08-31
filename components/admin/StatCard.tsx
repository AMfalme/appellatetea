'use client';

import Link from 'next/link';
import type { ComponentType } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type StatAccent =
  | 'red'
  | 'blue'
  | 'violet'
  | 'amber'
  | 'emerald'
  | 'neutral';

interface StatCardProps {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  hint?: string;
  href?: string;
  accent?: StatAccent;
}

const ACCENTS: Record<
  StatAccent,
  { tile: string; bar: string; arrow: string }
> = {
  red: {
    tile: 'bg-[#8B1E1E]/10 text-[#8B1E1E]',
    bar: 'from-[#8B1E1E]/70 via-[#8B1E1E] to-[#B23A3A]',
    arrow: 'group-hover:text-[#8B1E1E]',
  },
  blue: {
    tile: 'bg-blue-50 text-blue-600',
    bar: 'from-blue-300 via-blue-500 to-blue-600',
    arrow: 'group-hover:text-blue-600',
  },
  violet: {
    tile: 'bg-violet-50 text-violet-600',
    bar: 'from-violet-300 via-violet-500 to-violet-600',
    arrow: 'group-hover:text-violet-600',
  },
  amber: {
    tile: 'bg-amber-50 text-amber-600',
    bar: 'from-amber-300 via-amber-500 to-amber-600',
    arrow: 'group-hover:text-amber-600',
  },
  emerald: {
    tile: 'bg-emerald-50 text-emerald-600',
    bar: 'from-emerald-300 via-emerald-500 to-emerald-600',
    arrow: 'group-hover:text-emerald-600',
  },
  neutral: {
    tile: 'bg-neutral-100 text-neutral-600',
    bar: 'from-neutral-300 via-neutral-400 to-neutral-500',
    arrow: 'group-hover:text-neutral-700',
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  href,
  accent = 'red',
}: StatCardProps) {
  const styles = ACCENTS[accent];

  const baseClass =
    'group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-200';
  const interactiveClass = href
    ? 'hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg'
    : '';

  const body = (
    <>
      {/* Accent bar */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 top-0 h-1 bg-gradient-to-r',
          styles.bar
        )}
      />

      {/* Header row */}
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
            styles.tile
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        {href ? (
          <ArrowUpRight
            className={cn(
              'h-5 w-5 text-neutral-300 transition-colors',
              styles.arrow
            )}
          />
        ) : null}
      </div>

      {/* Value */}
      <div className="mt-6">
        <p className="font-serif text-4xl font-bold leading-none tracking-tight text-neutral-900 tabular-nums">
          {value.toLocaleString()}
        </p>
        <p className="mt-3 text-sm font-semibold text-neutral-800">{label}</p>
        {hint ? (
          <p className="mt-1 text-xs leading-relaxed text-neutral-500">{hint}</p>
        ) : null}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(baseClass, interactiveClass)}>
        {body}
      </Link>
    );
  }

  return <div className={cn(baseClass, interactiveClass)}>{body}</div>;
}