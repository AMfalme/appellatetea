'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Renders children only on public routes.
 *
 * The admin area renders its own full-height shell (sidebar + top bar), so the
 * public site header and footer are hidden once the user navigates into /admin/*.
 */
export function PublicOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return <>{children}</>;
}