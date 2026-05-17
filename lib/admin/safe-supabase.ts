'use server';

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
