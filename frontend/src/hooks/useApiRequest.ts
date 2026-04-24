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
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(request);

  requestRef.current = request;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await requestRef.current();
      setData(response);
    } catch (requestError) {
      setError(normalizeRequestError(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    if (debounceMs > 0) {
      const timer = window.setTimeout(() => {
        void execute();
      }, debounceMs);

      return () => window.clearTimeout(timer);
    }

    void execute();
  }, [debounceMs, enabled, execute, requestKey]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}
