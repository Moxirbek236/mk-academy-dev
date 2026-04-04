import type { Metadata, Viewport } from 'next';
import './globals.css';
import ClientLayoutWrapper from './ClientLayoutWrapper';

// Fix Node 25 experimental localStorage issue
if (typeof window === 'undefined') {
  // @ts-ignore
  delete global.localStorage;
  // @ts-ignore
  delete global.sessionStorage;
}

import { generateSEO } from '@/lib/seo';

// Global SEO Configuration
export const metadata = generateSEO();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
