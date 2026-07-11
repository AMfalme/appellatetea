export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SEARCH: '/search',
  
  // Auth routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  
  // Public routes
  CASES: '/cases',
  CASE_DETAIL: (id: string) => `/cases/${id}`,
  AUTHORS: '/authors',
  AUTHOR_DETAIL: (id: string) => `/authors/${id}`,
  
  // Member and admin routes
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CASES: '/admin/cases',
  ADMIN_CASE_CREATE: '/admin/cases/new',
  ADMIN_CASE_EDIT: (id: string) => `/admin/cases/${id}`,
  ADMIN_AUTHORS: '/admin/authors',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_NEWSPAPER: '/admin/newspaper',
} as const;

export const CASE_STATUSES = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

export const COURTS = {
  FEDERAL: 'federal',
  STATE: 'state',
  TERRITORIAL: 'territorial',
} as const;

export const COURT_LEVELS = {
  TRIAL: 'trial',
  APPELLATE: 'appellate',
  SUPREME: 'supreme',
} as const;