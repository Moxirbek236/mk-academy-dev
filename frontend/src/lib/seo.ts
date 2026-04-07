import { Metadata } from 'next';

const APP_NAME = 'MK Academy';
const DEFAULT_TITLE = 'MK Academy — Ingliz Tili O\'rganish Platformasi';
const DEFAULT_DESCRIPTION = 'Ingliz tilini CEFR standarti bo\'yicha noldan professional darajagacha o\'rganing. Grammar, Vocabulary, Listening, Reading — hammasi bir joyda.';

export const generateSEO = (
  title?: string,
  description?: string,
  path: string = '',
  image?: string
): Metadata => {
  const fullTitle = title ? `${title} | ${APP_NAME}` : DEFAULT_TITLE;
  const fullDescription = description || DEFAULT_DESCRIPTION;
  const url = process.env.NEXT_PUBLIC_APP_URL || 'https://mk-academy.netlify.app';
  const fullUrl = `${url}${path}`;

  return {
    title: fullTitle,
    description: fullDescription,
    applicationName: APP_NAME,
    authors: [{ name: 'MK Academy Team' }],
    generator: 'Next.js',
    keywords: [
      'ingliz tili', 'english', 'CEFR', 'IELTS', 'grammar', 'vocabulary', 
      'MK Academy', 'ingliz tili kurslari', 'online ta\'lim', 'uzbekistan english',
      'A1 A2 B1 B2 C1 C2', 'ingliz tili noldan'
    ],
    referrer: 'origin-when-cross-origin',
    creator: 'MK Academy',
    publisher: 'MK Academy',
    alternates: {
      canonical: fullUrl,
      languages: {
        'uz-UZ': fullUrl,
      },
    },
    icons: {
      icon: [
        { url: 'https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg' },
      ],
      shortcut: 'https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg',
      apple: 'https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg',
    },
    manifest: '/manifest.json',
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: APP_NAME,
      locale: 'uz_UZ',
      type: 'website',
      images: [
        {
          url: image || 'https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg',
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      creator: '@mkacademy',
      images: [image || 'https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg'],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    category: 'education',
  };
};
