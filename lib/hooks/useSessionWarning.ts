'use client';

import { useEffect, useRef } from 'react';
import { useNotification } from './useNotification';

export function useSessionWarning(message = 'Sua sessão está prestes a expirar.', expiresIn = 300000) {
  const { warning } = useNotification();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const warningTime = Math.max(expiresIn - 60000, 0);

    timeoutRef.current = window.setTimeout(() => {
      warning(message, 8000);
    }, warningTime);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [expiresIn, message, warning]);
}
