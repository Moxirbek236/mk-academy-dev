'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppApiError, getUserFriendlyErrorMessage } from '@/lib/offline/errors';

interface UseApiRequestOptions<T> {
  enabled?: boolean;
  debounceMs?: number;
  initialData: T;
  request: () => Promise<T>;
  requestKey?: string | number | boolean | null;
}

type CacheEntry<T> = {
  data: T;
  updatedAt: number;
};

const requestCache = new Map<string, CacheEntry<unknown>>();

function normalizeCacheKey(requestKey: UseApiRequestOptions<unknown>['requestKey']) {
  if (requestKey === null || requestKey === undefined || requestKey === false) {
    return null;
  }

  return String(requestKey);
}

function normalizeRequestError(error: unknown) {
  if (error instanceof AppApiError) {
    return error.message;
  }

  return getUserFriendlyErrorMessage(error, "Server bilan ishlashda noma'lum xatolik yuz berdi");
}

export function useApiRequest<T>({
  enabled = true,
  debounceMs = 0,
  initialData,
  request,
  requestKey = null,
}: UseApiRequestOptions<T>) {
  const cacheKey = normalizeCacheKey(requestKey);
  const cachedEntry = cacheKey ? (requestCache.get(cacheKey) as CacheEntry<T> | undefined) : undefined;
  const [data, setData] = useState<T>(cachedEntry?.data ?? initialData);
  const [loading, setLoading] = useState(enabled && !cachedEntry);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(request);

  requestRef.current = request;

  const execute = useCallback(async (options?: { background?: boolean }) => {
    const shouldKeepCurrentData = options?.background || Boolean(cacheKey && requestCache.has(cacheKey));

    if (!shouldKeepCurrentData) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await requestRef.current();
      setData(response);
      if (cacheKey) {
        requestCache.set(cacheKey, {
          data: response,
          updatedAt: Date.now(),
        });
      }
    } catch (requestError) {
      setError(normalizeRequestError(requestError));
    } finally {
      setLoading(false);
    }
  }, [cacheKey]);

  useEffect(() => {
    setData(cachedEntry?.data ?? initialData);
    setLoading(enabled && !cachedEntry);
    setError(null);
  }, [cacheKey, cachedEntry, enabled, initialData]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    if (debounceMs > 0) {
      const timer = window.setTimeout(() => {
        void execute({ background: Boolean(cachedEntry) });
      }, debounceMs);

      return () => window.clearTimeout(timer);
    }

    void execute({ background: Boolean(cachedEntry) });
  }, [cachedEntry, debounceMs, enabled, execute, requestKey]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}
