import { Metadata } from 'next';
import CourseDetailClient from './CourseDetailClient';
import { generateSEO } from '@/lib/seo';
import { getServerCenterBranding } from '@/lib/server-center-branding';
import { getApiBaseUrl } from '@/lib/api-url';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const centerBranding = await getServerCenterBranding();
  
  try {
    const response = await fetch(`${getApiBaseUrl()}/courses/${id}`, { cache: 'no-store' });
    const payload = await response.json();
    const course = payload?.data ?? payload;

    if (!course) throw new Error('Course not found');

    return generateSEO(
      `${course.title} | ${centerBranding.name} Ingliz tili kurslari`,
      `${course.description || centerBranding.description}. ${course.level} darajadagi professional kurs.`,
      `/courses/${id}`,
      centerBranding.logoUrl,
      centerBranding.name,
      {
        keywords: [
          course.title,
          course.level,
          'ingliz tili',
          'kurs',
          centerBranding.name,
        ],
      }
    );
  } catch {
    return generateSEO(
      `Kurs tafsilotlari | ${centerBranding.name}`,
      centerBranding.description,
      `/courses/${id}`,
      centerBranding.logoUrl,
      centerBranding.name
    );
  }
}

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export default async function CourseDetailPage({ params }: Props) {
  // Although CourseDetailClient uses useParams(), 
  // the Page component must satisfy Next.js 15 constraints.
  await params; 
  return <CourseDetailClient />;
}
