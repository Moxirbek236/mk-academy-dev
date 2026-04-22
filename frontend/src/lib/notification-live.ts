import type { AppNotification, NotificationFeed } from '@/lib/backend-api';
import { getApiBaseUrl } from '@/lib/api-url';

type NotificationLiveEvent =
  | { kind: 'feed'; feed: NotificationFeed }
  | { kind: 'notification'; notification: AppNotification }
  | { kind: 'unread'; unreadCount: number };

type NotificationLiveOptions = {
  token: string;
  onEvent: (event: NotificationLiveEvent) => void;
  onStatus?: (status: 'connecting' | 'open' | 'closed' | 'fallback') => void;
};

type NotificationLiveConnection = {
  close: () => void;
};

function getAbsoluteApiBaseUrl() {
  const base = getApiBaseUrl();
  return new URL(base, window.location.origin).toString().replace(/\/+$/, '');
}

function getLiveUrl(path: string, token: string, protocol: 'ws' | 'http') {
  const apiBase = getAbsoluteApiBaseUrl();
  const url = new URL(`${apiBase}/${path.replace(/^\/+/, '')}`);
  url.searchParams.set('token', token);

  if (protocol === 'ws') {
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  }

  return url.toString();
}

function normalizeNotificationEvent(raw: unknown): NotificationLiveEvent | null {
  if (!raw || typeof raw !== 'object') return null;

  const payload = raw as {
    event?: string;
    type?: string;
    data?: unknown;
    notification?: AppNotification;
    item?: AppNotification;
    items?: AppNotification[];
    unreadCount?: number;
  };

  const data = payload.data as typeof payload | undefined;
  const feedItems = payload.items || data?.items;
  const unreadCount = payload.unreadCount ?? data?.unreadCount;

  if (Array.isArray(feedItems)) {
    return {
      kind: 'feed',
      feed: {
        items: feedItems,
        unreadCount: Number(unreadCount || 0),
      },
    };
  }

  const notification = payload.notification || payload.item || data?.notification || data?.item;
  if (notification && typeof notification === 'object' && 'id' in notification) {
    return {
      kind: 'notification',
      notification: notification as AppNotification,
    };
  }

  if (typeof unreadCount === 'number') {
    return { kind: 'unread', unreadCount };
  }

  return null;
}

function parseLiveMessage(raw: string): NotificationLiveEvent | null {
  try {
    return normalizeNotificationEvent(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function connectNotificationLive({
  token,
  onEvent,
  onStatus,
}: NotificationLiveOptions): NotificationLiveConnection {
  let closed = false;
  let socket: WebSocket | null = null;
  let source: EventSource | null = null;

  const close = () => {
    closed = true;
    socket?.close();
    source?.close();
    socket = null;
    source = null;
  };

  const connectSse = () => {
    if (closed || typeof EventSource === 'undefined') {
      onStatus?.('fallback');
      return;
    }

    onStatus?.('connecting');
    source = new EventSource(getLiveUrl('/notifications/stream', token, 'http'));

    source.onopen = () => {
      if (!closed) onStatus?.('open');
    };

    source.onmessage = (message) => {
      const event = parseLiveMessage(message.data);
      if (event) onEvent(event);
    };

    source.onerror = () => {
      source?.close();
      source = null;
      if (!closed) onStatus?.('fallback');
    };
  };

  if (typeof WebSocket === 'undefined') {
    connectSse();
    return { close };
  }

  onStatus?.('connecting');
  socket = new WebSocket(getLiveUrl('/notifications/ws', token, 'ws'));

  socket.onopen = () => {
    if (!closed) onStatus?.('open');
  };

  socket.onmessage = (message) => {
    const event = typeof message.data === 'string' ? parseLiveMessage(message.data) : null;
    if (event) onEvent(event);
  };

  socket.onclose = () => {
    socket = null;
    if (!closed) {
      onStatus?.('closed');
      connectSse();
    }
  };

  socket.onerror = () => {
    socket?.close();
  };

  return { close };
}
