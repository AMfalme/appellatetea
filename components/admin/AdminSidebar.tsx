'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ComponentType } from 'react';
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  Newspaper,
  Users,
  Mail,
  MessageSquare,
  LogOut,
  ExternalLink,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/components/providers/AuthProvider';
import { signOut } from '@/lib/firebase/auth';
import type { UserRole } from '@/lib/types/user';

interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** Only visible to users with the admin role. */
  adminOnly?: boolean;
  /** Match the current route exactly instead of by prefix. */
  exact?: boolean;
  /** Custom predicate used when the default prefix matching is not enough. */
  isActive?: (pathname: string) => boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        href: ROUTES.ADMIN,
        label: 'Dashboard',
        icon: LayoutDashboard,
        adminOnly: true,
        exact: true,
      },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        href: ROUTES.ADMIN_CASE_CREATE,
        label: 'New Article',
        icon: FilePlus,
      },
      {
        href: ROUTES.ADMIN_CASES,
        label: 'Articles',
        icon: FileText,
        isActive: (pathname) =>
          pathname.startsWith('/admin/cases') && pathname !== '/admin/cases/new',
      },
      {
        href: ROUTES.ADMIN_NEWSPAPER,
        label: 'Newspaper',
        icon: Newspaper,
      },
    ],
  },
  {
    label: 'People',
    items: [
      {
        href: ROUTES.ADMIN_USERS,
        label: 'Members & Roles',
        icon: Users,
        adminOnly: true,
      },
      {
        href: ROUTES.ADMIN_SUBSCRIBERS,
        label: 'Subscribers',
        icon: Mail,
        adminOnly: true,
      },
    ],
  },
  {
    label: 'Engagement',
    items: [
      {
        href: ROUTES.ADMIN_FEEDBACK,
        label: 'Feedback',
        icon: MessageSquare,
        adminOnly: true,
      },
    ],
  },
];

const ROLE_BADGES: Record<UserRole, string> = {
  admin: 'bg-[#8B1E1E]/10 text-[#8B1E1E]',
  editor: 'bg-blue-50 text-blue-700',
  viewer: 'bg-neutral-100 text-neutral-600',
};

function isActive(item: NavItem, pathname: string | null): boolean {
  if (!pathname) return false;
  if (item.isActive) return item.isActive(pathname);
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push(ROUTES.HOME);
  };

  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.adminOnly || user?.role === 'admin'),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      {/* Mobile backdrop */}
      {open ? (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <aside
        aria-label="Admin navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-200 bg-white',
          'transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-neutral-200 px-5 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#8B1E1E] font-serif text-base font-bold text-white">
            AT
          </div>
          <div className="min-w-0">
            <p className="truncate font-serif text-lg font-bold leading-tight text-neutral-900">
              Appellate Tea
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500">
              Admin Console
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                {group.label}
              </p>
              <ul className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item, pathname);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          active
                            ? 'bg-[#8B1E1E] text-white shadow-sm'
                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-[18px] w-[18px] shrink-0',
                            active
                              ? 'text-white'
                              : 'text-neutral-400 transition-colors group-hover:text-[#8B1E1E]'
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Account footer */}
        <div className="border-t border-neutral-200 p-3">
          {user ? (
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8B1E1E]/10 font-semibold text-[#8B1E1E]">
                {initials(user.displayName || user.email || 'A')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {user.displayName || user.email}
                </p>
                <span
                  className={cn(
                    'mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                    ROLE_BADGES[user.role] ?? ROLE_BADGES.viewer
                  )}
                >
                  {user.role}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <Link
                  href={ROUTES.HOME}
                  className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-[#8B1E1E]"
                  title="View public site"
                  aria-label="View public site"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-[#8B1E1E]"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <p className="px-2 py-2 text-xs text-neutral-400">Signed out</p>
          )}
        </div>
      </aside>
    </>
  );
}