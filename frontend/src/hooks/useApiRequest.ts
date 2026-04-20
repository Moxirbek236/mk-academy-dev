'use client';

import { useCallback, useEffect, useState } from 'react';
import { AppApiError, getUserFriendlyErrorMessage } from '@/lib/offline/errors';

interface UseApiRequestOptions<T> {
  enabled?: boolean;
  debounceMs?: number;
  initialData: T;
  request: () => Promise<T>;
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
}: UseApiRequestOptions<T>) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await request();
      setData(response);
    } catch (requestError) {
      setError(normalizeRequestError(requestError));
    } finally {
      setLoading(false);
    }
  }, [request]);

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
  }, [debounceMs, enabled, execute]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}
