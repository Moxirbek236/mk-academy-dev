import { Metadata } from 'next';
import { LandingPage } from '../components/LandingPage';
import { generateSEO } from '@/lib/seo';
import StructuredData from '../components/SEO/StructuredData';
import { getServerCenterBranding } from '@/lib/server-center-branding';
import { getPublicStructuredData } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const centerBranding = await getServerCenterBranding();

  return generateSEO(
    `${centerBranding.name} haqida | Eng Zo'r Ingliz Tili Platformasi`,
    `${centerBranding.description} ${centerBranding.name} o'zbek, rus va ingliz tillarida ta'lim tajribasini taklif qiladi. Uyingizdan chiqmasdan, oson va samarali ingliz tilini o'rganing.`,
    '/landing',
    centerBranding.logoUrl,
    centerBranding.name,
    {
      canonicalPath: '/',
      keywords: [
        centerBranding.name,
        centerBranding.shortName,
        'eng yaxshi ingliz tili markazi',
        'ingliz tili onlayn',
        'IELTS darslari',
        'CEFR sertifikati',
        'online ta\'lim',
      ],
    },
  );
}

export default async function Page() {
  const centerBranding = await getServerCenterBranding();

  return (
    <>
      <StructuredData data={getPublicStructuredData(centerBranding)} />
      <LandingPage />
    </>
  );
}
