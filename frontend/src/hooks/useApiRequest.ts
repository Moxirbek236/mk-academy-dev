'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AppApiError, getUserFriendlyErrorMessage } from '@/lib/offline/errors';

interface UseApiRequestOptions<T> {
  enabled?: boolean;
  debounceMs?: number;
  initialData: T;
  request: () => Promise<T>;
  requestKey?: readonly unknown[];
  requiresAuth?: boolean;
}

function normalizeRequestError(error: unknown) {
  if (error instanceof AppApiError) {
    return error.message;
  }

  return getUserFriendlyErrorMessage(error, "Server bilan ishlashda noma'lum xatolik yuz berdi");
}

function serializeRequestKey(requestKey: readonly unknown[]) {
  try {
    return JSON.stringify(requestKey);
  } catch {
    return requestKey.map((item) => String(item)).join('|');
  }
}

export function useApiRequest<T>({
  enabled = true,
  debounceMs = 0,
  initialData,
  request,
  requestKey = [],
  requiresAuth = true,
}: UseApiRequestOptions<T>) {
  const { token, loading: authLoading } = useAuth();
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const requestRef = useRef(request);
  const requestIdRef = useRef(0);
  const activeRequestRef = useRef<Promise<void> | null>(null);
  const queuedRequestRef = useRef(false);
  const canExecuteRef = useRef(false);

  const serializedRequestKey = useMemo(() => serializeRequestKey(requestKey), [requestKey]);
  const authReady = !requiresAuth || (!authLoading && Boolean(token));
  const shouldRequest = enabled && authReady;

  useEffect(() => {
    requestRef.current = request;
  }, [request]);

  useEffect(() => {
    canExecuteRef.current = shouldRequest;
  }, [shouldRequest]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    if (!canExecuteRef.current) {
      setLoading(false);
      return;
    }

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
          const response = await requestRef.current();
          if (mountedRef.current && requestIdRef.current === requestId) {
            setData(response);
          }
        } catch (requestError) {
          if (mountedRef.current && requestIdRef.current === requestId) {
            setError(normalizeRequestError(requestError));
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
    if (!shouldRequest) {
      setLoading(false);
      setError(null);
      return;
    }

    if (debounceMs > 0) {
      const timer = window.setTimeout(() => {
        void execute();
      }, debounceMs);

      return () => window.clearTimeout(timer);
    }

    void execute();
  }, [debounceMs, execute, serializedRequestKey, shouldRequest]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}
