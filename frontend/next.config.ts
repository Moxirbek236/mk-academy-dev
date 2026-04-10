import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const isCapacitorExport = process.env.CAPACITOR_EXPORT === 'true';

const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: false,
  cacheStartUrl: false,
  dynamicStartUrl: false,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development' || isCapacitorExport,
});

if (typeof window === 'undefined') {
  // @ts-ignore
  delete global.localStorage;
  // @ts-ignore
  delete global.sessionStorage;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isCapacitorExport ? { output: 'export' as const } : {}),
  env: {
    NEXT_PUBLIC_DISABLE_LOCALE_PREFIX: isCapacitorExport ? 'true' : 'false',
  },
  images: {
    unoptimized: true,
  },
};

export default withPWA(withNextIntl(nextConfig));
