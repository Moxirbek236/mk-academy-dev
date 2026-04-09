'use client';

import { useCallback } from 'react';
import { getFinanceSummary, getFinanceTransactions } from '@/lib/backend-api';
import { useApiRequest } from '@/hooks/useApiRequest';

export function useFinance(enabled = true) {
  const request = useCallback(async () => {
    const [summary, transactions] = await Promise.all([
      getFinanceSummary(),
      getFinanceTransactions(),
    ]);

    return {
      summary,
      transactions,
    };
  }, []);

  return useApiRequest({
    enabled,
    initialData: {
      summary: null as any,
      transactions: [] as any[],
    },
    request,
  });
}
