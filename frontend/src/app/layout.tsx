import type { Metadata, Viewport } from 'next';
import '../styles/index.css';
import './globals.css';
import ClientLayoutWrapper from './ClientLayoutWrapper';
import { getLocale, getMessages } from 'next-intl/server';
import { AppProviders } from './providers';
import { getServerCenterBranding } from '@/lib/server-center-branding';
import { defaultLocale } from '@/i18n/config';

// Fix Node 25 experimental localStorage issue
if (typeof window === 'undefined') {
  Reflect.deleteProperty(globalThis, 'localStorage');
  Reflect.deleteProperty(globalThis, 'sessionStorage');
}

import { generateSEO } from '@/lib/seo';
export const runtime = 'edge';

const isCapacitorExport = process.env.CAPACITOR_EXPORT === 'true';

async function getLayoutLocale() {
  if (isCapacitorExport) return defaultLocale;
  return getLocale();
}

async function getLayoutMessages() {
  if (isCapacitorExport) {
    return (await import(`../messages/${defaultLocale}.json`)).default;
  }

  return getMessages();
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#202734',
  colorScheme: 'light dark',
};

export async function generateMetadata(): Promise<Metadata> {
  const centerBranding = await getServerCenterBranding();

  return generateSEO(
    `${centerBranding.name} - Eng Zo'r Ingliz Tili Platformasi`,
    `${centerBranding.description} O'zbekiston bo'ylab noldan professional darajagacha ingliz tilini o'rganing.`,
    '',
    centerBranding.logoUrl,
    centerBranding.name,
    {
      keywords: [
        centerBranding.name,
        centerBranding.shortName,
        'ingliz tili kurslari',
        'online ingliz tili',
        'IELTS tayyorlov',
        'CEFR imtihoni',
        'english learning',
      ],
    },
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLayoutLocale();
  const messages = await getLayoutMessages();
  const centerBranding = await getServerCenterBranding();

  return (
    <html lang={locale} className="h-full" suppressHydrationWarning>
      <body
        className="min-h-full antialiased bg-[var(--app-bg)] text-[var(--app-text)] selection:bg-[#202734] selection:text-[#f2f2f0]"
        suppressHydrationWarning
      >
        <AppProviders
          locale={locale}
          messages={messages}
          centerBranding={centerBranding}
        >
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
