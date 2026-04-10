import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/landing',
  ].map((route) => ({
    url: `${getSiteUrl()}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1 : 0.6,
  }));

  return routes;
}
