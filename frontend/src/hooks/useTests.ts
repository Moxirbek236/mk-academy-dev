'use client';

import { useCallback } from 'react';
import { listTests, type TestListQuery } from '@/lib/backend-api';
import { useApiRequest } from '@/hooks/useApiRequest';

export function useTests(query: TestListQuery = {}, enabled = true) {
  const request = useCallback(
    () =>
      listTests({
        page: query.page,
        limit: query.limit,
        search: query.search,
        courseId: query.courseId,
        cefrLevel: query.cefrLevel,
        type: query.type,
        isPublished: query.isPublished,
        isActive: query.isActive,
      }),
    [
      query.cefrLevel,
      query.courseId,
      query.isActive,
      query.isPublished,
      query.limit,
      query.page,
      query.search,
      query.type,
    ],
  );

  return useApiRequest({
    enabled,
    initialData: { items: [], meta: null } as Awaited<ReturnType<typeof listTests>>,
    request,
    requestKey: [
      query.page,
      query.limit,
      query.search,
      query.courseId,
      query.cefrLevel,
      query.type,
      query.isPublished,
      query.isActive,
    ],
  });
}
