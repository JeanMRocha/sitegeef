'use client';

import { useNotificationContext } from '@/components/providers/NotificationProvider';

export function useNotification() {
  const { show, success, error, warning, info, dismiss } = useNotificationContext();

  const validationErrors = (errors: Record<string, string[]>, duration = 10000) => {
    const summary = Object.entries(errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join(' • ');

    return error(summary || 'Verifique os campos informados.', duration);
  };

  const sessionWarning = (message = 'Sua sessão está prestes a expirar.') => {
    return warning(message, 8000);
  };

  return {
    show,
    success,
    error,
    warning,
    info,
    dismiss,
    validationErrors,
    sessionWarning,
  };
}
