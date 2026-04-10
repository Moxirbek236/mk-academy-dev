'use client';

import { useCallback } from 'react';
import { listTests } from '@/lib/backend-api';
import { useApiRequest } from '@/hooks/useApiRequest';

export function useTests(enabled = true) {
  const request = useCallback(() => listTests(), []);

  return useApiRequest({
    enabled,
    initialData: [] as any[],
    request,
  });
}
