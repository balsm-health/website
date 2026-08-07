import { MetadataRoute } from 'next';
import { locales } from '@/i18n/request';
import { canonicalUrl } from '@/lib/seo';

// Path (relative to /<locale>) → sitemap priority.
const routes: { path: string; priority: number }[] = [
  { path: '', priority: 1 },
  { path: '/cloud', priority: 0.9 },
  { path: '/providers', priority: 0.9 },
  { path: '/contributors', priority: 0.8 },
  { path: '/donate', priority: 0.8 },
  { path: '/links', priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://balsm.health';
  const lastModified = new Date();

  const urls: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of locales) {
      urls.push({
        url: canonicalUrl(locale, route.path),
        lastModified,
        changeFrequency: 'weekly',
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, canonicalUrl(l, route.path)])),
        },
      });
    }
  }

  return urls;
}
