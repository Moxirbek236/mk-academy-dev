'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { localizePath } from '@/i18n/localizedPath';
import { getRoleHomePath } from '@/lib/role-access';
import { Loader2 } from 'lucide-react';

export default function HomeRouteGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const locale = useLocale();
  const { token, role, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      router.replace(localizePath(locale, getRoleHomePath(role)));
    }
  }, [loading, locale, role, router, token]);

  if (loading || token) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--app-bg)]">
        <Loader2 size={32} className="animate-spin text-[var(--app-primary)]" />
      </div>
    );
  }

  return <>{children}</>;
}
