import { Capacitor } from '@capacitor/core';

const DEFAULT_API_ORIGIN = 'http://165.245.209.1:3232';
const DEFAULT_API_URL = `${DEFAULT_API_ORIGIN}/api`;
const FRONTEND_PROXY_PATH = '/api/proxy';

function normalizeApiUrl(url: string) {
  return url.replace(/\/$/, '');
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
    if (configuredApiUrl && (!isLoopbackUrl(configuredApiUrl) || isLocalWebRuntime())) {
      return normalizeApiUrl(configuredApiUrl);
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
