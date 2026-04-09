'use client';

import { useCallback } from 'react';
import { getStudentTestAttempts } from '@/lib/backend-api';
import { useApiRequest } from '@/hooks/useApiRequest';

export function useTestAttempts(studentId: number | null, enabled = true) {
  const request = useCallback(() => getStudentTestAttempts(Number(studentId)), [studentId]);

  return useApiRequest({
    enabled: enabled && Boolean(studentId),
    initialData: [] as any[],
    request,
  });
}
