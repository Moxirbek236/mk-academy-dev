import {
  DEFAULT_CENTER_BRANDING,
  normalizeCenterBranding,
} from '@/lib/branding';
import { getApiBaseUrl } from '@/lib/api-url';

export async function getServerCenterBranding() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/center-settings/public`, {
      next: { revalidate: 3600 },
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
