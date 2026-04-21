'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AxiosRequestConfig } from 'axios';
import { offlineGet, type AppApiError } from '@/lib/offline/request';
import { normalizeApiError } from '@/lib/offline/errors';
import { useRefetchOnReconnect } from '@/hooks/useRefetchOnReconnect';

interface UseOfflineQueryOptions<T> {
  url: string;
  config?: AxiosRequestConfig;
  enabled?: boolean;
  initialData?: T;
}

interface UseOfflineQueryResult<T> {
  data: T | undefined;
  loading: boolean;
  error: AppApiError | null;
  fromCache: boolean;
  cachedAt?: string;
  isEmpty: boolean;
  refetch: () => Promise<void>;
}

function isEmptyData(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function serializeRequestKey(url: string, config?: AxiosRequestConfig) {
  try {
    return JSON.stringify([url, config]);
  } catch {
    return url;
  }
}

export function useOfflineQuery<T>(options: UseOfflineQueryOptions<T>): UseOfflineQueryResult<T> {
  const { url, config, enabled = true, initialData } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<AppApiError | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [cachedAt, setCachedAt] = useState<string | undefined>(undefined);
  const mountedRef = useRef(false);
  const requestIdRef = useRef(0);
  const activeRequestRef = useRef<Promise<void> | null>(null);
  const queuedRequestRef = useRef(false);
  const urlRef = useRef(url);
  const configRef = useRef(config);
  const enabledRef = useRef(enabled);
  const requestKey = useMemo(() => serializeRequestKey(url, config), [config, url]);

  useEffect(() => {
    urlRef.current = url;
    configRef.current = config;
    enabledRef.current = enabled;
  }, [config, enabled, url]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refetch = useCallback(async () => {
    if (!enabledRef.current) return;

    if (activeRequestRef.current) {
      queuedRequestRef.current = true;
      return activeRequestRef.current;
    }

    const runRequestQueue = async () => {
      do {
        queuedRequestRef.current = false;

        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;
        setLoading(true);
        setError(null);

        try {
          const result = await offlineGet<T>(urlRef.current, configRef.current);
          if (mountedRef.current && requestIdRef.current === requestId) {
            setData(result.data);
            setFromCache(result.fromCache);
            setCachedAt(result.cachedAt);
          }
        } catch (fetchError) {
          if (mountedRef.current && requestIdRef.current === requestId) {
            setError(normalizeApiError(fetchError));
          }
        } finally {
          if (mountedRef.current && requestIdRef.current === requestId && !queuedRequestRef.current) {
            setLoading(false);
          }
        }
      } while (mountedRef.current && queuedRequestRef.current);

      activeRequestRef.current = null;
    };

    activeRequestRef.current = runRequestQueue();
    return activeRequestRef.current;
  }, []);

  useEffect(() => {
    void refetch();
  }, [enabled, refetch, requestKey]);

  useRefetchOnReconnect(refetch);

  const isEmpty = useMemo(() => !loading && !error && isEmptyData(data), [data, error, loading]);

  return {
    data,
    loading,
    error,
    fromCache,
    cachedAt,
    isEmpty,
    refetch,
  };
}
