export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

export function toDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  
  return null;
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isThisWeek(date: Date): boolean {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  
  return date >= startOfWeek && date <= endOfWeek;
}

export function isThisMonth(date: Date): boolean {
  const today = new Date();
  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isThisYear(date: Date): boolean {
  return date.getFullYear() === new Date().getFullYear();
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}