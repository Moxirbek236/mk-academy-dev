import { MetadataRoute } from 'next';
import { PRIVATE_ROBOTS_PATHS, getSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', ...PRIVATE_ROBOTS_PATHS],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
    host: getSiteUrl(),
  };
}
