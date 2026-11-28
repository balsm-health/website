/**
 * Shared Open Graph / Twitter metadata.
 *
 * Next shallow-merges the `openGraph` field: a page that returns its own
 * `openGraph` object replaces the root layout's entirely, so any `images`,
 * `siteName` or `type` set upstream silently vanish from that page. Every page
 * therefore builds its block through `openGraph()` below rather than writing
 * the object by hand — that is what keeps the link-preview card attached.
 *
 * Each route has its own card, per locale (public/og/<card>-<locale>.jpg),
 * rendered by scripts/generate-preview-cards.mjs from preview-cards.json — the
 * one place to change a page's kicker, headline, accent or alt text.
 */

import { defaultLocale as DEFAULT_LOCALE } from '@/i18n/request';
import previewCards from './preview-cards.json';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://balsm.health';

// Hosts whose own origin may stand in for SITE_URL when resolving relative
// metadata URLs (the preview-card images). Anything else, including a forged
// Host header, falls back to SITE_URL.
const TRUSTED_HOST = /^(?:balsm\.health|stg\.balsm\.health|[a-z0-9-]+\.balsm\.workers\.dev|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)$/;

/**
 * The origin to resolve relative metadata URLs against: the host this request
 * came in on, when it is one of ours, else SITE_URL.
 *
 * Preview builds (one *.workers.dev host per branch) have no SITE_URL of their
 * own, so the card images resolved to https://balsm.health/og/… — files that
 * only exist there once the branch is merged — and WhatsApp, finding no image,
 * fell back to the site icon. Canonical, hreflang and og:url are built from
 * SITE_URL explicitly (canonicalUrl below), so this moves only the images.
 */
export function metadataOrigin(host: string | null): URL {
  if (host && TRUSTED_HOST.test(host)) {
    // Every deployed host is HTTPS-only; don't trust a forwarded scheme header
    // that may be absent at the edge and would leave crawlers an http:// image.
    const local = host.startsWith('localhost') || host.startsWith('127.');
    return new URL(`${local ? 'http' : 'https'}://${host}`);
  }
  return new URL(SITE_URL);
}

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
export const CONTENT_REVISED = '2026-09-30';

/**
 * The X account. `creator` is who wrote the page, `site` is who publishes it —
 * X uses `site` for card attribution, and omitting it drops the byline from
 * the card entirely. Same handle here because they are the same account.
 */
const X_HANDLE = '@balsm_health';

export type PreviewCard = keyof typeof previewCards.cards;
type CardEntry = (typeof previewCards.cards)[PreviewCard];

const CARDS = previewCards.cards as Record<PreviewCard, CardEntry>;

/** The card whose `path` is this route; routes without one get the home card. */
export function cardForPath(path: string): PreviewCard {
  const hit = (Object.keys(CARDS) as PreviewCard[]).find((k) => CARDS[k].path === path);
  return hit ?? 'home';
}

/** A route's share copy — eyebrow, title, description — in the reader's language. */
function cardCopy(locale: string, card: PreviewCard) {
  return CARDS[card][locale === 'en' ? 'en' : 'ar'];
}

/**
 * The link-preview image for a route, in the reader's language.
 *
 * Alt text describes what the card shows — on a social timeline the card is
 * the whole post, and this is the only version a screen reader reaches.
 *
 * `?v=<rev>` is part of the URL because social apps cache previews by URL for
 * days: bumping `rev` in preview-cards.json is what makes them refetch.
 */
export function ogImage(locale: string, path = '', card: PreviewCard = cardForPath(path)) {
  const lang = locale === 'en' ? 'en' : 'ar';
  const copy = cardCopy(locale, card);
  return {
    url: `/og/${card}-${lang}.jpg?v=${CARDS[card].rev}`,
    width: 1200,
    height: 630,
    alt: `${copy.eyebrow} — ${copy.title} ${copy.desc}`,
    type: 'image/jpeg',
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
  /** Route below the locale, e.g. '/providers'. Empty for the home page. */
  path?: string;
  /** Overrides the card `path` would pick. */
  card?: PreviewCard;
};

/**
 * The share title and description come from the route's preview card, not the
 * page's <title>: the card copy is written for a feed (title ≤ 60, description
 * ≤ 155 characters, per the design's Link Previews page) and matches what the
 * image says, so the post reads as one thing.
 */
export function openGraph({ locale, path = '', card = cardForPath(path) }: PageSeo) {
  const { title, desc } = cardCopy(locale, card);
  return {
    type: 'website' as const,
    siteName: 'Balsm',
    locale: locale === 'ar' ? 'ar_EG' : 'en_US',
    alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_EG'],
    url: canonicalUrl(locale, path),
    title,
    description: desc,
    images: [ogImage(locale, path, card)],
  };
}

export function twitter({ locale, path = '', card = cardForPath(path) }: PageSeo) {
  const { title, desc } = cardCopy(locale, card);
  return {
    card: 'summary_large_image' as const,
    title,
    description: desc,
    // Object form, not a bare URL string, so the card carries twitter:image:alt
    // as well. X falls back to the og: tags for anything omitted here, but not
    // for alt — it reads twitter:image:alt or nothing.
    images: [ogImage(locale, path, card)],
    site: X_HANDLE,
    creator: X_HANDLE,
  };
}

/**
 * Per-route structured data.
 *
 * The site-level graph (Organization / WebSite / SoftwareApplication) is
 * emitted once from the locale layout, which deliberately carries no WebPage
 * node — it has no way to know which route rendered it, so a WebPage there
 * would hardcode `/` onto every subpage. This builds the missing per-route
 * pair instead: a WebPage anchored to the actual URL and a BreadcrumbList
 * (Home → this page), which is what earns breadcrumb rich results in the SERP.
 *
 * Both nodes reference the site entities by @id, so a crawler resolves the
 * whole graph — page, site, and organisation — as one thing rather than
 * competing fragments. Pass breadcrumb names already localised (the nav
 * labels are the natural source).
 */
type Breadcrumb = { name: string; path: string };

export function pageJsonLd({
  locale,
  path,
  title,
  description,
  breadcrumbs,
}: {
  locale: string;
  /** Route below the locale, e.g. '/providers'. */
  path: string;
  title: string;
  description: string;
  /** Ordered trail from the site root to this page, e.g. Home → Providers. */
  breadcrumbs: Breadcrumb[];
}) {
  const url = canonicalUrl(locale, path);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: locale === 'ar' ? 'ar-EG' : 'en-US',
        isPartOf: { '@id': `${SITE_URL}#website` },
        about: { '@id': `${SITE_URL}#organization` },
        // Tracks content, not deploys — same discipline as the sitemap lastmod.
        dateModified: CONTENT_REVISED,
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: canonicalUrl(locale, crumb.path),
        })),
      },
    ],
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
