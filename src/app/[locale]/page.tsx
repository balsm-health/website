import { getTranslations } from 'next-intl/server';
import SiteShell from '@/components/cloud/SiteShell';
import HomeSections from '@/components/cloud/HomeSections';
import FaqSection from '@/components/cloud/FaqSection';
import { SITE_URL, alternates, canonicalUrl, openGraph, twitter } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'homeMeta' });
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

type FaqItem = { q: string; a: string };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });

  // Generated from the same strings FaqSection renders, so the structured data
  // can never describe questions the reader can't see — which is what Google's
  // FAQ policy requires, and what the previous English-only schema violated.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    // Anchored to the site entity so this resolves as the home page's FAQ
    // rather than a loose node, and so /.well-known/faq.json — which mirrors
    // these same strings — merges with it instead of competing.
    '@id': `${canonicalUrl(locale)}#faq`,
    url: canonicalUrl(locale),
    isPartOf: { '@id': `${SITE_URL}#website` },
    inLanguage: locale === 'ar' ? 'ar-EG' : 'en-US',
    mainEntity: (t.raw('items') as FaqItem[]).map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <SiteShell active="home">
      <HomeSections />
      <FaqSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </SiteShell>
  );
}
