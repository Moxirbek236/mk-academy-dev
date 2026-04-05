import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MK Academy',
    short_name: 'MK Academy',
    description: 'MK Academy — Ingliz tili o\'rganish platformasi. CEFR standarti bo\'yicha darslar.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#3D855A',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
      {
        src: '/apple-icon.jpg',
        sizes: '180x180',
        type: 'image/jpeg',
      }
    ],
  };
}
