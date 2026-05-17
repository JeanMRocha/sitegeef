export type FlashNoticeVariant = 'success' | 'error' | 'warning' | 'info';

export type FlashNoticeInput = {
  variant: FlashNoticeVariant;
  message: string;
  title?: string;
  duration?: number | null;
};

type QueryParamsLike = {
  get(name: string): string | null;
};

function splitUrl(pathname: string) {
  const [path, rawQuery = ''] = pathname.split('?');
  return {
    path: path || '/',
    params: new URLSearchParams(rawQuery),
  };
}

export function buildFlashNoticeUrl(pathname: string, notice?: FlashNoticeInput | null) {
  const { path, params } = splitUrl(pathname);

  if (notice) {
    params.set('notice', notice.variant);
    params.set('notice_message', notice.message);

    if (notice.title) {
      params.set('notice_title', notice.title);
    }

    if (typeof notice.duration === 'number') {
      params.set('notice_duration', String(notice.duration));
    }
  }

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export function readFlashNotice(searchParams: QueryParamsLike): FlashNoticeInput | null {
  const rawVariant = searchParams.get('notice');
  const message = searchParams.get('notice_message');

  if (!rawVariant || !message) {
    return null;
  }

  if (!['success', 'error', 'warning', 'info'].includes(rawVariant)) {
    return null;
  }

  const title = searchParams.get('notice_title') || undefined;
  const rawDuration = searchParams.get('notice_duration');
  const parsedDuration = rawDuration ? Number(rawDuration) : undefined;

  return {
    variant: rawVariant as FlashNoticeVariant,
    message,
    title,
    duration: Number.isFinite(parsedDuration) ? parsedDuration : undefined,
  };
}
