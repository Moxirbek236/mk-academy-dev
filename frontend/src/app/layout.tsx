import type { Metadata, Viewport } from 'next';
import './globals.css';
import ClientLayoutWrapper from './ClientLayoutWrapper';
import { getLocale, getMessages } from 'next-intl/server';
import { AppProviders } from './providers';
import { getServerCenterBranding } from '@/lib/server-center-branding';

// Fix Node 25 experimental localStorage issue
if (typeof window === 'undefined') {
  Reflect.deleteProperty(globalThis, 'localStorage');
  Reflect.deleteProperty(globalThis, 'sessionStorage');
}

import { generateSEO } from '@/lib/seo';
export const runtime = 'edge';

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
  const locale = await getLocale();
  const messages = await getMessages();
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
