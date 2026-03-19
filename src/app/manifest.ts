import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Balsm - Open Source Healthcare Platform',
    short_name: 'Balsm',
    description: 'Join Balsm - the open source healthcare platform built for providers, patients, and developers.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#10b981',
    orientation: 'portrait',
    categories: ['health', 'medical', 'productivity'],
    icons: [
      {
        src: '/balsm-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    lang: 'en',
    dir: 'ltr',
    scope: '/',
  };
}
