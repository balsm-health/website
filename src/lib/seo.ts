/**
 * Shared Open Graph / Twitter metadata.
 *
 * Next shallow-merges the `openGraph` field: a page that returns its own
 * `openGraph` object replaces the root layout's entirely, so any `images`,
 * `siteName` or `type` set upstream silently vanish from that page. Every page
 * therefore builds its block through `openGraph()` below rather than writing
 * the object by hand — that is what keeps the link-preview card attached.
 *
 * The card itself is a committed raster (public/og-image.png), generated from
 * the brand SVGs by scripts/generate-brand-assets.mjs.
 */

import { defaultLocale as DEFAULT_LOCALE } from '@/i18n/request';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://balsm.health';

export const OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'بلسم — Balsm.health',
  type: 'image/png',
} as const;

/**
 * Canonical URL for a page. `localePrefix: 'as-needed'` serves the default
 * locale unprefixed and redirects the prefixed form, so pointing crawlers at
 * `/ar/...` would hand them a 307 instead of the page.
 */
export function canonicalUrl(locale: string, path = '') {
  return locale === DEFAULT_LOCALE ? `${SITE_URL}${path}` : `${SITE_URL}/${locale}${path}`;
}

type PageSeo = {
  locale: string;
  title: string;
  description: string;
  /** Route below the locale, e.g. '/providers'. Empty for the home page. */
  path?: string;
};

export function openGraph({ locale, title, description, path = '' }: PageSeo) {
  return {
    type: 'website' as const,
    siteName: 'Balsm',
    locale: locale === 'ar' ? 'ar_EG' : 'en_US',
    alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_EG'],
    url: canonicalUrl(locale, path),
    title,
    description,
    images: [OG_IMAGE],
  };
}

export function twitter({ title, description }: Omit<PageSeo, 'locale' | 'path'>) {
  return {
    card: 'summary_large_image' as const,
    title,
    description,
    images: [OG_IMAGE.url],
    creator: '@balsm_health',
  };
}

export function alternates(locale: string, path = '') {
  return {
    canonical: canonicalUrl(locale, path),
    // Built through canonicalUrl so hreflang can't drift from which locale is
    // the unprefixed one.
    languages: {
      ar: canonicalUrl('ar', path),
      en: canonicalUrl('en', path),
      // Neither locale is a safe default for a reader Google can't place, and
      // without x-default it picks one for them. Point it at the unprefixed
      // form, which is what a bare balsm.health link already resolves to.
      'x-default': canonicalUrl(DEFAULT_LOCALE, path),
    },
  };
}
