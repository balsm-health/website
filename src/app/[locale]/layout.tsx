import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/request';
import { CONTENT_REVISED, alternates, openGraph, twitter } from '@/lib/seo';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    alternates: alternates(locale),
    openGraph: openGraph({ locale, title, description }),
    twitter: twitter({ title, description }),
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://balsm.health';

  // JSON-LD Structured Data for Search Engines and AI
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}#organization`,
        name: 'Balsm',
        alternateName: 'بلسم',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/balsm-logo.svg`,
        },
        description: 'A community-owned healthcare operating system for the Arab world — Arabic-first, offline-ready, and fully open source.',
        foundingDate: '2026',
        foundingLocation: {
          '@type': 'Place',
          name: 'Egypt',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'EG',
            addressRegion: 'Cairo',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: '30.0444',
            longitude: '31.2357',
          },
        },
        location: {
          '@type': 'Place',
          name: 'Egypt',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'EG',
          },
        },
        areaServed: [
          {
            '@type': 'Country',
            name: 'Egypt',
          },
          {
            '@type': 'Place',
            name: 'Middle East',
          },
          {
            '@type': 'Place',
            name: 'MENA Region',
          },
          {
            '@type': 'Place',
            name: 'Global',
          },
        ],
        knowsLanguage: [
          {
            '@type': 'Language',
            name: 'English',
            alternateName: 'en',
          },
          {
            '@type': 'Language',
            name: 'Arabic',
            alternateName: 'ar',
          },
        ],
        // Every official account, so search engines and answer engines resolve
        // them to one entity instead of several. Mirrors /links.
        sameAs: [
          'https://github.com/balsm-health',
          'https://www.linkedin.com/company/balsm-health',
          'https://x.com/balsm_health',
          'https://facebook.com/balsm.health',
          'https://instagram.com/balsm.health',
          'https://www.youtube.com/@balsm.health',
          'https://tiktok.com/@balsm.health',
          'https://threads.com/@balsm.health',
          'https://patreon.com/balsm_health',
        ],
        email: 'contact@balsm.health',
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}#website`,
        url: siteUrl,
        name: 'Balsm',
        alternateName: 'بلسم',
        description:
          'The first open source initiative for a healthcare technology ecosystem in Egypt and the Arab world — a community-owned, Arabic-first healthcare operating system.',
        // Freshness is a citation signal for AI search, and the graph carried no
        // date at all, so engines had nothing to age the content by. Tracks
        // CONTENT_REVISED, so it moves when the copy does — not on every deploy.
        dateModified: CONTENT_REVISED,
        publisher: {
          '@id': `${siteUrl}#organization`,
        },
        inLanguage: [locale === 'ar' ? 'ar-EG' : 'en-US'],
        audience: {
          '@type': 'PeopleAudience',
          geographicArea: [
            {
              '@type': 'Country',
              name: 'Egypt',
            },
            {
              '@type': 'Place',
              name: 'Middle East and North Africa',
            },
            {
              '@type': 'Place',
              name: 'Global',
            },
          ],
        },
      },
      // No WebPage node. This graph is emitted from the locale layout, which
      // has no way to know which route rendered it, so the node it used to
      // build hardcoded the home URL — every subpage shipped a WebPage
      // claiming to be `/`. Organization and WebSite are genuinely
      // site-level and stay; a per-route WebPage belongs in the page itself.
      {
        '@type': 'SoftwareApplication',
        '@id': `${siteUrl}#software`,
        name: 'Balsm',
        alternateName: 'بلسم',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web, iOS, Android',
        // No `offers`. Nothing has been priced or released, and an Offer
        // without a price fails validation anyway.
        description:
          'A community-owned healthcare operating system for clinics, pharmacies, and labs in the Arab world. Arabic-first, offline-ready, and open source.',
        // Only what the site actually describes. The previous list advertised
        // telemedicine, EHR, appointment scheduling and a public API — none of
        // which appear on any page, and none of which have shipped.
        featureList: [
          'Point of sale',
          'Inventory management',
          'Dispensing',
          'Clinic and pharmacy management',
          'Offline-first operation',
          'Branch sync',
          'Encrypted backups',
          'Lab integration via FHIR',
        ],
        provider: {
          '@id': `${siteUrl}#organization`,
        },
        availableLanguage: [
          {
            '@type': 'Language',
            name: 'English',
          },
          {
            '@type': 'Language',
            name: 'Arabic',
          },
        ],
        isAccessibleForFree: true,
        license: 'https://github.com/balsm-health',
      },
      // The LocalBusiness node was removed. It asserted a Cairo street
      // presence with geo coordinates, which describes a place customers can
      // visit — Balsm is pre-launch software with no premises. It also
      // duplicated the Organization entity, splitting the same brand across
      // two nodes. Where Balsm is from is still stated, on Organization,
      // through foundingLocation.
    ],
  };

  // The FAQ schema used to be read off disk here and injected into every page,
  // in English only, describing questions that appeared nowhere on screen —
  // which is exactly what Google's FAQ policy prohibits. It now lives on the
  // home page, generated from the same strings FaqSection renders.

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Cairo:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        {/* JSON-LD lives in the body, not a hand-written <head>. Crawlers read
            it from anywhere in the document, and App Router owns <head> through
            the metadata API. Keeping our own tags out of it also stops browser
            extensions that inject into <head> from shifting the children React
            hydrates against — which is what produced a hydration mismatch here.
            page.tsx already emits its FAQ block this way. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
