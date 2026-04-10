'use client';

import type { ReactNode } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/app/components/ui/sonner';
import { NotificationProvider } from '@/app/components/notifications/NotificationProvider';
import { CenterBrandingProvider } from '@/app/components/branding/CenterBrandingProvider';
import type { CenterBranding } from '@/lib/branding';

interface AppProvidersProps {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
  centerBranding: CenterBranding;
}

export function AppProviders({
  children,
  locale,
  messages,
  centerBranding,
}: AppProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        enableColorScheme
        storageKey="mk-academy-theme"
        themes={['light', 'dark']}
        disableTransitionOnChange
      >
        <CenterBrandingProvider initialBranding={centerBranding}>
          <NotificationProvider>
            {children}
            <Toaster richColors position="top-right" />
          </NotificationProvider>
        </CenterBrandingProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
