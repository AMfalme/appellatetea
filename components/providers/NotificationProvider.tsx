'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationState {
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notification: NotificationState | null;
  showNotification: (message: string, type?: NotificationType) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notification: null,
  showNotification: () => undefined,
  hideNotification: () => undefined,
});

function NotificationToast() {
  const { notification, hideNotification } = useNotification();

  useEffect(() => {
    if (!notification) return;

    const timer = window.setTimeout(() => {
      hideNotification();
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [hideNotification, notification]);

  if (!notification) return null;

  const tone = notification.type === 'error'
    ? 'border-[#8B1E1E] bg-[#FFF5F5] text-[#8B1E1E]'
    : notification.type === 'info'
      ? 'border-neutral-300 bg-white text-neutral-800'
      : 'border-emerald-700 bg-emerald-50 text-emerald-800';

  return (
    <div className="fixed right-4 top-4 z-[100] max-w-sm rounded border px-4 py-3 shadow-lg backdrop-blur ${tone}">
      <div className="flex items-start gap-3">
        <p className="text-sm font-medium">{notification.message}</p>
        <button
          type="button"
          onClick={hideNotification}
          className="ml-auto text-current opacity-70 transition-opacity hover:opacity-100"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const value = useMemo(
    () => ({ notification, showNotification, hideNotification }),
    [notification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationToast />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
