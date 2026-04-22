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
  softTimeoutMs?: number;
}

type SharedRequestCacheEntry = {
  expiresAt: number;
  value?: unknown;
  error?: unknown;
};

const REQUEST_SOFT_TIMEOUT_MS = 5500;
const RECENT_REQUEST_TTL_MS = 1200;
const RECENT_ERROR_TTL_MS = 250;
const inFlightRequests = new Map<string, Promise<unknown>>();
const recentRequests = new Map<string, SharedRequestCacheEntry>();

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

async function runSharedRequest<T>(
  key: string,
  request: () => Promise<T>,
  force = false,
): Promise<T> {
  const now = Date.now();
  const recent = recentRequests.get(key);

  if (!force && recent && recent.expiresAt > now) {
    if ('error' in recent) {
      throw recent.error;
    }

    return recent.value as T;
  }

  const existing = inFlightRequests.get(key) as Promise<T> | undefined;
  if (existing) {
    return existing;
  }

  const promise = request()
    .then((response) => {
      recentRequests.set(key, {
        value: response,
        expiresAt: Date.now() + RECENT_REQUEST_TTL_MS,
      });
      return response;
    })
    .catch((error) => {
      recentRequests.set(key, {
        error,
        expiresAt: Date.now() + RECENT_ERROR_TTL_MS,
      });
      throw error;
    })
    .finally(() => {
      inFlightRequests.delete(key);
    });

  inFlightRequests.set(key, promise);
  return promise;
}

export function useApiRequest<T>({
  enabled = true,
  debounceMs = 0,
  initialData,
  request,
  requestKey = [],
  requiresAuth = true,
  softTimeoutMs = REQUEST_SOFT_TIMEOUT_MS,
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
  const queuedForceRef = useRef(false);
  const canExecuteRef = useRef(false);
  const sharedRequestKeyRef = useRef('');

  const serializedRequestKey = useMemo(() => serializeRequestKey(requestKey), [requestKey]);
  const authReady = !requiresAuth || (!authLoading && Boolean(token));
  const shouldRequest = enabled && authReady;
  const authScope = requiresAuth ? `auth:${token?.slice(-12) || 'pending'}` : 'public';
  const sharedRequestKey = `${authScope}:${serializedRequestKey}`;

  useEffect(() => {
    requestRef.current = request;
  }, [request]);

  useEffect(() => {
    canExecuteRef.current = shouldRequest;
  }, [shouldRequest]);

  useEffect(() => {
    sharedRequestKeyRef.current = sharedRequestKey;
  }, [sharedRequestKey]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (options?: { force?: boolean }) => {
    if (!canExecuteRef.current) {
      setLoading(false);
      return;
    }

    if (activeRequestRef.current) {
      queuedRequestRef.current = true;
      queuedForceRef.current = queuedForceRef.current || Boolean(options?.force);
      return activeRequestRef.current;
    }

    let forceNextRun = Boolean(options?.force);

    const runRequestQueue = async () => {
      do {
        const shouldForce = forceNextRun || queuedForceRef.current;
        forceNextRun = false;
        queuedRequestRef.current = false;
        queuedForceRef.current = false;

        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;
        setLoading(true);
        setError(null);

        const softTimeout = window.setTimeout(() => {
          if (mountedRef.current && requestIdRef.current === requestId) {
            setLoading(false);
            setError(
              'Maʼlumotlarni yuklab boʼlmadi. Qayta yuklash uchun "Qayta yuklash" tugmasini bosing.',
            );
          }
        }, softTimeoutMs);

        try {
          const response = await runSharedRequest<T>(
            sharedRequestKeyRef.current,
            requestRef.current,
            shouldForce,
          );
          if (mountedRef.current && requestIdRef.current === requestId) {
            setData(response);
            setError(null);
          }
        } catch (requestError) {
          if (mountedRef.current && requestIdRef.current === requestId) {
            setError(normalizeRequestError(requestError));
          }
        } finally {
          window.clearTimeout(softTimeout);
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
    refetch: () => execute({ force: true }),
  };
}
