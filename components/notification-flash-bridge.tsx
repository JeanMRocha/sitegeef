'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { readFlashNotice } from '@/lib/notificacoes/flash-notice';
import { useNotification } from '@/lib/hooks/useNotification';

export function NotificationFlashBridge() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { success, error, warning, info } = useNotification();
  const handledSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    const notice = readFlashNotice(searchParams);

    if (!notice) {
      handledSignatureRef.current = null;
      return;
    }

    const signature = `${pathname}?${searchParams.toString()}`;
    if (handledSignatureRef.current === signature) {
      return;
    }

    handledSignatureRef.current = signature;

    const duration =
      typeof notice.duration === 'number'
        ? notice.duration
        : notice.variant === 'warning'
          ? 8000
          : 5000;

    const message = notice.title ? `${notice.title} — ${notice.message}` : notice.message;

    if (notice.variant === 'success') {
      success(message, duration);
    } else if (notice.variant === 'error') {
      error(message, duration);
    } else if (notice.variant === 'warning') {
      warning(message, duration);
    } else {
      info(message, duration);
    }

    const cleanParams = new URLSearchParams(searchParams.toString());
    cleanParams.delete('notice');
    cleanParams.delete('notice_message');
    cleanParams.delete('notice_title');
    cleanParams.delete('notice_duration');

    const query = cleanParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [error, info, pathname, router, searchParams, success, warning]);

  return null;
}
