import { Capacitor } from '@capacitor/core';

const DEFAULT_API_ORIGIN = 'http://api.mk-academia.uz';
const DEFAULT_API_URL = normalizeConfiguredApiUrl(DEFAULT_API_ORIGIN);
const FRONTEND_PROXY_PATH = '/api/proxy';

function normalizeApiPath(pathname: string) {
  const normalizedPath = pathname.replace(/\/+$/, '');

  if (!normalizedPath || normalizedPath === '/') {
    return '/api';
  }

  return normalizedPath;
}

function normalizeConfiguredApiUrl(url: string) {
  const trimmedUrl = url.trim().replace(/^['"]|['"]$/g, '');
  const parsedUrl = new URL(trimmedUrl);

  parsedUrl.pathname = normalizeApiPath(parsedUrl.pathname);
  parsedUrl.hash = '';
  parsedUrl.search = '';

  return parsedUrl.toString().replace(/\/+$/, '');
}

function normalizeApiUrl(url: string) {
  try {
    return normalizeConfiguredApiUrl(url);
  } catch {
    return DEFAULT_API_URL;
  }
}

function isLoopbackUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function isInsecureHttpUrl(url: string) {
  try {
    return new URL(url).protocol === 'http:';
  } catch {
    return false;
  }
}

function isNativeRuntime() {
  if (typeof window === 'undefined') return false;
  return Capacitor.isNativePlatform();
}

function isLocalWebRuntime() {
  if (typeof window === 'undefined') return false;

  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
}

function shouldUseBrowserProxy(url: string) {
  if (typeof window === 'undefined') return false;
  if (process.env.CAPACITOR_EXPORT === 'true') return false;
  if (window.location.protocol !== 'https:') return false;
  if (isLoopbackUrl(url)) return false;
  return isInsecureHttpUrl(url);
}

export function getDirectApiBaseUrl() {
  const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  const configuredNativeApiUrl = process.env.NEXT_PUBLIC_NATIVE_API_URL?.trim();
  const capacitorExport = process.env.CAPACITOR_EXPORT === 'true';

  if (isNativeRuntime()) {
    if (configuredNativeApiUrl) return normalizeApiUrl(configuredNativeApiUrl);
    if (configuredApiUrl && !isLoopbackUrl(configuredApiUrl)) {
      return normalizeApiUrl(configuredApiUrl);
    }
    return DEFAULT_API_URL;
  }

  if (typeof window !== 'undefined') {
    if (configuredApiUrl) {
      const normalizedConfiguredApiUrl = normalizeApiUrl(configuredApiUrl);

      if (!isLoopbackUrl(normalizedConfiguredApiUrl) || isLocalWebRuntime()) {
        return normalizedConfiguredApiUrl;
      }
    }

    if (configuredNativeApiUrl) return normalizeApiUrl(configuredNativeApiUrl);
    return DEFAULT_API_URL;
  }

  if (configuredNativeApiUrl && (!configuredApiUrl || (capacitorExport && isLoopbackUrl(configuredApiUrl)))) {
    return normalizeApiUrl(configuredNativeApiUrl);
  }

  if (configuredApiUrl && (!capacitorExport || !isLoopbackUrl(configuredApiUrl))) {
    return normalizeApiUrl(configuredApiUrl);
  }

  return DEFAULT_API_URL;
}

export function getApiBaseUrl() {
  const directApiUrl = getDirectApiBaseUrl();

  if (shouldUseBrowserProxy(directApiUrl)) {
    return FRONTEND_PROXY_PATH;
  }

  return directApiUrl;
}

export { DEFAULT_API_ORIGIN, DEFAULT_API_URL, FRONTEND_PROXY_PATH };
