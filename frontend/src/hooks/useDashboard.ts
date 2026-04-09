'use client';

import { useCallback } from 'react';
import api from '@/lib/api';
import { useApiRequest } from '@/hooks/useApiRequest';

export function useDashboard(enabled = true) {
  const request = useCallback(async () => {
    const response = await api.get('/dashboard/stats');
    return response.data?.data ?? response.data ?? null;
  }, []);

  return useApiRequest({
    enabled,
    initialData: null,
    request,
  });
}
