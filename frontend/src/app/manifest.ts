import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MK Academy',
    short_name: 'MK Academy',
    description: 'MK Academy — Ingliz tili o\'rganish platformasi. CEFR standarti bo\'yicha darslar.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#2563eb',
    icons: [
      {
        src: 'https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: 'https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  };
}
