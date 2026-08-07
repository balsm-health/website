import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Balsm - Open Source Healthcare Platform',
    short_name: 'Balsm',
    description: 'Join Balsm - the open source healthcare platform built for providers, patients, and developers.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8FAFC',
    theme_color: '#01c4a2',
    orientation: 'portrait',
    categories: ['health', 'medical', 'productivity'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      // The mark sits inside the safe area at these sizes, so the same raster
      // survives Android's maskable crop.
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/balsm-logo.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    lang: 'en',
    dir: 'ltr',
    scope: '/',
  };
}
