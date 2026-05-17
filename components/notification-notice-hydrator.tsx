'use client';

import { useEffect } from 'react';
import { useNotification } from '@/lib/hooks/useNotification';

export function NotificationNoticeHydrator({
  notice,
  successMessage = 'Salvo.',
  errorMessage = 'Não foi possível salvar.',
}: {
  notice?: 'success' | 'error';
  successMessage?: string;
  errorMessage?: string;
}) {
  const { success, error } = useNotification();

  useEffect(() => {
    if (notice === 'success') {
      success(successMessage, 3500);
    }

    if (notice === 'error') {
      error(errorMessage, 5000);
    }
  }, [error, errorMessage, notice, success, successMessage]);

  return null;
}
