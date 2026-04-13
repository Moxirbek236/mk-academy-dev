import { Capacitor } from '@capacitor/core';

const DEFAULT_API_URL = 'https://mk-academy-dev.onrender.com/api';

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

export function getApiBaseUrl() {
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

export { DEFAULT_API_URL };
