import { Metadata } from 'next';
import { LandingPage } from '../components/LandingPage';
import { generateSEO } from '@/lib/seo';
import StructuredData from '../components/SEO/StructuredData';

export const metadata: Metadata = generateSEO(
  'MK Academy — Ingliz Tili O\'rganish Platformasi',
  'Ingliz tilini CEFR standarti (A1-C2) bo\'yicha noldan professional darajagacha o\'rganing.',
  '/landing'
);

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'MK Academy',
    description: 'Ingliz tilini CEFR standarti bo\'yicha o\'rganish uchun platforma',
    url: 'https://mk-academy.netlify.app',
    logo: 'https://mk-academy.netlify.app/icon.jpg',
    sameAs: [],
    offers: {
      '@type': 'Offer',
      category: 'Education',
    },
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <LandingPage />
    </>
  );
}
