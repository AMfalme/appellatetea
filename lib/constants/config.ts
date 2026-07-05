export const APP_CONFIG = {
  NAME: 'Appellate Tea',
  DESCRIPTION: 'A production-ready legal publication platform',
  URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_PDF_TYPES: ['application/pdf'],
} as const;