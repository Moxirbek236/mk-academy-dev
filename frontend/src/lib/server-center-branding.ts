import {
  DEFAULT_CENTER_BRANDING,
  normalizeCenterBranding,
} from '@/lib/branding';

const DEFAULT_API_URL = 'https://mk-academy-dev.onrender.com/api';

function getApiUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, '');
}

export async function getServerCenterBranding() {
  try {
    const response = await fetch(`${getApiUrl()}/center-settings/public`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Center branding fetch failed: ${response.status}`);
    }

    const payload = await response.json();
    return normalizeCenterBranding(payload?.data ?? payload);
  } catch {
    return DEFAULT_CENTER_BRANDING;
  }
}
