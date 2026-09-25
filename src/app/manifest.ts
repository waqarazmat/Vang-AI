import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VangAI',
    short_name: 'VangAI',
    description: 'The done-for-you front desk that never misses a customer.',
    start_url: '/',
    display: 'browser',
    background_color: '#FAEEDA',
    theme_color: '#FAEEDA',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
