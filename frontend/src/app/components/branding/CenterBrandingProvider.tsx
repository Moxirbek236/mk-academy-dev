'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getPublicCenterSettings,
  updateCenterSettings,
  type CenterSettingsPayload,
} from '@/lib/backend-api';
import {
  DEFAULT_CENTER_BRANDING,
  normalizeCenterBranding,
  type CenterBranding,
} from '@/lib/branding';

type CenterBrandingContextValue = {
  centerBranding: CenterBranding;
  refresh: () => Promise<CenterBranding>;
  saveSettings: (payload: CenterSettingsPayload) => Promise<CenterBranding>;
  saving: boolean;
};

const CenterBrandingContext =
  createContext<CenterBrandingContextValue | null>(null);

export function CenterBrandingProvider({
  children,
  initialBranding,
}: {
  children: ReactNode;
  initialBranding?: CenterBranding;
}) {
  const [centerBranding, setCenterBranding] = useState<CenterBranding>(
    normalizeCenterBranding(initialBranding || DEFAULT_CENTER_BRANDING),
  );
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    const next = normalizeCenterBranding(await getPublicCenterSettings());
    setCenterBranding(next);
    return next;
  }, []);

  const saveSettings = useCallback(async (payload: CenterSettingsPayload) => {
    setSaving(true);

    try {
      const next = normalizeCenterBranding(await updateCenterSettings(payload));
      setCenterBranding(next);
      return next;
    } finally {
      setSaving(false);
    }
  }, []);

  const value = useMemo<CenterBrandingContextValue>(
    () => ({
      centerBranding,
      refresh,
      saveSettings,
      saving,
    }),
    [centerBranding, refresh, saveSettings, saving],
  );

  return (
    <CenterBrandingContext.Provider value={value}>
      {children}
    </CenterBrandingContext.Provider>
  );
}

export function useCenterBranding() {
  const context = useContext(CenterBrandingContext);

  if (!context) {
    throw new Error(
      'useCenterBranding must be used within CenterBrandingProvider',
    );
  }

  return context;
}
