import { MetadataRoute } from 'next';
import { defaultLocale, locales } from '@/i18n/request';
import { CONTENT_REVISED, canonicalUrl } from '@/lib/seo';

// Path (relative to /<locale>) → sitemap priority.
const routes: { path: string; priority: number }[] = [
  { path: '', priority: 1 },
  { path: '/cloud', priority: 0.9 },
  { path: '/providers', priority: 0.9 },
  { path: '/contributors', priority: 0.8 },
  { path: '/sponsor', priority: 0.8 },
  { path: '/links', priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Every URL goes through canonicalUrl, which owns SITE_URL and the
  // unprefixed-default-locale rule, so there is no base URL to read here.
  //
  // CONTENT_REVISED, not `new Date()`: lastmod must track content changes, not
  // deploys, or crawlers learn to ignore it.
  const lastModified = CONTENT_REVISED;

  const urls: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of locales) {
      urls.push({
        url: canonicalUrl(locale, route.path),
        lastModified,
        changeFrequency: 'weekly',
        priority: route.priority,
        alternates: {
          languages: {
            ...Object.fromEntries(locales.map((l) => [l, canonicalUrl(l, route.path)])),
            // Mirrors the x-default emitted in <head>; a sitemap that lists
            // only ar and en contradicts the page it points at.
            'x-default': canonicalUrl(defaultLocale, route.path),
          },
        },
      });
    }
  }

  return urls;
}
