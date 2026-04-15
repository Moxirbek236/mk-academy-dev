'use client';

import { useCallback } from 'react';
import { listTests, type TestListQuery } from '@/lib/backend-api';
import { useApiRequest } from '@/hooks/useApiRequest';

export function useTests(query: TestListQuery = {}, enabled = true) {
  const request = useCallback(() => listTests(query), [query]);

  return useApiRequest({
    enabled,
    initialData: { items: [], meta: null } as Awaited<ReturnType<typeof listTests>>,
    request,
  });
}
