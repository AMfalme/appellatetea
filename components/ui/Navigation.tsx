'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/constants/routes';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  
  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-blue-600',
        isActive ? 'text-blue-600' : 'text-gray-700',
        className
      )}
    >
      {children}
    </Link>
  );
}

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  return (
    <nav className={cn('flex items-center space-x-6', className)}>
      <NavLink href={ROUTES.CASES}>Cases</NavLink>
      <NavLink href={ROUTES.AUTHORS}>Authors</NavLink>
      <NavLink href={ROUTES.ABOUT}>About</NavLink>
      <NavLink href={ROUTES.SEARCH}>Search</NavLink>
    </nav>
  );
}

export function AdminNavLink({ className }: { className?: string }) {
  return (
    <Link href={ROUTES.ADMIN} className={cn('text-sm font-medium text-[#8B1E1E] hover:text-[#8B1E1E]/80', className)}>
      Admin
    </Link>
  );
}
