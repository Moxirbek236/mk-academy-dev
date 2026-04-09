'use client';

import { useCallback } from 'react';
import { fetchUsersCompat } from '@/lib/api-compat';
import { useApiRequest } from '@/hooks/useApiRequest';

export function useUsers(role: string | null, searchTerm: string, enabled = true) {
  const request = useCallback(() => fetchUsersCompat(role, searchTerm), [role, searchTerm]);

  return useApiRequest({
    enabled,
    debounceMs: 350,
    initialData: [] as any[],
    request,
  });
}
