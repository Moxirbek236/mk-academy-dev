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
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  removeNotification,
  type AppNotification,
} from '@/lib/backend-api';
import {
  getDeviceNotificationPermission,
  requestDeviceNotificationPermission,
  sendDeviceNotification,
  type DeviceNotificationPermission,
} from '@/lib/device-notifications';
import { localizePath } from '@/i18n/localizedPath';
import { stripLocaleFromPathname } from '@/i18n/pathname';

type NotificationContextValue = {
  items: AppNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  permission: DeviceNotificationPermission;
  refresh: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  requestPermission: () => Promise<void>;
  openNotification: (notification: AppNotification) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

const PUBLIC_PATHS = new Set(['/login', '/landing']);

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
  const hydratedRef = useRef(false);
  const deliveredIdsRef = useRef<Set<number>>(new Set());

  const syncPermission = useCallback(async () => {
    const currentPermission = await getDeviceNotificationPermission();
    setPermission(currentPermission);
  }, []);

  const applyFeed = useCallback((feed: { items: AppNotification[]; unreadCount: number }) => {
    setItems(feed.items || []);
    setUnreadCount(feed.unreadCount || 0);
  }, []);

  const emitRuntimeNotifications = useCallback(
    async (nextItems: AppNotification[]) => {
      const freshItems = nextItems.filter(
        (item) => !item.isRead && !deliveredIdsRef.current.has(item.id),
      );

      for (const item of freshItems) {
        deliveredIdsRef.current.add(item.id);

        const route =
          typeof item.data?.route === 'string' ? localizePath(locale, item.data.route) : null;

        toast(item.title, {
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

        void sendDeviceNotification({
          id: item.id,
          title: item.title,
          body: item.body,
        });
      }
    },
    [locale, router, t],
  );

  const refresh = useCallback(async () => {
    if (!enabled) {
      setItems([]);
      setUnreadCount(0);
      setLoading(false);
      setError(null);
      hydratedRef.current = false;
      deliveredIdsRef.current.clear();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const feed = await getMyNotifications();
      const nextItems = feed?.items || [];
      applyFeed({
        items: nextItems,
        unreadCount: feed?.unreadCount || 0,
      });

      if (!hydratedRef.current) {
        nextItems.forEach((item) => {
          deliveredIdsRef.current.add(item.id);
        });
        hydratedRef.current = true;
      } else {
        await emitRuntimeNotifications(nextItems);
      }
    } catch (notificationError) {
      setError(
        notificationError instanceof Error
          ? notificationError.message
          : t('fetchError'),
      );
    } finally {
      setLoading(false);
    }
  }, [applyFeed, emitRuntimeNotifications, enabled, t]);

  const markAsReadHandler = useCallback(async (id: number) => {
    await markNotificationAsRead(id);
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
    setUnreadCount((current) => Math.max(0, current - 1));
  }, []);

  const markAllHandler = useCallback(async () => {
    const feed = await markAllNotificationsAsRead();
    applyFeed(feed);
  }, [applyFeed]);

  const removeHandler = useCallback(async (id: number) => {
    await removeNotification(id);
    setItems((current) => current.filter((item) => item.id !== id));
    setUnreadCount((current) => {
      const removed = items.find((item) => item.id === id);
      return removed && !removed.isRead ? Math.max(0, current - 1) : current;
    });
  }, [items]);

  const requestPermissionHandler = useCallback(async () => {
    const nextPermission = await requestDeviceNotificationPermission();
    setPermission(nextPermission);

    if (nextPermission === 'granted') {
      toast.success(t('enabledToast'));
      return;
    }

    if (nextPermission === 'denied') {
      toast.error(t('deniedToast'));
    }
  }, [t]);

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
    void syncPermission();
  }, [syncPermission]);

  useEffect(() => {
    void refresh();

    if (!enabled) {
      return;
    }

    const timer = window.setInterval(() => {
      void refresh();
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [enabled, refresh]);

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

  return (
    <NotificationContext.Provider value={value}>
      {children}
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
