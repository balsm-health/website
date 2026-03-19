import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/request';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://balsm.health';

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        ar: `${siteUrl}/ar`,
      },
    },
    openGraph: {
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      url: `${siteUrl}/${locale}`,
    },
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
        description: 'Open source healthcare platform built for providers, patients, and developers.',
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
        sameAs: [
          // Add social media links when available
          // 'https://twitter.com/balsm_health',
          // 'https://github.com/balsm-health',
          // 'https://linkedin.com/company/balsm-health',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}#website`,
        url: siteUrl,
        name: 'Balsm',
        alternateName: 'بلسم',
        description: 'Open source healthcare platform',
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
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/${locale}#webpage`,
        url: `${siteUrl}/${locale}`,
        name: 'Balsm - Open Source Healthcare Platform',
        isPartOf: {
          '@id': `${siteUrl}#website`,
        },
        about: {
          '@id': `${siteUrl}#organization`,
        },
        description: 'Join Balsm - the open source healthcare platform built for providers, patients, and developers.',
        inLanguage: locale === 'ar' ? 'ar-EG' : 'en-US',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Balsm',
        alternateName: 'بلسم',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web, iOS, Android',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/ComingSoon',
          availableAtOrFrom: [
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
              name: 'Global',
            },
          ],
        },
        description: 'Open source healthcare platform for providers, patients, and developers',
        featureList: [
          'Patient Management',
          'Appointment Scheduling',
          'Electronic Health Records',
          'Prescription Management',
          'Telemedicine',
          'Clinical Workflows',
          'Healthcare API',
        ],
        softwareVersion: '1.0',
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
        serviceArea: [
          {
            '@type': 'Country',
            name: 'Egypt',
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
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}#localbusiness`,
        name: 'Balsm',
        image: `${siteUrl}/balsm-logo.svg`,
        '@id': `${siteUrl}#organization`,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'EG',
          addressLocality: 'Cairo',
          addressRegion: 'Cairo Governorate',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '30.0444',
          longitude: '31.2357',
        },
        url: siteUrl,
        telephone: '+20',
        priceRange: 'Free',
        areaServed: [
          {
            '@type': 'Country',
            name: 'Egypt',
            sameAs: 'https://en.wikipedia.org/wiki/Egypt',
          },
          {
            '@type': 'Place',
            name: 'Middle East',
            sameAs: 'https://en.wikipedia.org/wiki/Middle_East',
          },
          {
            '@type': 'Place',
            name: 'MENA',
            description: 'Middle East and North Africa',
          },
          {
            '@type': 'Place',
            name: 'Arab World',
          },
          {
            '@type': 'Place',
            name: 'North Africa',
          },
          {
            '@type': 'Place',
            name: 'Global',
          },
        ],
        knowsLanguage: ['en', 'ar'],
      },
    ],
  };

  let faqJsonLd = null;
  try {
    const fs = require('fs');
    const path = require('path');
    const faqPath = path.join(process.cwd(), 'public/.well-known/faq.json');
    faqJsonLd = JSON.parse(fs.readFileSync(faqPath, 'utf8'));
  } catch (e) {
    console.error('Failed to load FAQ schema');
  }

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
