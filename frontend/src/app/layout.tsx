import type { Metadata, Viewport } from 'next';
import './globals.css';
import ClientLayoutWrapper from './ClientLayoutWrapper';
import { getLocale, getMessages } from 'next-intl/server';
import { AppProviders } from './providers';

// Fix Node 25 experimental localStorage issue
if (typeof window === 'undefined') {
  // @ts-ignore
  delete global.localStorage;
  // @ts-ignore
  delete global.sessionStorage;
}

import { generateSEO } from '@/lib/seo';

// Global SEO Configuration
export const runtime = 'edge';
export const metadata = generateSEO();
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#2563eb',
  colorScheme: 'light dark',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full" suppressHydrationWarning>
      <body
        className="min-h-full antialiased bg-[var(--app-bg)] text-[var(--app-text)] selection:bg-[#2563eb] selection:text-white"
        suppressHydrationWarning
      >
        <AppProviders locale={locale} messages={messages}>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
