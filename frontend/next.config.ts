import type { NextConfig } from 'next';

if (typeof window === 'undefined') {
  // @ts-ignore
  delete global.localStorage;
  // @ts-ignore
  delete global.sessionStorage;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
