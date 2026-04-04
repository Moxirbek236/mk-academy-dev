import { Metadata } from 'next';

const APP_NAME = 'MK Academy';
const DEFAULT_TITLE = 'MK Academy — Ingliz Tili O\'rganish Platformasi';
const DEFAULT_DESCRIPTION = 'Ingliz tilini CEFR standarti bo\'yicha noldan professional darajagacha o\'rganing. Grammar, Vocabulary, Listening, Reading — hammasi bir joyda.';

export const generateSEO = (
  title?: string,
  description?: string,
  path: string = '',
): Metadata => {
  const fullTitle = title ? `${title} | ${APP_NAME}` : DEFAULT_TITLE;
  const fullDescription = description || DEFAULT_DESCRIPTION;
  const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    title: fullTitle,
    description: fullDescription,
    manifest: '/manifest.json',
    keywords: ['ingliz tili', 'english', 'CEFR', 'IELTS', 'grammar', 'vocabulary', 'MK Academy', 'ingliz tili kurslari'],
    icons: {
      icon: '/icon.jpg',
      shortcut: '/icon.jpg',
      apple: '/apple-icon.jpg',
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: `${url}${path}`,
      siteName: APP_NAME,
      locale: 'uz_UZ',
      type: 'website',
      images: [
        {
          url: 'https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg',
          width: 800,
          height: 600,
          alt: 'MK Academy - Ingliz Tili Platformasi',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: APP_NAME,
    },
  };
};
