'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type NotificationVariant = 'success' | 'error' | 'warning' | 'info';

export type NotificationItem = {
  id: string;
  variant: NotificationVariant;
  message: string;
  duration: number | null;
};

type NotificationContextValue = {
  show: (variant: NotificationVariant, message: string, duration?: number | null) => string;
  success: (message: string, duration?: number | null) => string;
  error: (message: string, duration?: number | null) => string;
  warning: (message: string, duration?: number | null) => string;
  info: (message: string, duration?: number | null) => string;
  dismiss: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<NotificationItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const show = useCallback((variant: NotificationVariant, message: string, duration: number | null = 5000) => {
    const id = createId();
    const item: NotificationItem = { id, variant, message, duration };

    setItems((current) => [...current, item]);

    if (duration && duration > 0) {
      window.setTimeout(() => {
        setItems((current) => current.filter((entry) => entry.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const value = useMemo<NotificationContextValue>(
    () => ({
      show,
      success: (message, duration = 5000) => show('success', message, duration),
      error: (message, duration = 5000) => show('error', message, duration),
      warning: (message, duration = 8000) => show('warning', message, duration),
      info: (message, duration = 5000) => show('info', message, duration),
      dismiss,
    }),
    [dismiss, show]
  );

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ variant: NotificationVariant; message: string; duration?: number | null }>;
      const detail = custom.detail;
      if (!detail) {
        return;
      }

      show(detail.variant, detail.message, detail.duration ?? 5000);
    };

    window.addEventListener('geef-notification', handler);
    return () => window.removeEventListener('geef-notification', handler);
  }, [show]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="notification-stack" aria-live="polite" aria-atomic="true">
        {items.map((item) => (
          <div key={item.id} className={`notification-toast ${item.variant}`}>
            <span className="notification-dot" aria-hidden="true" />
            <p>{item.message}</p>
            <button type="button" className="notification-close" onClick={() => dismiss(item.id)} aria-label="Fechar aviso">
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }

  return context;
}
