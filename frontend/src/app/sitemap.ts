import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mk-academy.netlify.app';

  // Define your static routes here
  const routes = [
    '',
    '/landing',
    '/login',
    '/courses',
    '/books',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' || route === '/landing' ? 1 : 0.8,
  }));

  return routes;
}
