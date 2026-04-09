'use client';

import { useCallback } from 'react';
import { listLeads } from '@/lib/backend-api';
import { useApiRequest } from '@/hooks/useApiRequest';

export function useLeads(enabled = true) {
  const request = useCallback(() => listLeads(), []);

  return useApiRequest({
    enabled,
    initialData: [] as any[],
    request,
  });
}
