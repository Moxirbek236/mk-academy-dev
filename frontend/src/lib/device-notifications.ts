'use client';

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export type DeviceNotificationPermission =
  | 'granted'
  | 'denied'
  | 'prompt'
  | 'unsupported';

function isNativePlatform() {
  return Capacitor.isNativePlatform();
}

function normalizeBrowserPermission(
  permission: NotificationPermission,
): DeviceNotificationPermission {
  if (permission === 'granted') return 'granted';
  if (permission === 'denied') return 'denied';
  return 'prompt';
}

export async function getDeviceNotificationPermission(): Promise<DeviceNotificationPermission> {
  if (isNativePlatform()) {
    try {
      const permissions = await LocalNotifications.checkPermissions();
      if (permissions.display === 'granted') return 'granted';
      if (permissions.display === 'denied') return 'denied';
      return 'prompt';
    } catch {
      return 'unsupported';
    }
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  return normalizeBrowserPermission(Notification.permission);
}

export async function requestDeviceNotificationPermission(): Promise<DeviceNotificationPermission> {
  if (isNativePlatform()) {
    try {
      const permissions = await LocalNotifications.requestPermissions();
      if (permissions.display === 'granted') return 'granted';
      if (permissions.display === 'denied') return 'denied';
      return 'prompt';
    } catch {
      return 'unsupported';
    }
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  const permission = await Notification.requestPermission();
  return normalizeBrowserPermission(permission);
}

export async function sendDeviceNotification(input: {
  id: number;
  title: string;
  body: string;
}) {
  const permission = await getDeviceNotificationPermission();

  if (permission !== 'granted') {
    return false;
  }

  if (isNativePlatform()) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: input.id,
          title: input.title,
          body: input.body,
          schedule: {
            at: new Date(Date.now() + 250),
          },
        },
      ],
    });

    return true;
  }

  if (typeof window !== 'undefined' && 'Notification' in window) {
    new Notification(input.title, { body: input.body });
    return true;
  }

  return false;
}
