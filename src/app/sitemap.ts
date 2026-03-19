import { MetadataRoute } from 'next';
import { locales } from '@/i18n/request';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://balsm.health';
  const lastModified = new Date();

  // Generate URLs for all locales
  const urls: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  locales.forEach((locale) => {
    urls.push({
      url: `${baseUrl}/${locale}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}`])
        ),
      },
    });
  });

  return urls;
}
