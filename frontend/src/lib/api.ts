import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { buildGetCacheKey, getCachedGetResponse, normalizeHeaders, setCachedGetResponse } from '@/lib/offline/cache';
import { OFFLINE_BANNER_MESSAGE, OFFLINE_MUTATION_MESSAGE } from '@/lib/offline/constants';
import { AppApiError, normalizeApiError } from '@/lib/offline/errors';
import { emitApiNotice } from '@/lib/offline/events';
import { isNetworkOnline } from '@/lib/offline/network';

interface OfflineRequestMeta {
  cacheKey?: string;
}

type ApiRequestConfig = InternalAxiosRequestConfig & {
  offlineMeta?: OfflineRequestMeta;
};

export interface OfflineResponseMeta {
  fromCache: boolean;
  cachedAt?: string;
}

export type OfflineAwareAxiosResponse<T = unknown> = AxiosResponse<T> & {
  offline?: OfflineResponseMeta;
};

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

  if (typeof window !== 'undefined') {
    const isAndroidEmulator =
      (window.origin.includes('capacitor') ||
        window.origin.includes('ionic') ||
        window.origin.includes('http://localhost')) &&
      /android/i.test(navigator.userAgent);

    if (isAndroidEmulator) {
      return 'http://10.0.2.2:3001/api';
    }

    return `${window.location.protocol}//${window.location.hostname}:3001/api`;
  }

  return 'http://localhost:3001/api';
};

function getTokenFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function getCacheScope(token: string | null): string {
  if (!token) return 'public';
  return `token:${token.slice(-12)}`;
}

function resolveRequestUrl(config: ApiRequestConfig): string {
  const rawUrl = config.url || '';
  if (/^https?:\/\//.test(rawUrl)) return rawUrl;

  const base = config.baseURL || getBaseUrl();
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = rawUrl.startsWith('/') ? rawUrl.slice(1) : rawUrl;
  return `${normalizedBase}${normalizedPath}`;
}

function isGetRequest(config: ApiRequestConfig): boolean {
  return (config.method || 'get').toUpperCase() === 'GET';
}

function isMutationRequest(config: ApiRequestConfig): boolean {
  const method = (config.method || 'get').toUpperCase();
  return method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';
}

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (incomingConfig) => {
  const config = incomingConfig as ApiRequestConfig;
  const token = getTokenFromStorage();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const isOnline = await isNetworkOnline();

  if (isGetRequest(config)) {
    config.offlineMeta = {
      cacheKey: buildGetCacheKey({
        url: resolveRequestUrl(config),
        params: config.params,
        scope: getCacheScope(token),
      }),
    };
  }

  if (!isOnline && isMutationRequest(config)) {
    emitApiNotice({ type: 'error', message: OFFLINE_MUTATION_MESSAGE });

    const error = new AppApiError({
      code: 'OFFLINE_MUTATION',
      message: OFFLINE_MUTATION_MESSAGE,
    });
    (error as { config?: ApiRequestConfig }).config = config;
    return Promise.reject(error);
  }

  if (!isOnline && isGetRequest(config)) {
    const error = new AppApiError({
      code: 'OFFLINE',
      message: "Internet mavjud emas, cache tekshirilmoqda",
    });
    (error as { config?: ApiRequestConfig }).config = config;
    return Promise.reject(error);
  }

  return config;
});

api.interceptors.response.use(
  async (response) => {
    const typedResponse = response as OfflineAwareAxiosResponse<unknown>;
    const config = response.config as ApiRequestConfig;

    if (isGetRequest(config) && config.offlineMeta?.cacheKey) {
      try {
        await setCachedGetResponse(config.offlineMeta.cacheKey, {
          data: response.data,
          status: response.status,
          statusText: response.statusText || 'OK',
          headers: normalizeHeaders(response.headers),
        });
      } catch {
        // Cache write errors should not break successful network responses
      }
    }

    typedResponse.offline = { fromCache: false };
    return typedResponse;
  },
  async (error: unknown) => {
    const fallbackConfig =
      (axios.isAxiosError(error) ? error.config : null) || (error as { config?: ApiRequestConfig })?.config;
    const config = (fallbackConfig || {}) as ApiRequestConfig;

    if (isGetRequest(config) && config.offlineMeta?.cacheKey) {
      try {
        const cached = await getCachedGetResponse(config.offlineMeta.cacheKey);
        if (cached) {
          emitApiNotice({ type: 'info', message: OFFLINE_BANNER_MESSAGE });

          const cachedResponse: OfflineAwareAxiosResponse<unknown> = {
            data: cached.data,
            status: cached.status || 200,
            statusText: cached.statusText || 'OK (CACHE)',
            headers: cached.headers,
            config,
            request: axios.isAxiosError(error) ? error.request : undefined,
            offline: {
              fromCache: true,
              cachedAt: cached.cachedAt,
            },
          };

          return cachedResponse;
        }
      } catch (cacheError) {
        return Promise.reject(
          new AppApiError({
            code: 'CACHE_PARSE',
            message: "Cache ma'lumotini o'qishda xatolik yuz berdi",
            cause: cacheError,
          }),
        );
      }
    }

    if (error instanceof AppApiError && error.code === 'OFFLINE') {
      return Promise.reject(
        new AppApiError({
          code: 'OFFLINE_NO_CACHE',
          message: "Internet mavjud emas va cache ma'lumot topilmadi",
          cause: error,
        }),
      );
    }

    if (axios.isAxiosError(error) && error.response?.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/landing') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/landing';
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);

export default api;
