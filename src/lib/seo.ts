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

/**
 * When the site's *content* last changed — not when it was last built.
 *
 * The sitemap used to stamp `new Date()`, so every deploy told crawlers all six
 * pages had changed, including deploys that only touched infrastructure. A
 * `lastmod` that always says "now" is one Google is entitled to ignore
 * entirely, which costs the signal for the changes that are real.
 *
 * Bump this when page copy changes — same discipline as the `lastReviewed`
 * field in public/llms.txt and the .well-known files. A build-time git
 * timestamp would automate it, but only if the deploy has git history, which
 * the Cloudflare build does not.
 */
export const CONTENT_REVISED = '2026-08-09';

/**
 * The X account. `creator` is who wrote the page, `site` is who publishes it —
 * X uses `site` for card attribution, and omitting it drops the byline from
 * the card entirely. Same handle here because they are the same account.
 */
const X_HANDLE = '@balsm_health';

/**
 * Alt text for the preview card, per locale.
 *
 * This used to be the wordmark ('بلسم — Balsm.health') on every page, in Arabic
 * regardless of locale. Alt text describes what the image *shows*, and the card
 * shows a headline plus three claims — so that is what these say. It matters
 * more here than on an inline image: on a social timeline the card is the whole
 * post, and this string is the only version of it a screen reader reaches.
 *
 * Keep these in step with the card copy in scripts/generate-brand-assets.mjs.
 */
const OG_IMAGE_ALT = {
  ar: 'بلسم — نظام التشغيل الصحي المملوك للمجتمع. عربيٌّ أولاً، يعمل بلا إنترنت، مفتوح المصدر.',
  en: 'Balsm — the community-owned healthcare OS. Arabic-first, offline-ready, open source.',
} as const;

/**
 * One card for the whole site, in both locales.
 *
 * Deliberate: the card is the brand statement, not a per-page illustration, so
 * every route previews identically and there is exactly one raster to keep
 * current. Only the alt text follows the reader's language.
 */
export function ogImage(locale: string) {
  return {
    url: '/og-image.png',
    width: 1200,
    height: 630,
    alt: locale === 'en' ? OG_IMAGE_ALT.en : OG_IMAGE_ALT.ar,
    type: 'image/png',
  };
}

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
    images: [ogImage(locale)],
  };
}

export function twitter({ locale, title, description }: Omit<PageSeo, 'path'>) {
  return {
    card: 'summary_large_image' as const,
    title,
    description,
    // Object form, not a bare URL string, so the card carries twitter:image:alt
    // as well. X falls back to the og: tags for anything omitted here, but not
    // for alt — it reads twitter:image:alt or nothing.
    images: [ogImage(locale)],
    site: X_HANDLE,
    creator: X_HANDLE,
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
