import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

export const runtime = 'edge';
export const dynamic = 'force-static';
export const revalidate = 86400; // Har bir kunda bir marta yangilab turadi (build paytida)

const DEFAULT_API_URL = 'https://mk-academy-dev.onrender.com/api';
function getApiUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  
  // 1. Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/landing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. Dynamic courses
  let courseRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${getApiUrl()}/courses`, { next: { revalidate: 3600 } });
    const payload = await res.json();
    const courses = (payload?.data ?? payload) as any[];

    if (Array.isArray(courses)) {
      courseRoutes = courses.map((course) => ({
        url: `${siteUrl}/courses/${course.id}`,
        lastModified: new Date(course.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error('Sitemap course fetch error:', err);
  }

  return [...staticRoutes, ...courseRoutes];
}
