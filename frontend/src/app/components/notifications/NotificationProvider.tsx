'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import type { AppNotification } from '@/lib/backend-api';
import type { DeviceNotificationPermission } from '@/lib/device-notifications';
import { connectNotificationLive } from '@/lib/notification-live';
import { localizePath } from '@/i18n/localizedPath';
import { stripLocaleFromPathname } from '@/i18n/pathname';
import { NotificationPermissionPrompt } from './NotificationPermissionPrompt';

type NotificationContextValue = {
  items: AppNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  permission: DeviceNotificationPermission;
  refresh: (options?: { force?: boolean }) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  requestPermission: () => Promise<void>;
  openNotification: (notification: AppNotification) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

const PUBLIC_PATHS = new Set(['/login', '/landing']);
const DELIVERED_NOTIFICATIONS_STORAGE_KEY_PREFIX =
  'mk-academy:device-notifications:delivered:v1:';
const PERMISSION_PROMPT_STORAGE_KEY_PREFIX =
  'mk-academy:device-notifications:permission-prompt:v1:';
const PERMISSION_PROMPT_SNOOZE_MS = 24 * 60 * 60 * 1000;
const NOTIFICATION_REFRESH_COOLDOWN_MS = 10_000;

function getDeliveredNotificationsStorageKey(token: string | null) {
  const scope = token ? token.slice(-16) : 'guest';
  return `${DELIVERED_NOTIFICATIONS_STORAGE_KEY_PREFIX}${scope}`;
}

function getPermissionPromptStorageKey(token: string | null) {
  const scope = token ? token.slice(-16) : 'guest';
  return `${PERMISSION_PROMPT_STORAGE_KEY_PREFIX}${scope}`;
}

function loadDeliveredNotificationIds(storageKey: string): Set<number> {
  if (typeof window === 'undefined') {
    return new Set<number>();
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return new Set<number>();

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set<number>();

    return new Set(
      parsed
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0),
    );
  } catch {
    return new Set<number>();
  }
}

function persistDeliveredNotificationIds(storageKey: string, ids: Set<number>) {
  if (typeof window === 'undefined') {
    return;
  }

  const next = Array.from(ids).slice(-300);
  window.localStorage.setItem(storageKey, JSON.stringify(next));
}

function loadPermissionPromptDismissed(storageKey: string) {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return false;

    const dismissedAt = Number(raw);
    if (!Number.isFinite(dismissedAt)) return false;

    if (Date.now() - dismissedAt < PERMISSION_PROMPT_SNOOZE_MS) {
      return true;
    }

    window.localStorage.removeItem(storageKey);
    return false;
  } catch {
    return false;
  }
}

function persistPermissionPromptDismissed(storageKey: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey, String(Date.now()));
}

function normalizeRoute(route: unknown) {
  if (typeof route !== 'string' || !route.trim()) {
    return null;
  }

  return route.startsWith('/') ? route : `/${route}`;
}

function loadNotificationApi() {
  return import('@/lib/backend-api');
}

function loadDeviceNotifications() {
  return import('@/lib/device-notifications');
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Notifications');
  const pathname = usePathname() || '/';
  const normalizedPath = stripLocaleFromPathname(pathname);
  const enabled = !authLoading && Boolean(token) && !PUBLIC_PATHS.has(normalizedPath);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<DeviceNotificationPermission>('prompt');
  const [permissionPromptDismissed, setPermissionPromptDismissed] =
    useState(false);
  const deliveredStorageKey = getDeliveredNotificationsStorageKey(token);
  const permissionPromptStorageKey = getPermissionPromptStorageKey(token);
  const hydratedRef = useRef(false);
  const deliveredIdsRef = useRef<Set<number>>(new Set<number>());
  const itemsRef = useRef<AppNotification[]>([]);
  const refreshInFlightRef = useRef<Promise<void> | null>(null);
  const lastRefreshAtRef = useRef(0);

  const syncPermission = useCallback(async () => {
    const { getDeviceNotificationPermission } = await loadDeviceNotifications();
    const currentPermission = await getDeviceNotificationPermission();
    setPermission(currentPermission);
  }, []);

  const applyFeed = useCallback(
    (feed: { items: AppNotification[]; unreadCount: number }) => {
      setItems(feed.items || []);
      setUnreadCount(feed.unreadCount || 0);
    },
    [],
  );

  const applyLiveNotification = useCallback((notification: AppNotification) => {
    setItems((current) => {
      const existingIndex = current.findIndex((item) => item.id === notification.id);
      if (existingIndex >= 0) {
        return current.map((item) => (item.id === notification.id ? notification : item));
      }

      return [notification, ...current].slice(0, 50);
    });

    if (!notification.isRead) {
      setUnreadCount((current) => current + 1);
    }
  }, []);

  useEffect(() => {
    deliveredIdsRef.current = loadDeliveredNotificationIds(
      deliveredStorageKey,
    );
    hydratedRef.current = false;
  }, [deliveredStorageKey]);

  useEffect(() => {
    setPermissionPromptDismissed(
      loadPermissionPromptDismissed(permissionPromptStorageKey),
    );
  }, [permissionPromptStorageKey]);

  const rememberDeliveredNotification = useCallback(
    (id: number) => {
      deliveredIdsRef.current.add(id);
      persistDeliveredNotificationIds(
        deliveredStorageKey,
        deliveredIdsRef.current,
      );
    },
    [deliveredStorageKey],
  );

  const dismissPermissionPrompt = useCallback(() => {
    setPermissionPromptDismissed(true);
    persistPermissionPromptDismissed(permissionPromptStorageKey);
  }, [permissionPromptStorageKey]);

  const emitRuntimeNotifications = useCallback(
    async (nextItems: AppNotification[], options?: { showToast?: boolean }) => {
      const freshItems = nextItems.filter(
        (item) => !item.isRead && !deliveredIdsRef.current.has(item.id),
      );

      if (freshItems.length === 0) {
        return;
      }

      const { sendDeviceNotification } = await loadDeviceNotifications();
      const toastApi = options?.showToast
        ? (await import('sonner')).toast
        : null;

      for (const item of freshItems) {
        rememberDeliveredNotification(item.id);

        const rawRoute = normalizeRoute(item.data?.route);
        const route = rawRoute ? localizePath(locale, rawRoute) : null;

        if (toastApi) {
          toastApi(item.title, {
            description: item.body,
            action: route
              ? {
                  label: t('open'),
                  onClick: () => {
                    router.push(route);
                  },
                }
              : undefined,
          });
        }

        void sendDeviceNotification({
          id: item.id,
          title: item.title,
          body: item.body,
          route: rawRoute ?? undefined,
        });
      }
    },
    [locale, rememberDeliveredNotification, router, t],
  );

  const refresh = useCallback(async (options?: { force?: boolean }) => {
    if (!enabled) {
      setItems([]);
      setUnreadCount(0);
      setLoading(false);
      setError(null);
      hydratedRef.current = false;
      return;
    }

    const now = Date.now();
    if (
      !options?.force &&
      now - lastRefreshAtRef.current < NOTIFICATION_REFRESH_COOLDOWN_MS
    ) {
      return refreshInFlightRef.current ?? undefined;
    }

    if (refreshInFlightRef.current) {
      return refreshInFlightRef.current;
    }

    const refreshPromise = (async () => {
      setLoading(true);
      setError(null);

      try {
        const { getMyNotifications } = await loadNotificationApi();
        const feed = await getMyNotifications();
        const nextItems = feed?.items || [];
        applyFeed({
          items: nextItems,
          unreadCount: feed?.unreadCount || 0,
        });

        lastRefreshAtRef.current = Date.now();
        await emitRuntimeNotifications(nextItems, {
          showToast: hydratedRef.current,
        });
        hydratedRef.current = true;
      } catch (notificationError) {
        setError(
          notificationError instanceof Error
            ? notificationError.message
            : t('fetchError'),
        );
      } finally {
        setLoading(false);
        refreshInFlightRef.current = null;
      }
    })();

    refreshInFlightRef.current = refreshPromise;
    return refreshPromise;
  }, [applyFeed, emitRuntimeNotifications, enabled, t]);

  const markAsReadHandler = useCallback(async (id: number) => {
    const { markNotificationAsRead } = await loadNotificationApi();
    await markNotificationAsRead(id);
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
    setUnreadCount((current) => Math.max(0, current - 1));
  }, []);

  const markAllHandler = useCallback(async () => {
    const { markAllNotificationsAsRead } = await loadNotificationApi();
    const feed = await markAllNotificationsAsRead();
    applyFeed(feed);
  }, [applyFeed]);

  const removeHandler = useCallback(
    async (id: number) => {
      const { removeNotification } = await loadNotificationApi();
      await removeNotification(id);
      setItems((current) => current.filter((item) => item.id !== id));
      setUnreadCount((current) => {
        const removed = items.find((item) => item.id === id);
        return removed && !removed.isRead ? Math.max(0, current - 1) : current;
      });
    },
    [items],
  );

  const requestPermissionHandler = useCallback(async () => {
    const { requestDeviceNotificationPermission } = await loadDeviceNotifications();
    const nextPermission = await requestDeviceNotificationPermission();
    setPermission(nextPermission);
    dismissPermissionPrompt();

    if (nextPermission === 'granted') {
      await emitRuntimeNotifications(itemsRef.current, { showToast: false });
      const { toast } = await import('sonner');
      toast.success(t('enabledToast'));
      return;
    }

    if (nextPermission === 'denied') {
      const { toast } = await import('sonner');
      toast.error(t('deniedToast'));
    }
  }, [dismissPermissionPrompt, emitRuntimeNotifications, t]);

  const openNotification = useCallback(
    async (notification: AppNotification) => {
      if (!notification.isRead) {
        await markAsReadHandler(notification.id);
      }

      const route =
        typeof notification.data?.route === 'string'
          ? localizePath(locale, notification.data.route)
          : null;

      if (route) {
        router.push(route);
      }
    },
    [locale, markAsReadHandler, router],
  );

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (!enabled) {
      setPermission('prompt');
      return;
    }

    void syncPermission();
  }, [enabled, syncPermission]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const fallbackTimer = window.setTimeout(() => {
      void refresh();
    }, 2500);

    const connection = connectNotificationLive({
      token: token || '',
      onEvent: (event) => {
        window.clearTimeout(fallbackTimer);

        if (event.kind === 'feed') {
          applyFeed(event.feed);
          void emitRuntimeNotifications(event.feed.items, {
            showToast: hydratedRef.current,
          });
          hydratedRef.current = true;
          return;
        }

        if (event.kind === 'notification') {
          applyLiveNotification(event.notification);
          void emitRuntimeNotifications([event.notification], {
            showToast: hydratedRef.current,
          });
          hydratedRef.current = true;
          return;
        }

        if (event.kind === 'unread') {
          setUnreadCount(event.unreadCount);
        }
      },
      onStatus: (status) => {
        if (status === 'fallback') {
          void refresh();
        }
      },
    });

    return () => {
      window.clearTimeout(fallbackTimer);
      connection.close();
    };
  }, [applyFeed, applyLiveNotification, emitRuntimeNotifications, enabled, refresh, token]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    void loadDeviceNotifications().then(({ initializeDeviceNotifications }) => {
      if (cancelled) {
        return;
      }

      void initializeDeviceNotifications({
        onOpenNotification: ({ route }) => {
          const normalizedRoute = normalizeRoute(route);
          if (normalizedRoute) {
            router.push(localizePath(locale, normalizedRoute));
            return;
          }

          router.push(localizePath(locale, '/notifications'));
        },
      });
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, locale, router]);

  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setUnreadCount(0);
      setLoading(false);
      setError(null);
      hydratedRef.current = false;
      return;
    }
  }, [enabled]);

  const value = useMemo<NotificationContextValue>(
    () => ({
      items,
      unreadCount,
      loading,
      error,
      permission,
      refresh,
      markAsRead: markAsReadHandler,
      markAllAsRead: markAllHandler,
      removeItem: removeHandler,
      requestPermission: requestPermissionHandler,
      openNotification,
    }),
    [
      error,
      items,
      loading,
      markAllHandler,
      markAsReadHandler,
      openNotification,
      permission,
      refresh,
      removeHandler,
      requestPermissionHandler,
      unreadCount,
    ],
  );

  const showPermissionPrompt =
    enabled && permission === 'prompt' && !permissionPromptDismissed;

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationPermissionPrompt
        open={showPermissionPrompt}
        title={t('permissionTitle')}
        description={t('permissionDescription')}
        enableLabel={t('enable')}
        laterLabel={t('later')}
        onEnable={() => void requestPermissionHandler()}
        onLater={dismissPermissionPrompt}
      />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }

  return context;
}
