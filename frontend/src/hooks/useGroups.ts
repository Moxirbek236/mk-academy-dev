'use client';

import { useCallback } from 'react';
import api from '@/lib/api';
import { useApiRequest } from '@/hooks/useApiRequest';

export function useGroups(searchTerm: string, enabled = true) {
  const request = useCallback(async () => {
    const trimmedSearch = searchTerm.trim();
    const response = await api.get('/groups', {
      params: trimmedSearch ? { name: trimmedSearch } : undefined,
    });

    return response.data?.data ?? response.data ?? [];
  }, [searchTerm]);

  return useApiRequest({
    enabled,
    debounceMs: 350,
    initialData: [] as any[],
    request,
  });
}
