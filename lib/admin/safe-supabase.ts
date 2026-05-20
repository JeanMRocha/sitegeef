export type SafeResult<T> = {
  data: T;
  error: unknown | null;
};

export function isExpectedSupabaseError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const record = error as Record<string, unknown>;
  return Boolean(record.code || record.message || record.details || record.hint);
}

export function safeFallback<T>(fallback: T) {
  return {
    data: fallback,
    error: null,
  } as SafeResult<T>;
}

export async function withTimeout<T>(promise: PromiseLike<T>, timeoutMs: number, fallback: T): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timeoutHandle = setTimeout(() => resolve(fallback), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
}

export function swallowExpectedError<T>(error: unknown, fallback: T): SafeResult<T> {
  if (isExpectedSupabaseError(error)) {
    return safeFallback(fallback);
  }

  return {
    data: fallback,
    error,
  };
}

export function toEmptyList<T = never>(): T[] {
  return [];
}
