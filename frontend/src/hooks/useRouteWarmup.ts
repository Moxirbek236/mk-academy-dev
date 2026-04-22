'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { localizePath } from '@/i18n/localizedPath';
import { getNavigationConfig } from '@/lib/navigation-config';
import { getRoleHomePath } from '@/lib/role-access';

type NavigatorWithConnection = Navigator & {
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
  };
};

type WindowWithIdleCallback = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function useRouteWarmup({
  enabled,
  locale,
  role,
}: {
  enabled: boolean;
  locale: string;
  role?: string | null;
}) {
  const router = useRouter();
  const warmedKeyRef = useRef('');

  const routes = useMemo(() => {
    if (!enabled) return [];

    const paths = new Set<string>();
    paths.add(getRoleHomePath(role));
    getNavigationConfig(role, 'sidebar').forEach((item) => paths.add(item.path));

    return Array.from(paths).map((path) => localizePath(locale, path));
  }, [enabled, locale, role]);

  useEffect(() => {
    if (!enabled || routes.length === 0 || typeof window === 'undefined') {
      return;
    }

    const network = (navigator as NavigatorWithConnection).connection;
    if (network?.saveData || network?.effectiveType === '2g') {
      return;
    }

    const cacheKey = `${locale}:${role || 'guest'}:${routes.join('|')}`;
    if (warmedKeyRef.current === cacheKey) {
      return;
    }
    warmedKeyRef.current = cacheKey;

    const win = window as WindowWithIdleCallback;
    let cancelled = false;
    let routeIndex = 0;
    let idleHandle: number | null = null;
    let timeoutHandle: number | null = null;

    const clearScheduled = () => {
      if (idleHandle !== null && win.cancelIdleCallback) {
        win.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== null) {
        window.clearTimeout(timeoutHandle);
      }
      idleHandle = null;
      timeoutHandle = null;
    };

    const scheduleNext = () => {
      if (cancelled || routeIndex >= routes.length) return;

      const warm = () => {
        if (cancelled) return;

        const href = routes[routeIndex];
        routeIndex += 1;
        router.prefetch(href);

        if (routeIndex < routes.length) {
          timeoutHandle = window.setTimeout(scheduleNext, 140);
        }
      };

      if (win.requestIdleCallback) {
        idleHandle = win.requestIdleCallback(warm, { timeout: 1600 });
      } else {
        timeoutHandle = window.setTimeout(warm, 320);
      }
    };

    scheduleNext();

    return () => {
      cancelled = true;
      clearScheduled();
    };
  }, [enabled, locale, role, router, routes]);
}
