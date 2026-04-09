'use client';

import { useCallback } from 'react';
import { fetchCurrentUserProfile } from '@/lib/api-compat';
import { useApiRequest } from '@/hooks/useApiRequest';

export function useProfile(enabled = true) {
  const request = useCallback(() => fetchCurrentUserProfile(), []);

  return useApiRequest({
    enabled,
    initialData: null,
    request,
  });
}
