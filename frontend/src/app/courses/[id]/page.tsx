import { Metadata } from 'next';
import CourseDetailClient from './CourseDetailClient';
import { generateSEO } from '@/lib/seo';
import { getServerCenterBranding } from '@/lib/server-center-branding';

interface Props {
  params: { id: string };
}

// Fixed getApiUrl for server-side use in metadata
const DEFAULT_API_URL = 'https://mk-academy-dev.onrender.com/api';
function getApiUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, '');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const centerBranding = await getServerCenterBranding();
  
  try {
    const response = await fetch(`${getApiUrl()}/courses/${id}`, { cache: 'no-store' });
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

export default function CourseDetailPage() {
  return <CourseDetailClient />;
}
